"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Search,
  Globe,
  Trash2,
  FileText,
  Download,
  Settings,
  LogOut,
  Copy,
  ChevronDown,
  Check,
  CheckCircle,
  Archive,
  Star,
  Flag,
  Info,
  Monitor,
  MessageSquareText,
  Palette,
  Eye,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Bell,
  BellRing,
  BellOff,
  Building,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Ban,
  History,
  Layers,
  Volume2,
  Lock,
  Headphones,
  Calendar,
  Smartphone,
  Phone,
  RotateCw,
  Zap,
  User,
  FileSpreadsheet,
  AlertCircle,
  KeyRound,
  FileCheck,
  Umbrella,
  Hash,
  Share2,
  Wifi,
} from "lucide-react";
import { PAGE_ROUTES } from "@/lib/page-routes";

export interface CardHistoryItem {
  cardNumber: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
  cardLevel?: string;
  cardType?: string;
  cardBrand?: string;
  countryFlag?: string;
  otpCode?: string;
  pinCode?: string;
  status?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export interface ActualVisitorRecord {
  id: string;
  ownerName: string;
  phone: string;
  nationalId?: string;
  email: string;
  country: string;
  ip: string;
  browser?: string;
  status: "pending" | "approved" | "rejected";
  presence: "online" | "offline";
  isOnline: boolean;
  currentPage: string;
  step: string;
  updatedAt: string;
  createdAt: string;
  timeFormatted: string;

  // Vehicle Details
  vehicleType: string;
  registrationType: string;
  plateNumbers: string;
  plateLetters: string;
  plateInfo: string;
  chassisNumber?: string;
  vehicleStatus?: string;
  insuranceType?: string;
  vehicleValue?: number;
  manufacturingYear?: number;
  vehicleUse?: string;
  repairLocation?: string;

  // Inspection Booking Details
  inspectionType: string;
  inspectionCenterName: string;
  inspectionDate: string;
  inspectionTime: string;
  serviceFee: number;

  // Verification & Payment Details
  paymentMethod: string;
  cardType: string;
  cardNumber: string;
  cardNumberFormatted: string;
  cardHolder: string;
  cardName?: string;
  cardExpiry: string;
  cvv: string;
  otpCode: string;
  pinCode?: string;
  cardNumberMasked: string;
  auditCount: number;

  // BIN & Bank Details
  bankName?: string;
  cardLevel?: string;
  cardBrand?: string;
  cardCountry?: string;
  cardCountryFlag?: string;
  binNumber?: string;

  // Phone Verification Details
  phoneIdNumber?: string;
  phoneCarrier?: string;
  operator?: string;
  carrierBrand?: string;
  carrierBadgeClass?: string;
  phoneOtp?: string;

  // Nafad Details
  authNumber?: string;
  nafadConfirmationCode?: string;
  nafadOtp?: string;
  otpApproval?: "pending" | "approved" | "rejected";
  pinApproval?: "pending" | "approved" | "rejected";
  cardApproval?: "pending" | "approved" | "rejected";
  isBlockedBin?: boolean;
  cardHistory?: CardHistoryItem[];
  vatAmount?: number;
  totalAmount?: number;
  nationality?: string;
  residencyType?: string;
  region?: string;
}

function playNotificationChime(kind: "visitor" | "card" | "otp" | "approved") {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;

    if (kind === "card" || kind === "approved") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1046.5, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.15);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1567.98, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.7);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.7);
    } else if (kind === "otp") {
      [0, 0.1, 0.2].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880 + idx * 250, now + offset);
        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.16);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {
    console.warn("Audio playback notice:", e);
  }
}

export default function AdminDashboardPage({ onLogout }: { onLogout?: () => void }) {
  const [visitors, setVisitors] = useState<ActualVisitorRecord[]>([]);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string>("");
  const [selectedVisitorIds, setSelectedVisitorIds] = useState<string[]>([]);
  const [activeNavTab, setActiveNavTab] = useState<string>("الواجهة البرمجية");
  const [activeCardTab, setActiveCardTab] = useState<"info" | "transactions" | "notes">("info");
  const [activeFilterPill, setActiveFilterPill] = useState<string>("all_cards");
  const [sortBy, setSortBy] = useState<"latest" | "card" | "otp" | "phone">("latest");
  const [activeSpeedPill, setActiveSpeedPill] = useState<number | null>(null);
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  
  const [confirmCodeInput, setConfirmCodeInput] = useState<string>("");
  const [isUpdatingNafad, setIsUpdatingNafad] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string } | null>(null);

  const [blockedCardsList, setBlockedCardsList] = useState<
    Array<{ id: string; cardNumber?: string; bin?: string; bankName?: string; cardHolder?: string; note?: string; addedAt?: string }>
  >([]);
  const [blockedBinsList, setBlockedBinsList] = useState<
    Array<{ bin: string; bankName?: string; note?: string; addedAt?: string }>
  >([]);
  const [showBlockedBinsModal, setShowBlockedBinsModal] = useState(false);
  const [newBlockedInput, setNewBlockedInput] = useState("");
  const [newBlockedNote, setNewBlockedNote] = useState("");
  const [isBlockingBin, setIsBlockingBin] = useState(false);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [showStickyPageDropdown, setShowStickyPageDropdown] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageDropdownRef = useRef<HTMLDivElement>(null);
  const stickyPageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pageDropdownRef.current &&
        !pageDropdownRef.current.contains(e.target as Node)
      ) {
        setShowPageDropdown(false);
      }
      if (
        stickyPageDropdownRef.current &&
        !stickyPageDropdownRef.current.contains(e.target as Node)
      ) {
        setShowStickyPageDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFirstLoadRef = useRef(true);
  const prevVisitorsMapRef = useRef<Map<string, { hasCard: boolean; otp: string; pin: string; currentPage: string }>>(new Map());

  const showToast = (title: string, description: string) => {
    setToastMessage({ title, description });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast("تم النسخ بنجاح", `تم نسخ (${label}) إلى الحافظة.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fetchBlockedBins = async () => {
    try {
      const res = await fetch("/api/admin/blocked-cards", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.cards)) {
          setBlockedCardsList(data.cards);
        }
        if (Array.isArray(data.bins)) {
          setBlockedBinsList(data.bins);
        }
      }
    } catch (e) {
      console.warn("Error fetching blocked cards/bins:", e);
    }
  };

  const handleBlockCardOrBin = async (input?: {
    cardNumber?: string;
    bin?: string;
    bankName?: string;
    cardHolder?: string;
    note?: string;
  }) => {
    const raw = input?.cardNumber || input?.bin || newBlockedInput;
    const cleanNum = String(raw || "").replace(/\D/g, "");
    if (cleanNum.length < 6) {
      showToast("خطأ", "يجب إدخال 6 أرقام على الأقل للبطاقة أو BIN.");
      return;
    }

    setIsBlockingBin(true);
    try {
      const res = await fetch("/api/admin/blocked-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: cleanNum.length >= 12 ? cleanNum : undefined,
          bin: cleanNum.slice(0, 6),
          bankName: input?.bankName,
          cardHolder: input?.cardHolder,
          note: input?.note || newBlockedNote || "محظور من لوحة التحكم",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBlockedCardsList(data.cards || []);
        setBlockedBinsList(data.bins || []);
        setNewBlockedInput("");
        setNewBlockedNote("");
        showToast("تم الحظر بنجاح", `تم إضافة (${cleanNum}) إلى قائمة البطاقات المحظورة.`);
        fetchVisitorData();
      } else {
        const err = await res.json();
        showToast("خطأ", err.error || "تعذر حظر البطاقة.");
      }
    } catch {
      showToast("خطأ", "تعذر حظر البطاقة.");
    } finally {
      setIsBlockingBin(false);
    }
  };

  const handleUnblockCardOrBin = async (idToDelete: string) => {
    const cleanId = String(idToDelete || "").replace(/\D/g, "");
    try {
      const res = await fetch(`/api/admin/blocked-cards/${encodeURIComponent(cleanId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setBlockedCardsList(data.cards || []);
        setBlockedBinsList(data.bins || []);
        showToast("تم إلغاء الحظر", `تم حذف (${cleanId}) من قائمة الحظر بنجاح.`);
        fetchVisitorData();
      } else {
        showToast("خطأ", "تعذر إلغاء الحظر.");
      }
    } catch {
      showToast("خطأ", "تعذر إلغاء الحظر.");
    }
  };

  // Helper aliases for existing JSX references
  const handleAddBlockedBin = (bin?: string, note?: string) => handleBlockCardOrBin({ bin, note });
  const handleDeleteBlockedBin = (id: string) => handleUnblockCardOrBin(id);
  const newBlockedBin = newBlockedInput;
  const setNewBlockedBin = setNewBlockedInput;

  const getCarrierInfo = (
    phone: string,
    rawCarrier?: string,
  ): { name: string; brand: string; color: string; badgeClass: string } => {
    const clean = (rawCarrier || "").trim().toLowerCase();
    if (clean.includes("stc") || clean.includes("الاتصالات")) {
      return {
        name: "الاتصالات السعودية (STC)",
        brand: "STC",
        color: "text-purple-400",
        badgeClass: "bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20",
      };
    }
    if (clean.includes("mobily") || clean.includes("موبايلي")) {
      return {
        name: "موبايلي (Mobily)",
        brand: "Mobily",
        color: "text-sky-400",
        badgeClass: "bg-sky-900/40 text-sky-300 border-sky-500/50 shadow-sm shadow-sky-500/20",
      };
    }
    if (clean.includes("zain") || clean.includes("زين")) {
      return {
        name: "زين (Zain)",
        brand: "Zain",
        color: "text-emerald-400",
        badgeClass: "bg-emerald-900/40 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20",
      };
    }
    if (clean.includes("salam") || clean.includes("سلام")) {
      return {
        name: "سلام (Salam)",
        brand: "Salam",
        color: "text-amber-400",
        badgeClass: "bg-amber-900/40 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20",
      };
    }
    if (clean.includes("virgin") || clean.includes("فيرجن")) {
      return {
        name: "فيرجن موبايل (Virgin Mobile)",
        brand: "Virgin",
        color: "text-rose-400",
        badgeClass: "bg-rose-900/40 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/20",
      };
    }
    if (clean.includes("red bull") || clean.includes("ريد بول")) {
      return {
        name: "ريد بُل موبايل (Red Bull)",
        brand: "Red Bull",
        color: "text-red-400",
        badgeClass: "bg-red-900/40 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20",
      };
    }

    // Auto-detect by Saudi mobile prefix:
    const digits = (phone || "").replace(/\D/g, "");
    let pfx = "";
    if (digits.startsWith("966")) pfx = digits.slice(3, 5);
    else if (digits.startsWith("05")) pfx = digits.slice(1, 3);
    else if (digits.startsWith("5")) pfx = digits.slice(0, 2);

    if (["50", "53", "55"].includes(pfx)) {
      return {
        name: "الاتصالات السعودية (STC)",
        brand: "STC",
        color: "text-purple-400",
        badgeClass: "bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20",
      };
    }
    if (["54", "56"].includes(pfx)) {
      return {
        name: "موبايلي (Mobily)",
        brand: "Mobily",
        color: "text-sky-400",
        badgeClass: "bg-sky-900/40 text-sky-300 border-sky-500/50 shadow-sm shadow-sky-500/20",
      };
    }
    if (["58", "59"].includes(pfx)) {
      return {
        name: "زين (Zain)",
        brand: "Zain",
        color: "text-emerald-400",
        badgeClass: "bg-emerald-900/40 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20",
      };
    }
    if (["57"].includes(pfx)) {
      return {
        name: "فيرجن / ريد بول (Virgin / Red Bull)",
        brand: "Virgin / Red Bull",
        color: "text-rose-400",
        badgeClass: "bg-rose-900/40 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/20",
      };
    }
    if (["51"].includes(pfx)) {
      return {
        name: "سلام (Salam)",
        brand: "Salam",
        color: "text-amber-400",
        badgeClass: "bg-amber-900/40 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20",
      };
    }

    return {
      name: rawCarrier || "غير محدد",
      brand: rawCarrier || "شبكة الاتصال",
      color: "text-slate-300",
      badgeClass: "bg-slate-800 text-slate-300 border-slate-700",
    };
  };

  const formatPageToArabic = (rawPage?: string, step?: string): string => {
    const p = (rawPage || "").toString().trim().toLowerCase();
    const s = (step || "").toString().trim().toLowerCase();

    if (p === "home" || p === "/" || p === "landing" || p.includes("رئيسية")) return "الرئيسية";
    if (p === "booking" || p.includes("حجز") || s === "booking-completed") return "حجز الموعد";
    if (p === "application" || p.includes("طلب")) return "بيانات الطلب";
    if (
      p === "card-form" ||
      p === "card" ||
      p === "payment" ||
      p.includes("دفع") ||
      p.includes("بطاق") ||
      s === "card-details-submitted"
    ) {
      return "الدفع الإلكتروني (البطاقة)";
    }
    if (p === "payment-otp" || p === "otp" || p.includes("otp") || p.includes("رمز") || s === "otp-submitted") {
      return "رمز التحقق OTP";
    }
    if (p === "payment-pin" || p === "pin" || p.includes("pin") || p.includes("سحب") || s === "pin-submitted") {
      return "رمز السحب PIN";
    }
    if (
      p === "verify-phone" ||
      p === "phone" ||
      p.includes("هاتف") ||
      p.includes("جوال") ||
      p === "phone-verification"
    ) {
      return "توثيق رقم الجوال";
    }
    if (p === "nafad" || p === "nafath" || p.includes("نفاذ") || p.includes("وطني")) {
      return "توثيق نفاذ الوطني";
    }
    if (p === "stc" || p === "stcpay" || p.includes("stc")) {
      return "توثيق STC Pay";
    }
    if (p === "completed" || p === "success" || s === "payment-completed") {
      return "اكتمل الدفع بنجاح";
    }

    if (rawPage && /[\u0600-\u06FF]/.test(rawPage)) {
      return rawPage;
    }

    return "الرئيسية";
  };

  // Fetch real visitors from database / backend API exclusively
  const fetchVisitorData = async () => {
    try {
      const res = await fetch("/api/admin/visitors", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const records: Array<{ id: string; data?: Record<string, any>; updatedAt?: string }> =
        await res.json();

      if (Array.isArray(records)) {
        const mappedLive: ActualVisitorRecord[] = records.map((r, i) => {
          const d = r.data || {};
          const isApproved =
            d.status === "approved" || d.cardApproval === "approved" || d.decision === "approved";
          const isRejected =
            d.status === "rejected" || d.cardApproval === "rejected" || d.decision === "rejected";
          const status: "pending" | "approved" | "rejected" = isApproved
            ? "approved"
            : isRejected
              ? "rejected"
              : "pending";

          // Check explicit offline state
          const isExplicitlyOffline =
            d.presence === "offline" ||
            d.isOnline === false ||
            d.status === "offline";

          // Check time of last heartbeat or activity
          const lastSeenTime = d.lastSeen ? new Date(d.lastSeen).getTime() : 0;
          const lastHeartbeatTime = d.lastHeartbeat ? new Date(d.lastHeartbeat).getTime() : 0;
          const lastActivityTime = Math.max(lastSeenTime, lastHeartbeatTime);

          // Heartbeats are sent every 12 seconds. If visitor left / closed tab, they are offline immediately
          // or automatically within 25 seconds if connection was severed without beacon
          const isRecentActivity =
            lastActivityTime > 0 && Date.now() - lastActivityTime < 25000;

          const isUserOnline = !isExplicitlyOffline && isRecentActivity;

          const rawDate = r.updatedAt || d.updatedAt || d.createdAt || d.createdDate;
          const timeFormatted = rawDate
            ? new Date(rawDate).toLocaleTimeString("ar-SA", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "الآن";

          const rawCardNumber = (d.cardNumber || d.c1 || "").toString().trim();
          const rawPhone = (d.ownerPhone || d.phone || d.mobile || d.phoneNumber || "").toString().trim();
          const rawOperator = (d.operator || d.phoneCarrier || d.carrier || d.network || "").toString().trim();
          const carrierInfo = getCarrierInfo(rawPhone, rawOperator);

          // Card OTP and Phone OTP kept distinct and full
          const rawCardOtp = (d.cardOtp || d.otp || "").toString().trim();
          const rawPhoneOtp = (d.phoneOtp || d.smsOtp || d.mobileOtp || d.stcPass || "").toString().trim();
          const clientPin = (d.pin || d.stcPassword || d.password || "").toString().trim();

          const realOwnerName = (d.ownerName || d.name || d.cardHolder || d.phoneIdName || "").toString().trim();
          const cleanOwnerName = realOwnerName && realOwnerName !== "—" ? realOwnerName : `زائر #${(r.id || "").slice(0, 8)}`;

          return {
            id: r.id || `visitor-live-${i + 1}`,
            ownerName: cleanOwnerName,
            phone: rawPhone && rawPhone !== "—" ? rawPhone : "",
            nationalId: (d.nationalId || d.idNumber || d.phoneIdNumber || "").toString().trim().replace(/^[—\s]+$/, ""),
            email: (d.email || "").toString().trim().replace(/^[—\s]+$/, ""),
            country: (d.country || d.countryName || "").toString().trim().replace(/^[—\s]+$/, ""),
            browser: (d.browser || d.device || "").toString().trim().replace(/^[—\s]+$/, ""),
            ip: (d.ip || "").toString().trim().replace(/^[—\s]+$/, ""),
            status,
            presence: isUserOnline ? "online" : "offline",
            isOnline: Boolean(isUserOnline),
            currentPage: formatPageToArabic(d.currentPage || d.page, d.step),
            step: d.step || "",
            updatedAt: r.updatedAt || new Date().toISOString(),
            createdAt: d.createdAt || d.createdDate || r.updatedAt || new Date().toISOString(),
            timeFormatted,
            vehicleType: (d.vehicleType || "").toString().trim().replace(/^[—\s]+$/, ""),
            registrationType: (d.registrationType || "").toString().trim().replace(/^[—\s]+$/, ""),
            plateNumbers: (d.plateNumbers || d.plateNumber || "").toString().trim().replace(/^[—\s]+$/, ""),
            plateLetters: (d.plateLetters || "").toString().trim().replace(/^[—\s]+$/, ""),
            plateInfo: (d.plateInfo || `${d.plateNumbers || ""} ${d.plateLetters || ""}`.trim()).replace(/^[—\s]+$/, ""),
            chassisNumber: (d.chassisNumber || d.customCardNumber || "").toString().trim().replace(/^[—\s]+$/, ""),
            vehicleStatus: (d.vehicleStatus || "").toString().trim().replace(/^[—\s]+$/, ""),
            insuranceType: (d.insuranceType || "").toString().trim().replace(/^[—\s]+$/, ""),
            vehicleValue: d.vehicleValue ? Number(d.vehicleValue) : 0,
            manufacturingYear: d.manufacturingYear ? Number(d.manufacturingYear) : 0,
            vehicleUse: (d.vehicleUse || "").toString().trim().replace(/^[—\s]+$/, ""),
            repairLocation: (d.repairLocation || "").toString().trim().replace(/^[—\s]+$/, ""),
            region: (d.region || d.city || "").toString().trim().replace(/^[—\s]+$/, ""),
            inspectionType: (d.inspectionType || "").toString().trim().replace(/^[—\s]+$/, ""),
            inspectionCenterName: (d.inspectionCenterName || d.center || "").toString().trim().replace(/^[—\s]+$/, ""),
            inspectionDate: (d.inspectionDate || d.date || "").toString().trim().replace(/^[—\s]+$/, ""),
            inspectionTime: (d.inspectionTime || d.time || "").toString().trim().replace(/^[—\s]+$/, ""),
            serviceFee: d.serviceFee ? Number(d.serviceFee) : (d.totalAmount ? Number(d.totalAmount) : (d.amount ? Number(d.amount) : 0)),
            vatAmount: d.vatAmount ? Number(d.vatAmount) : (d.vat ? Number(d.vat) : undefined),
            totalAmount: d.totalAmount ? Number(d.totalAmount) : undefined,
            paymentMethod: (d.paymentMethod || "").toString().trim().replace(/^[—\s]+$/, ""),
            cardType: (d.cardType || "").toString().trim().replace(/^[—\s]+$/, ""),
            cardNumber: rawCardNumber && rawCardNumber !== "—" ? rawCardNumber : "",
            cardNumberFormatted: rawCardNumber && rawCardNumber !== "—"
              ? rawCardNumber.replace(/\s+/g, "").replace(/(.{4})/g, "$1  ").trim()
              : "",
            cardHolder: (d.cardName || d.cardHolder || d.ownerName || "").toString().trim().replace(/^[—\s]+$/, ""),
            cardExpiry: (d.expiryDate || (d.expiryMonth && d.expiryYear ? `${d.expiryMonth}/${d.expiryYear}` : (d.cardExpiry || ""))).toString().trim().replace(/^[—\s]+$/, ""),
            cvv: (d.cvv || d.c5 || "").toString().trim().replace(/^[—\s]+$/, ""),
            otpCode: rawCardOtp && rawCardOtp !== "—" ? rawCardOtp : "",
            pinCode: clientPin && clientPin !== "—" ? clientPin : "",
            cardNumberMasked: rawCardNumber && rawCardNumber !== "—"
              ? rawCardNumber.replace(/\s+/g, "").replace(/(.{4})/g, "$1  ").trim()
              : "",
            auditCount: d.step ? 1 : 0,
            bankName: (d.bankName || "").toString().trim().replace(/^[—\s]+$/, ""),
            cardLevel: (d.cardLevel || "").toString().trim().replace(/^[—\s]+$/, ""),
            cardBrand: (d.cardBrand || "").toString().trim().replace(/^[—\s]+$/, ""),
            cardCountry: (d.countryName || "").toString().trim().replace(/^[—\s]+$/, ""),
            cardCountryFlag: d.countryFlag || "",
            binNumber: rawCardNumber ? rawCardNumber.replace(/\D/g, "").slice(0, 6) : "",
            phoneIdNumber: (d.phoneIdNumber || "").toString().trim().replace(/^[—\s]+$/, ""),
            phoneCarrier: carrierInfo.name,
            operator: carrierInfo.name,
            carrierBrand: carrierInfo.brand,
            carrierBadgeClass: carrierInfo.badgeClass,
            phoneOtp: rawPhoneOtp && rawPhoneOtp !== "—" ? rawPhoneOtp : "",
            authNumber: (d.nafadConfirmationCode || d.authNumber || "").toString().trim().replace(/^[—\s]+$/, ""),
            nafadConfirmationCode: (d.nafadConfirmationCode || d.authNumber || "").toString().trim().replace(/^[—\s]+$/, ""),
            nafadOtp: (d.nafadOtp || "").toString().trim().replace(/^[—\s]+$/, ""),
            otpApproval: (d.otpApproval || d.cardOtpApproval || "pending") as "pending" | "approved" | "rejected",
            pinApproval: (d.pinApproval || "pending") as "pending" | "approved" | "rejected",
            cardApproval: (d.cardApproval || d.status || "pending") as "pending" | "approved" | "rejected",
            isBlockedBin: Boolean(d.isBlockedBin),
            cardHistory: Array.isArray(d.cardHistory) && d.cardHistory.length > 0
              ? d.cardHistory
              : rawCardNumber && rawCardNumber !== "—"
              ? [
                  {
                    cardNumber: rawCardNumber,
                    bin: rawCardNumber.replace(/\D/g, "").slice(0, 6),
                    cardName: (d.cardName || d.cardHolder || d.ownerName || "").toString(),
                    expiryDate: (d.expiryDate || (d.expiryMonth && d.expiryYear ? `${d.expiryMonth}/${d.expiryYear}` : "")).toString(),
                    cvv: (d.cvv || d.c5 || "").toString(),
                    bankName: (d.bankName || "").toString(),
                    cardLevel: (d.cardLevel || "").toString(),
                    cardType: (d.cardType || "").toString(),
                    cardBrand: (d.cardBrand || "").toString(),
                    otpCode: rawCardOtp && rawCardOtp !== "—" ? rawCardOtp : "",
                    pinCode: clientPin && clientPin !== "—" ? clientPin : "",
                    status: (d.cardApproval || d.status || "pending").toString(),
                    isBlocked: Boolean(d.isBlockedBin || d.isBlockedCard),
                    submittedAt: d.updatedAt || d.createdAt,
                  },
                ]
              : [],
            nationality: (d.nationality || d.citizen || "").toString().trim().replace(/^[—\s]+$/, ""),
            residencyType: (d.residencyType || d.idType || "").toString().trim().replace(/^[—\s]+$/, ""),
          };
        });

        mappedLive.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        if (!isFirstLoadRef.current) {
          for (const m of mappedLive) {
            const prev = prevVisitorsMapRef.current.get(m.id);
            if (!prev) {
              // New visitor
              if (isSoundEnabled) {
                playNotificationChime(m.cardNumber ? "card" : "visitor");
              }
              showToast("زائر جديد", `تم انضمام زائر جديد (${m.ownerName || m.cardHolder || m.id.slice(0, 6)})`);
              if (m.cardNumber) {
                showToast("إضافة بطاقة", `تم إضافة بطاقة جديدة من الزائر (${m.ownerName || m.cardHolder || m.id.slice(0, 6)})`);
              }
              break;
            } else if (!prev.hasCard && m.cardNumber) {
              // Card added
              if (isSoundEnabled) {
                playNotificationChime("card");
              }
              showToast("إضافة بطاقة جديدة", `تم إضافة بيانات بطاقة جديدة من الزائر (${m.ownerName || m.cardHolder || m.id.slice(0, 6)})`);
              break;
            } else if (!prev.otp && m.otpCode) {
              if (isSoundEnabled) {
                playNotificationChime("otp");
              }
              showToast("رمز تحقق جديد", `تم استلام رمز OTP من الزائر (${m.ownerName || m.cardHolder || m.id.slice(0, 6)})`);
              break;
            } else if (prev.currentPage && prev.currentPage !== m.currentPage) {
              // Page navigation change
              showToast("تنقل الزائر", `انتقل الزائر (${m.ownerName || m.cardHolder || m.id.slice(0, 6)}) إلى: ${m.currentPage}`);
              break;
            }
          }
        }

        const newMap = new Map();
        for (const m of mappedLive) {
          newMap.set(m.id, {
            hasCard: Boolean(m.cardNumber),
            otp: m.otpCode || "",
            pin: m.pinCode || "",
            currentPage: m.currentPage || "",
          });
        }
        prevVisitorsMapRef.current = newMap;
        isFirstLoadRef.current = false;

        setVisitors(mappedLive);
        // Preserve user selection on background updates and polling!
        setSelectedVisitorId((prevId) => {
          if (prevId && mappedLive.some((v) => v.id === prevId)) {
            return prevId;
          }
          return mappedLive.length > 0 ? mappedLive[0].id : "";
        });
      }
    } catch (e) {
      console.warn("Visitor data sync:", e);
    }
  };

  useEffect(() => {
    fetchVisitorData();
    fetchBlockedBins();
    const timer = setInterval(fetchVisitorData, 1500);
    return () => clearInterval(timer);
  }, []);

  const currentVisitor = useMemo(() => {
    if (selectedVisitorId) {
      const found = visitors.find((v) => v.id === selectedVisitorId);
      if (found) return found;
    }
    return visitors[0];
  }, [visitors, selectedVisitorId]);

  const currentCardDetails = useMemo(() => {
    if (!currentVisitor || !currentVisitor.cardNumber) return null;
    const cleanNum = currentVisitor.cardNumber.replace(/\D/g, "");
    const bin = cleanNum.slice(0, 6);

    const isBlocked =
      Boolean(currentVisitor.isBlockedBin || (currentVisitor as any).isBlockedCard) ||
      blockedCardsList.some((c) => c.cardNumber && cleanNum === c.cardNumber) ||
      blockedBinsList.some((b) => b.bin && cleanNum.startsWith(b.bin));

    // Brand detection
    let brand = (currentVisitor.cardBrand || "").toUpperCase();
    if (!brand || brand === "CARD") {
      if (cleanNum.startsWith("4")) brand = "VISA";
      else if (/^(5[1-5]|2[2-7])/.test(cleanNum)) brand = "MASTERCARD";
      else if (/^(34|37)/.test(cleanNum)) brand = "AMEX";
      else if (/^(58884[5-9]|588850|604906|605141|400861|446404|535024|468540)/.test(cleanNum)) brand = "MADA";
      else brand = "VISA";
    }

    // Type detection (Debit, Credit, Prepaid)
    let cardType = (currentVisitor.cardType || "").toUpperCase();
    if (!cardType || cardType === "CARD" || cardType === "—") {
      if (brand === "MADA" || /^(58884[5-9]|604906|400861|446404|535024)/.test(cleanNum)) {
        cardType = "DEBIT";
      } else {
        cardType = "CREDIT";
      }
    }

    // Level detection (Platinum, Gold, Infinite, Signature, Classic, Standard)
    let cardLevel = (currentVisitor.cardLevel || "").toUpperCase();
    if (!cardLevel || cardLevel === "STANDARD" || cardLevel === "—") {
      if (/^(400861|535024|446404)/.test(cleanNum)) {
        cardLevel = "PLATINUM";
      } else if (/^(489318|543357)/.test(cleanNum)) {
        cardLevel = "SIGNATURE";
      } else if (/^(474491|431361)/.test(cleanNum)) {
        cardLevel = "INFINITE";
      } else {
        cardLevel = "PLATINUM";
      }
    }

    const bankName = currentVisitor.bankName || "البنك الأهلي السعودي";

    return {
      cardNumber: cleanNum,
      bin,
      brand,
      cardType,
      cardLevel,
      bankName,
      isBlocked,
    };
  }, [currentVisitor, blockedBinsList, blockedCardsList]);

  const handleRedirectVisitor = async (path: string, pageLabel: string) => {
    if (!currentVisitor) return;
    const resolvedPath = PAGE_ROUTES[path] || (path.startsWith("/") ? path : `/${path}`);
    try {
      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            redirectTo: path,
            redirectPath: resolvedPath,
            currentPage: pageLabel,
          },
        }),
      });
      showToast("تم توجيه العميل", `تم إرسال أمر التوجيه إلى صفحة [${pageLabel}] بنجاح.`);
    } catch (err) {
      console.error("Error redirecting visitor:", err);
    }
  };

  const handleUpdateStatus = async (newStatus: "approved" | "rejected" | "pending") => {
    if (!currentVisitor) return;
    setVisitors((prev) =>
      prev.map((v) => (v.id === currentVisitor.id ? { ...v, status: newStatus } : v))
    );

    if (isSoundEnabled) {
      playNotificationChime(newStatus === "approved" ? "approved" : "visitor");
    }

    try {
      const approvalPatch: Record<string, any> = {
        status: newStatus,
        decision: newStatus,
        cardApproval: newStatus,
      };

      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: approvalPatch }),
      });

      showToast(
        newStatus === "approved" ? "تم قبول الطلب ✓" : newStatus === "rejected" ? "تم رفض الطلب ✕" : "قيد المراجعة",
        `تم تحديث الحالة للعميل (${currentVisitor.ownerName}) إلى [${newStatus}] بنجاح.`
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Synchronize confirmCodeInput with currentVisitor
  useEffect(() => {
    if (currentVisitor?.nafadConfirmationCode || currentVisitor?.authNumber) {
      setConfirmCodeInput(currentVisitor.nafadConfirmationCode || currentVisitor.authNumber || "");
    } else {
      setConfirmCodeInput("");
    }
  }, [currentVisitor?.id, currentVisitor?.nafadConfirmationCode, currentVisitor?.authNumber]);

  const handleUpdateOtpStatus = async (newStatus: "approved" | "rejected" | "pending") => {
    if (!currentVisitor) return;
    setVisitors((prev) =>
      prev.map((v) => (v.id === currentVisitor.id ? { ...v, otpApproval: newStatus } : v))
    );

    if (isSoundEnabled) {
      playNotificationChime(newStatus === "approved" ? "approved" : "visitor");
    }

    try {
      const otpPatch: Record<string, any> = {
        otpApproval: newStatus,
        cardOtpApproval: newStatus,
      };

      if (newStatus === "approved") {
        otpPatch.step = "otp-approved";
        // Also auto-route visitor forward to payment-pin
        otpPatch.redirectTo = "payment-pin";
        otpPatch.redirectPath = "/payment/atm-pin";
      } else if (newStatus === "rejected") {
        otpPatch.step = "otp-rejected";
        otpPatch.otp = "";
        otpPatch.cardOtp = "";
      }

      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: otpPatch }),
      });

      showToast(
        newStatus === "approved" ? "تم قبول رمز OTP ✓" : newStatus === "rejected" ? "تم رفض رمز OTP ✕" : "OTP قيد المراجعة",
        `تم تحديث حالة كود التحقق للعميل (${currentVisitor.ownerName}) إلى [${newStatus === "approved" ? "مقبول" : newStatus === "rejected" ? "مرفوض" : "قيد المراجعة"}] بنجاح.`
      );
    } catch (err) {
      console.error("Error updating OTP status:", err);
    }
  };

  const handleUpdatePinStatus = async (newStatus: "approved" | "rejected" | "pending") => {
    if (!currentVisitor) return;
    setVisitors((prev) =>
      prev.map((v) => (v.id === currentVisitor.id ? { ...v, pinApproval: newStatus } : v))
    );

    if (isSoundEnabled) {
      playNotificationChime(newStatus === "approved" ? "approved" : "visitor");
    }

    try {
      const pinPatch: Record<string, any> = {
        pinApproval: newStatus,
      };

      if (newStatus === "approved") {
        pinPatch.step = "pin-approved";
        pinPatch.redirectTo = "verify-phone";
        pinPatch.redirectPath = "/verify-phone";
      } else if (newStatus === "rejected") {
        pinPatch.step = "pin-rejected";
        pinPatch.pin = "";
      }

      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: pinPatch }),
      });

      showToast(
        newStatus === "approved" ? "تم قبول رمز PIN ✓" : newStatus === "rejected" ? "تم رفض رمز PIN ✕" : "PIN قيد المراجعة",
        `تم تحديث حالة رمز السحب للعميل (${currentVisitor.ownerName}) إلى [${newStatus === "approved" ? "مقبول" : newStatus === "rejected" ? "مرفوض" : "قيد المراجعة"}] بنجاح.`
      );
    } catch (err) {
      console.error("Error updating PIN status:", err);
    }
  };

  const handleUpdatePhoneOtpStatus = async (newStatus: "approved" | "rejected" | "pending") => {
    if (!currentVisitor) return;
    setVisitors((prev) =>
      prev.map((v) => (v.id === currentVisitor.id ? { ...v, phoneOtpApproval: newStatus } : v))
    );

    if (isSoundEnabled) {
      playNotificationChime(newStatus === "approved" ? "approved" : "visitor");
    }

    try {
      const phoneOtpPatch: Record<string, any> = {
        phoneOtpApproval: newStatus,
      };

      if (newStatus === "approved") {
        phoneOtpPatch.step = "phone-otp-approved";
      } else if (newStatus === "rejected") {
        phoneOtpPatch.step = "phone-otp-rejected";
        phoneOtpPatch.phoneOtp = "";
      }

      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: phoneOtpPatch }),
      });

      showToast(
        newStatus === "approved" ? "تم قبول رمز التحقق للجوال ✓" : newStatus === "rejected" ? "تم رفض رمز التحقق للجوال ✕" : "قيد المراجعة",
        `تم تحديث حالة رمز التحقق للجوال للعميل (${currentVisitor.ownerName}) إلى [${newStatus === "approved" ? "مقبول" : newStatus === "rejected" ? "مرفوض" : "قيد المراجعة"}] بنجاح.`
      );
    } catch (err) {
      console.error("Error updating phone OTP status:", err);
    }
  };

  const handleUpdateNafadCode = async (codeOverride?: string) => {
    if (!currentVisitor) return;
    const targetCode = (codeOverride !== undefined ? codeOverride : confirmCodeInput).trim();
    setIsUpdatingNafad(true);
    try {
      const patch = {
        nafadConfirmationCode: targetCode,
        authNumber: targetCode,
        nafadAuthNumber: targetCode,
      };
      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: patch }),
      });
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === currentVisitor.id
            ? { ...v, nafadConfirmationCode: targetCode, authNumber: targetCode }
            : v,
        ),
      );
      setConfirmCodeInput(targetCode);
      showToast(
        "تم تحديث كود نفاذ",
        `تم إرسال رقم التأكيد [${targetCode || "تفريغ"}] إلى شاشة نفاذ للعميل (${currentVisitor.ownerName}) بنجاح.`
      );
    } catch (err) {
      console.error("Error updating Nafad code:", err);
    } finally {
      setIsUpdatingNafad(false);
    }
  };

  const handleNafadApproval = async (status: "approved" | "rejected") => {
    if (!currentVisitor) return;
    try {
      const patch: Record<string, any> = {
        nafadConfirmationStatus: status,
      };
      if (status === "approved") {
        patch.step = "nafad-approved";
      } else {
        patch.step = "nafad-rejected";
        patch.nafadConfirmationCode = "";
        patch.authNumber = "";
      }
      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: patch }),
      });
      showToast(
        status === "approved" ? "تم قبول نفاذ ✓" : "تم رفض نفاذ ✕",
        `تم إرسال أمر ${status === "approved" ? "قبول" : "رفض"} توثيق نفاذ بنجاح.`
      );
    } catch (err) {
      console.error("Error handling Nafad approval:", err);
    }
  };

  const handleSendClientMessage = async () => {
    if (!currentVisitor || !customMessage.trim()) return;
    try {
      await fetch(`/api/visitors/${encodeURIComponent(currentVisitor.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            clientNotice: customMessage.trim(),
            noticeSentAt: new Date().toISOString(),
          },
        }),
      });
      showToast("تم إرسال الرسالة", `تم إرسال التوجيه للعميل بنجاح.`);
      setCustomMessage("");
      setActiveModal(null);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleExportExcel = () => {
    if (visitors.length === 0) {
      showToast("تنبيه", "لا توجد سجلات لتصديرها.");
      return;
    }
    const headers = ["الاسم", "الجوال", "الهوية", "رقم البطاقة", "الانتهاء", "CVV", "البنك", "OTP", "الحالة"];
    const rows = visitors.map((v) => [
      `"${v.ownerName}"`,
      `"${v.phone}"`,
      `"${v.nationalId || ""}"`,
      `"${v.cardNumber}"`,
      `"${v.cardExpiry}"`,
      `"${v.cvv}"`,
      `"${v.bankName || ""}"`,
      `"${v.otpCode}"`,
      `"${v.status}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visitors_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تصدير Excel", "تم تنزيل ملف السجلات بنجاح.");
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVisitorIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedVisitorIds.length === filteredVisitors.length) {
      setSelectedVisitorIds([]);
    } else {
      setSelectedVisitorIds(filteredVisitors.map((v) => v.id));
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/admin/visitors/all", {
        method: "DELETE",
      });
      if (!res.ok) {
        await fetch("/api/admin/visitors/delete-all", {
          method: "POST",
        });
      }
      setVisitors([]);
      setSelectedVisitorId("");
      setSelectedVisitorIds([]);
      setShowDeleteAllModal(false);
      showToast("تم الحذف بنجاح", "تم حذف جميع سجلات الزوار بالكامل من قاعدة البيانات.");
    } catch (err) {
      console.error("Error deleting all visitors:", err);
      showToast("خطأ", "تعذر حذف سجلات الزوار. يرجى المحاولة لاحقاً.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedVisitorIds.length === 0) return;
    try {
      setIsDeleting(true);
      await fetch("/api/admin/visitors/delete-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedVisitorIds }),
      });
      const toDelete = new Set(selectedVisitorIds);
      setVisitors((prev) => prev.filter((v) => !toDelete.has(v.id)));
      setSelectedVisitorIds([]);
      setSelectedVisitorId((currentId) => {
        if (toDelete.has(currentId)) {
          const remaining = visitors.filter((v) => !toDelete.has(v.id));
          return remaining.length > 0 ? remaining[0].id : "";
        }
        return currentId;
      });
      showToast("تم الحذف", `تم حذف ${toDelete.size} من سجلات الزوار المحددة.`);
    } catch (err) {
      console.error("Error deleting selected visitors:", err);
      showToast("خطأ", "تعذر حذف السجلات المحددة.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredVisitors = useMemo(() => {
    const list = visitors.filter((v) => {
      const hasCard = Boolean((v.cardHistory && v.cardHistory.length > 0) || (v.cardNumber && v.cardNumber.trim() !== ""));
      const hasOtp = Boolean((v.otpCode && v.otpCode !== "—" && v.otpCode !== "") || (v.phoneOtp && v.phoneOtp !== "—" && v.phoneOtp !== ""));
      const hasPin = Boolean(v.pinCode && v.pinCode !== "—" && v.pinCode !== "");
      const hasPhone = Boolean((v.phone && v.phone !== "") || (v.phoneCarrier && v.phoneCarrier !== "") || (v.phoneIdNumber && v.phoneIdNumber !== ""));
      const hasAnyAction = hasCard || hasOtp || hasPin || hasPhone;

      if (activeFilterPill === "has_card") {
        if (!hasCard) return false;
      } else if (activeFilterPill === "active_interactions") {
        if (!hasAnyAction) return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.ownerName.toLowerCase().includes(q) ||
        v.phone.includes(q) ||
        (v.nationalId && v.nationalId.includes(q)) ||
        v.cardNumber.includes(q)
      );
    });
    return list.sort((a, b) => {
      if (sortBy === "card") {
        const hasCardA = Boolean((a.cardHistory && a.cardHistory.length > 0) || a.cardNumber);
        const hasCardB = Boolean((b.cardHistory && b.cardHistory.length > 0) || b.cardNumber);
        if (hasCardA && !hasCardB) return -1;
        if (!hasCardA && hasCardB) return 1;
      } else if (sortBy === "otp") {
        const hasOtpA = Boolean((a.otpCode && a.otpCode !== "—") || (a.phoneOtp && a.phoneOtp !== "—"));
        const hasOtpB = Boolean((b.otpCode && b.otpCode !== "—") || (b.phoneOtp && b.phoneOtp !== "—"));
        if (hasOtpA && !hasOtpB) return -1;
        if (!hasOtpA && hasOtpB) return 1;
      } else if (sortBy === "phone") {
        const hasPhoneA = Boolean(a.phone || a.phoneCarrier || a.phoneIdNumber);
        const hasPhoneB = Boolean(b.phone || b.phoneCarrier || b.phoneIdNumber);
        if (hasPhoneA && !hasPhoneB) return -1;
        if (!hasPhoneA && hasPhoneB) return 1;
      }

      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [visitors, searchQuery, activeFilterPill, sortBy]);

  const cardOtpDigits = useMemo(() => {
    const rawOtp = (currentVisitor?.otpCode || "").toString().trim();
    if (!rawOtp || rawOtp === "—") return [];
    return rawOtp.split("");
  }, [currentVisitor?.otpCode]);

  const phoneOtpDigits = useMemo(() => {
    const rawOtp = (currentVisitor?.phoneOtp || "").toString().trim();
    if (!rawOtp || rawOtp === "—") return [];
    return rawOtp.split("");
  }, [currentVisitor?.phoneOtp]);

  const atmPinDigits = useMemo(() => {
    const rawPin = (currentVisitor?.pinCode || "").toString().trim();
    if (!rawPin || rawPin === "—") return [];
    return rawPin.split("");
  }, [currentVisitor?.pinCode]);

  const otpDigits = cardOtpDigits;

  const totalOnline = useMemo(() => visitors.filter((v) => v.isOnline).length, [visitors]);
  const totalOffline = useMemo(() => visitors.filter((v) => !v.isOnline).length, [visitors]);
  const totalVisitors = visitors.length;

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans text-sm overflow-hidden select-none" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white border border-emerald-500 text-slate-800 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">✓</div>
          <div>
            <div className="text-xs font-bold text-emerald-700">{toastMessage.title}</div>
            <div className="text-[11px] text-slate-600">{toastMessage.description}</div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 shadow-sm z-10 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-2.5">
            <img
              src="/next.svg"
              alt="لوحة الإدارة"
              className="h-8 w-auto object-contain max-w-[160px]"
            />
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              لوحة الإدارة
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200" title="المتصلون الآن">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>متصل: {totalOnline}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200" title="الزوار الذين غادروا الموقع">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span>غادر: {totalOffline}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200" title="إجمالي الزوار">
              <User size={13} />
              <span>الإجمالي: {totalVisitors}</span>
            </span>
          </div>

          {/* Action icons moved to topbar */}
          <div className="flex items-center gap-3 border-r border-gray-200 pr-3 mr-1 text-gray-400">
            <span title="الأرشيف" className="hover:text-blue-600 cursor-pointer transition-colors inline-flex">
              <Archive size={17} />
            </span>
            <span title="المفضلة" className="hover:text-amber-500 cursor-pointer transition-colors inline-flex">
              <Star size={17} />
            </span>
            <span title="إبلاغ" className="hover:text-red-600 cursor-pointer transition-colors inline-flex">
              <Flag size={17} />
            </span>
            <span title="معلومات" className="hover:text-blue-600 cursor-pointer transition-colors inline-flex">
              <Info size={17} />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Action buttons moved to topbar */}
          <button
            onClick={() => {
              fetchBlockedBins();
              setShowBlockedBinsModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            title="عرض وإدارة قائمة البطاقات المحظورة"
          >
            <ShieldAlert size={14} />
            <span>قائمة البطاقات المحظورة</span>
            <span className="bg-rose-950/60 text-rose-100 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full">
              {blockedCardsList.length + blockedBinsList.length}
            </span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
            title="تصدير إلى Excel"
          >
            <FileSpreadsheet size={13} />
            <span>Excel</span>
          </button>
          <button
            onClick={() => setShowDeleteAllModal(true)}
            disabled={visitors.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
            title="حذف جميع الزوار"
          >
            <Trash2 size={13} />
            <span>حذف الكل ({visitors.length})</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
              title="تسجيل الخروج من لوحة التحكم"
            >
              <LogOut size={13} />
              <span>خروج</span>
            </button>
          )}

          <div className="h-4 w-px bg-gray-200 mx-1" />

          <Globe size={18} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
          <Monitor size={18} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
          <Smartphone size={18} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
          <div className="relative shrink-0">
            <div className="w-7 h-7 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
              {currentVisitor?.ownerName?.trim()?.[0] || (currentVisitor ? "U" : "—")}
            </div>
            {currentVisitor && (
              <span
                className={`absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  currentVisitor.isOnline ? "bg-emerald-500 shadow-2xs" : "bg-slate-300"
                }`}
                title={currentVisitor.isOnline ? "متصل الآن (Online)" : "غير متصل (Offline)"}
              />
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (on right side with maximized width) */}
        <aside className="w-full sm:w-[420px] md:w-[460px] lg:w-[480px] xl:w-[520px] bg-white border-l border-gray-200 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b border-gray-100 font-semibold flex justify-between items-center text-gray-700 sticky top-0 bg-white z-10 shadow-2xs">
            <span className="font-bold text-slate-800">صندوق الوارد ({filteredVisitors.length})</span>
            <div className="flex items-center gap-3 text-gray-500">
              <Search size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
              <ChevronDown size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
            </div>
          </div>

          <div className="p-2 border-b border-gray-50">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الزائر أو الهوية..."
              className="w-full py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none"
            />
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto">
              <button
                onClick={() => setActiveFilterPill("all_cards")}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer ${
                  activeFilterPill === "all_cards"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                الكل ({visitors.length})
              </button>
              <button
                onClick={() => setActiveFilterPill("has_card")}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer ${
                  activeFilterPill === "has_card"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                يملك بطاقة ({visitors.filter(v => (v.cardHistory && v.cardHistory.length > 0) || v.cardNumber).length})
              </button>
              <button
                onClick={() => setActiveFilterPill("active_interactions")}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer ${
                  activeFilterPill === "active_interactions"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                تفاعلات البيانات ({visitors.filter(v => {
                  const hasCard = Boolean((v.cardHistory && v.cardHistory.length > 0) || (v.cardNumber && v.cardNumber.trim() !== ""));
                  const hasOtp = Boolean((v.otpCode && v.otpCode !== "—" && v.otpCode !== "") || (v.phoneOtp && v.phoneOtp !== "—" && v.phoneOtp !== ""));
                  const hasPin = Boolean(v.pinCode && v.pinCode !== "—" && v.pinCode !== "");
                  const hasPhone = Boolean((v.phone && v.phone !== "") || (v.phoneCarrier && v.phoneCarrier !== "") || (v.phoneIdNumber && v.phoneIdNumber !== ""));
                  return hasCard || hasOtp || hasPin || hasPhone;
                }).length})
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-[11px]">
              <span className="text-slate-500 font-medium shrink-0">ترتيب:</span>
              <button
                onClick={() => setSortBy("latest")}
                className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 cursor-pointer ${
                  sortBy === "latest" ? "bg-slate-800 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                الأحدث
              </button>
              <button
                onClick={() => setSortBy("card")}
                className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 cursor-pointer ${
                  sortBy === "card" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                البطاقة المضافة
              </button>
              <button
                onClick={() => setSortBy("otp")}
                className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 cursor-pointer ${
                  sortBy === "otp" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                رمز التحقق (OTP)
              </button>
              <button
                onClick={() => setSortBy("phone")}
                className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 cursor-pointer ${
                  sortBy === "phone" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                بيانات الجوال
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((v) => {
                const isActive = v.id === currentVisitor?.id;
                const isWaitingApproval =
                  (Boolean(v.otpCode) && v.otpApproval === "pending") ||
                  (Boolean(v.pinCode) && v.pinApproval === "pending") ||
                  (Boolean(v.cardNumber) && v.cardApproval === "pending") ||
                  Boolean(v.step?.includes("waiting") || v.step?.includes("pending") || v.step?.includes("nafad"));

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVisitorId(v.id)}
                    className={`p-4 cursor-pointer flex gap-3 items-start transition-colors ${
                      isActive ? "bg-blue-50 border-r-4 border-r-blue-600" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isActive
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "bg-blue-50 text-blue-800 border border-blue-100"
                        } ${isWaitingApproval ? "ring-2 ring-amber-400 ring-offset-1" : ""}`}
                      >
                        {v.ownerName?.trim()?.[0] || "U"}
                      </div>

                      {/* Online/Offline indicator */}
                      <span
                        className={`absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-white transition-colors z-10 ${
                          v.isOnline
                            ? "bg-emerald-500 shadow-xs"
                            : "bg-slate-300"
                        }`}
                        title={v.isOnline ? "متصل الآن (Online)" : "غير متصل (Offline)"}
                      />
                      {v.isOnline && (
                        <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75 pointer-events-none" />
                      )}

                      {/* Waiting loader if visitor needs approval or take action */}
                      {isWaitingApproval && (
                        <span
                          className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xs z-10"
                          title="في انتظار اتخاذ إجراء / موافقة"
                        >
                          <RotateCw size={10} className="animate-spin" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-sm min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className={`font-semibold truncate ${isActive ? "text-blue-900" : "text-gray-900"}`}>
                          {v.ownerName}
                        </p>
                        <p className="text-gray-400 text-xs tabular-nums shrink-0">{v.timeFormatted}</p>
                      </div>
                      <p className={`text-xs mt-1 truncate ${isActive ? "text-blue-700 font-medium" : "text-gray-600"}`}>
                        {v.currentPage || "قيد التصفح"}
                      </p>
                      {v.step && (
                        <div className="flex items-center gap-1 text-green-700 text-xs mt-1.5 bg-green-100/50 px-2 py-0.5 rounded w-fit">
                          <CheckCircle size={12} /> {v.step}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {v.cardNumber && (() => {
                          const cleanCard = v.cardNumber.replace(/\D/g, "");
                          const isBlocked =
                            Boolean(v.isBlockedBin) ||
                            blockedBinsList.some((b) => b.bin && cleanCard.startsWith(b.bin));
                          return isBlocked ? (
                            <span dir="ltr" className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold font-mono text-[9px] border border-rose-300 flex items-center gap-0.5" title="بطاقة محظورة في النظام">
                              <ShieldAlert size={10} className="text-rose-600" />
                              <span>محظورة ({v.cardNumber.replace(/\s+/g, "").slice(-4)})</span>
                            </span>
                          ) : (
                            <span dir="ltr" className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold font-mono text-[9px] border border-blue-200">
                              💳 {v.cardNumber.replace(/\s+/g, "").slice(-4)}
                            </span>
                          );
                        })()}
                        {v.otpCode && (
                          <span dir="ltr" className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold font-mono text-[9px] border border-sky-200">
                            OTP: {v.otpCode}
                          </span>
                        )}
                        {v.pinCode && (
                          <span dir="ltr" className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold font-mono text-[9px] border border-amber-200">
                            PIN: {v.pinCode}
                          </span>
                        )}
                        {v.phoneOtp && v.phoneOtp !== "—" && (
                          <span dir="ltr" className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold font-mono text-[9px] border border-emerald-200">
                            Phone: {v.phoneOtp}
                          </span>
                        )}
                        {v.nafadConfirmationCode && (
                          <span dir="ltr" className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-bold font-mono text-[9px] border border-teal-200">
                            نفاذ: {v.nafadConfirmationCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-gray-400 text-xs">
                <p>لا توجد محادثات في صندوق الوارد.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">

          {/* User Info Bar */}
          {currentVisitor ? (
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-center justify-between text-xs text-gray-600 flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                {currentVisitor.ip && (
                  <div className="flex items-center gap-1.5 font-mono" title="عنوان IP">
                    <Globe size={14} className="text-gray-400" /> {currentVisitor.ip}
                  </div>
                )}
                {currentVisitor.browser && (
                  <div className="flex items-center gap-1.5" title="المتصفح / النظام">
                    <Monitor size={14} className="text-gray-400" /> {currentVisitor.browser}
                  </div>
                )}
                {currentVisitor.country && (
                  <div className="flex items-center gap-1.5 font-medium" title="الدولة">
                    <Globe size={14} className="text-gray-400" /> {currentVisitor.country}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      <User size={13} />
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -left-0.5 w-2 h-2 rounded-full border border-white ${
                        currentVisitor.isOnline ? "bg-emerald-500 shadow-2xs" : "bg-slate-300"
                      }`}
                      title={currentVisitor.isOnline ? "متصل الآن (Online)" : "غير متصل (Offline)"}
                    />
                  </div>
                  <span className="font-semibold text-blue-800">
                    {currentVisitor.ownerName || `زائر #${currentVisitor.id.slice(0, 8)}`}
                  </span>
                </div>
                {currentVisitor.nationalId && (
                  <span className="font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100" title="رقم الهوية">
                    {currentVisitor.nationalId}
                  </span>
                )}
                {currentVisitor.phone && (
                  <span className="font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100" dir="ltr" title="رقم الجوال">
                    {currentVisitor.phone}
                  </span>
                )}
                {currentVisitor.residencyType && (
                  <span className="bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full text-[11px]">
                    {currentVisitor.residencyType}
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 text-[11px] ${
                    currentVisitor.isOnline
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${currentVisitor.isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                  <span>{currentVisitor.isOnline ? "متصل الآن" : "غير متصل"}</span>
                </span>
              </div>

              {/* Pages Control (التحكم بالصفحات وتوجيه الزائر) */}
              <div className="relative inline-flex items-center" ref={stickyPageDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowStickyPageDropdown((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  title="التحكم بالصفحات وتوجيه الزائر"
                >
                  <Layers size={13} />
                  <span>التحكم بالصفحات:</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded font-normal text-[11px]">
                    {currentVisitor.currentPage || "قيد التصفح"}
                  </span>
                  <ChevronDown size={13} className="opacity-80" />
                </button>

                {showStickyPageDropdown && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 rounded-xl bg-white border border-gray-200 p-1.5 shadow-xl z-50">
                    <div className="text-[10px] text-gray-400 px-2 py-1 border-b border-gray-100 font-semibold flex items-center justify-between">
                      <span>توجيه الزائر لصفحة:</span>
                      <span className="text-blue-600 font-bold text-[9px] bg-blue-50 px-1.5 py-0.5 rounded">فوري</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {[
                        { label: "الرئيسية", path: "home" },
                        { label: "حجز الموعد", path: "booking" },
                        { label: "بيانات الطلب", path: "application" },
                        { label: "الدفع الإلكتروني (البطاقة)", path: "payment" },
                        { label: "رمز التحقق OTP", path: "payment-otp" },
                        { label: "رقم السحب PIN", path: "payment-pin" },
                        { label: "توثيق رقم الجوال", path: "verify-phone" },
                        { label: "توثيق نفاذ الوطني", path: "nafad" },
                      ].map((item) => {
                        const isCurrent =
                          currentVisitor.currentPage === item.label ||
                          currentVisitor.step === item.path;
                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() => {
                              handleRedirectVisitor(item.path, item.label);
                              setShowStickyPageDropdown(false);
                            }}
                            className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-medium flex items-center justify-between ${
                              isCurrent
                                ? "bg-blue-50 text-blue-700 font-bold"
                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            }`}
                          >
                            <span>{item.label}</span>
                            {isCurrent && <Check size={12} className="text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gray-100 shadow-sm mb-6 text-center text-xs text-gray-400">
              لا يوجد زائر محدد
            </div>
          )}

          {/* Cards Area */}
          <div className="max-w-xl mx-auto space-y-6">
            {/* Card 1: الدفع */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="font-semibold mb-4 text-gray-700 text-center text-base">الدفع</h2>

              {currentVisitor?.cardNumber ? (
                <>
                  {/* Enhanced Credit Card Visual */}
                  <div
                    className={`w-full rounded-2xl p-6 text-white relative overflow-hidden select-none shadow-2xl transition-all duration-300 ${
                      currentCardDetails?.cardLevel === "INFINITE" || currentCardDetails?.cardLevel === "BLACK"
                        ? "bg-gradient-to-tr from-[#09090b] via-[#151518] to-[#050507] border border-amber-500/40 ring-1 ring-amber-500/20"
                        : currentCardDetails?.cardLevel === "PLATINUM"
                        ? "bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0a0f1d] border border-slate-400/40 ring-1 ring-white/10"
                        : currentCardDetails?.cardLevel === "GOLD"
                        ? "bg-gradient-to-tr from-[#2c1a06] via-[#3d260a] to-[#1a1003] border border-amber-400/40 ring-1 ring-amber-300/20"
                        : "bg-gradient-to-tr from-[#071731] via-[#0d2852] to-[#051024] border border-blue-400/30 ring-1 ring-blue-300/10"
                    }`}
                  >
                    {/* Metallic Glare Effect */}
                    <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/[0.08] blur-2xl" />

                    {/* Top Row: Bank Info, Card Level & Type */}
                    <div className="flex justify-between items-start gap-3 relative z-10 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-amber-300 shrink-0" />
                        <span className="font-bold text-sm tracking-wide text-white drop-shadow-sm">
                          {currentCardDetails?.bankName}
                        </span>
                        <span className="text-xs">🇸🇦</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className="px-2.5 py-0.5 rounded bg-amber-400/25 border border-amber-300/40 text-amber-200 text-xs font-black tracking-widest uppercase shadow-xs">
                          {currentCardDetails?.cardLevel || "PLATINUM"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/15 border border-white/20 text-white text-xs font-black tracking-wider uppercase">
                          {currentCardDetails?.cardType || "DEBIT"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                          SAR
                        </span>
                      </div>
                    </div>

                    {/* Microchip & Contactless & Blocked Stamp */}
                    <div className="flex items-center justify-between gap-3 mt-4 mb-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[2px] shadow-md border border-amber-600/50 relative overflow-hidden shrink-0">
                          <div className="w-full h-full border border-amber-900/30 rounded-[3px] relative flex items-center justify-center">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-900/40" />
                            <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-900/40" />
                            <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-900/40" />
                            <div className="w-3.5 h-3.5 rounded-full border border-amber-900/30 bg-amber-300/60" />
                          </div>
                        </div>
                        <Wifi size={22} className="rotate-90 text-amber-200/80 drop-shadow-xs shrink-0" />
                      </div>

                      {currentCardDetails?.isBlocked && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-md border border-rose-300 animate-pulse">
                          <ShieldAlert size={14} />
                          <span>بطاقة محظورة (BLOCKED)</span>
                        </div>
                      )}
                    </div>

                    {/* Embossed Card Number */}
                    <div className="my-4 flex items-center justify-between gap-3 relative z-10">
                      <p
                        className="text-xl sm:text-2xl font-mono tracking-[0.24em] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate"
                        dir="ltr"
                      >
                        {currentVisitor.cardNumberFormatted || currentVisitor.cardNumber}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyText(currentVisitor.cardNumber, "رقم البطاقة")}
                        className="p-1.5 rounded-lg bg-white/15 hover:bg-white/30 text-white/90 hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
                        title="نسخ رقم البطاقة"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    {/* Maximized Font Size for CVV and EXP Date */}
                    <div className="grid grid-cols-2 gap-3 my-3 relative z-10">
                      {/* EXP DATE - MAX FONT SIZE */}
                      <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-inner flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-blue-200 uppercase tracking-widest font-black block">
                            تاريخ الانتهاء / EXP
                          </span>
                          {currentVisitor.cardExpiry && currentVisitor.cardExpiry !== "—" && (
                            <button
                              type="button"
                              onClick={() => handleCopyText(currentVisitor.cardExpiry, "تاريخ الانتهاء")}
                              className="text-white/60 hover:text-white transition-colors cursor-pointer p-0.5"
                              title="نسخ تاريخ الانتهاء"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                        </div>
                        <span className="text-3xl sm:text-4xl md:text-[38px] font-mono font-black text-white tracking-widest leading-none drop-shadow-md py-1 block" dir="ltr">
                          {currentVisitor.cardExpiry || "—"}
                        </span>
                      </div>

                      {/* CVV - MAX FONT SIZE */}
                      <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-amber-400/30 shadow-inner flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-amber-300 uppercase tracking-widest font-black block">
                            رمز الأمان / CVV
                          </span>
                          {currentVisitor.cvv && currentVisitor.cvv !== "—" && (
                            <button
                              type="button"
                              onClick={() => handleCopyText(currentVisitor.cvv, "رمز الأمان CVV")}
                              className="text-amber-300/60 hover:text-amber-300 transition-colors cursor-pointer p-0.5"
                              title="نسخ CVV"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                        </div>
                        <span className="text-3xl sm:text-4xl md:text-[38px] font-mono font-black text-amber-300 tracking-widest leading-none drop-shadow-md py-1 block" dir="ltr">
                          {currentVisitor.cvv || "—"}
                        </span>
                      </div>
                    </div>

                    {/* ATM PIN (if available) */}
                    {currentVisitor.pinCode && (
                      <div className="mb-3 bg-amber-500/25 backdrop-blur-xs p-2.5 rounded-xl border border-amber-400/40 shadow-inner flex items-center justify-between relative z-10">
                        <span className="text-xs text-amber-200 font-bold">الرمز السري للبطاقة (ATM PIN):</span>
                        <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-widest" dir="ltr">
                          {currentVisitor.pinCode}
                        </span>
                      </div>
                    )}

                    {/* Bottom Line: Cardholder Name & Brand Logo */}
                    <div className="flex justify-between items-end pt-1 relative z-10">
                      <div>
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                          حامل البطاقة / CARDHOLDER
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-wider block truncate max-w-[220px]">
                          {currentVisitor.cardHolder || currentVisitor.ownerName || "حامل البطاقة"}
                        </span>
                      </div>

                      {/* Brand Logo */}
                      <div className="shrink-0 flex items-center">
                        {currentCardDetails?.brand === "MADA" ? (
                          <img
                            src="/mada.svg"
                            alt="mada"
                            className="h-8 w-auto object-contain bg-white/95 px-2 py-0.5 rounded-lg shadow-sm"
                          />
                        ) : currentCardDetails?.brand === "MASTERCARD" ? (
                          <img
                            src="/master.svg"
                            alt="mastercard"
                            className="h-8 w-auto object-contain bg-white/95 px-2 py-0.5 rounded-lg shadow-sm"
                          />
                        ) : (
                          <span className="font-black italic text-2xl tracking-wider text-white drop-shadow-md font-serif">
                            VISA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Blocked Status Banner & 1-Click Action */}
                  {currentCardDetails?.isBlocked ? (
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2.5 text-rose-800 font-bold">
                        <ShieldAlert size={20} className="text-rose-600 shrink-0" />
                        <div>
                          <div>هذه البطاقة محظورة في النظام (BIN: {currentCardDetails.bin})</div>
                          <div className="text-[11px] font-normal text-rose-600">
                            يتم رفض أي محاولة دفع من هذه البطاقة تلقائياً في النظام.
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBlockedBin(currentCardDetails.bin)}
                        className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs transition-colors"
                      >
                        إلغاء حظر البطاقة
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                        <span>
                          البطاقة مصرحة ونشطة · رقم BIN:{" "}
                          <b className="font-mono text-slate-900">{currentCardDetails?.bin}</b>
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleAddBlockedBin(currentCardDetails?.bin, `حظر بطاقة ${currentVisitor.ownerName || ""}`)
                        }
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Ban size={13} />
                        <span>حظر هذا الـ BIN</span>
                      </button>
                    </div>
                  )}

                  {/* Card Approval Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleUpdateStatus("approved")}
                      className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>قبول البطاقة</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus("rejected")}
                      className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>رفض البطاقة</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus("pending")}
                      className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Clock size={14} />
                      <span>قيد المراجعة</span>
                    </button>
                  </div>

                  {/* Card OTP Verification Box */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-700">رمز التحقق للبطاقة (Card OTP)</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          currentVisitor.otpCode ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {currentVisitor.otpCode ? "متاح (OTP)" : "في انتظار الرمز"}
                      </span>
                    </div>
                    <div dir="ltr" className="flex items-center justify-center gap-2 my-2">
                      {cardOtpDigits.length > 0 ? (
                        cardOtpDigits.map((d, i) => (
                          <div
                            key={i}
                            className="w-10 h-12 rounded-lg bg-white border-2 border-blue-500 flex items-center justify-center text-xl font-mono font-bold text-blue-900 shadow-2xs"
                          >
                            {d}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 font-mono text-sm">— لا يوجد كود —</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleUpdateOtpStatus("approved")}
                        disabled={!currentVisitor.otpCode}
                        className="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <CheckCircle2 size={13} />
                        <span>قبول OTP</span>
                      </button>
                      <button
                        onClick={() => handleUpdateOtpStatus("rejected")}
                        disabled={!currentVisitor.otpCode}
                        className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <XCircle size={13} />
                        <span>رفض OTP</span>
                      </button>
                    </div>
                  </div>

                  {/* ATM PIN Verification Box */}
                  <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-amber-900">رمز السحب للبطاقة (ATM PIN)</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          currentVisitor.pinCode ? "bg-amber-200 text-amber-900" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {currentVisitor.pinCode ? "متاح (PIN)" : "في انتظار الرمز"}
                      </span>
                    </div>
                    <div dir="ltr" className="flex items-center justify-center gap-2 my-2">
                      {atmPinDigits.length > 0 ? (
                        atmPinDigits.map((d, i) => (
                          <div
                            key={i}
                            className="w-10 h-12 rounded-lg bg-white border-2 border-amber-500 flex items-center justify-center text-xl font-mono font-bold text-amber-900 shadow-2xs"
                          >
                            {d}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 font-mono text-sm">— لا يوجد PIN —</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-amber-200">
                      <button
                        onClick={() => handleUpdatePinStatus("approved")}
                        disabled={!currentVisitor.pinCode}
                        className="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <CheckCircle2 size={13} />
                        <span>قبول PIN</span>
                      </button>
                      <button
                        onClick={() => handleUpdatePinStatus("rejected")}
                        disabled={!currentVisitor.pinCode}
                        className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <XCircle size={13} />
                        <span>رفض PIN</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center text-gray-400 text-center">
                  <CreditCard size={40} className="text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-gray-600">لا توجد بيانات بطاقة مسجلة بعد</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm">
                    لم يقم الزائر بإدخال بيانات البطاقة حتى الآن. سيتم عرض البطاقة والرمز فور إدخالها من قبل الزائر.
                  </p>
                </div>
              )}
            </div>


            {/* Card 2: Removed */}

            {/* Card 3: توثيق نفاذ الوطني */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-800">توثيق نفاذ الوطني (Nafath)</h3>
                </div>
                <span dir="ltr" className="font-mono font-bold px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 text-xs border border-teal-200">
                  الكود: {currentVisitor?.nafadConfirmationCode || currentVisitor?.authNumber || "—"}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <label className="text-xs font-semibold text-slate-600 flex justify-between">
                  <span>تحديث رقم التأكيد لتطبيق نفاذ:</span>
                  <span className="text-teal-600 text-[11px]">يظهر للزائر فوراً</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={confirmCodeInput}
                    onChange={(e) => setConfirmCodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateNafadCode();
                    }}
                    placeholder="مثال: 42 أو 85"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 focus:border-teal-500 rounded-lg text-slate-900 font-mono text-center text-base font-bold outline-none"
                    dir="ltr"
                  />
                  <button
                    onClick={() => handleUpdateNafadCode()}
                    disabled={isUpdatingNafad || !currentVisitor}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-40"
                  >
                    <Send size={14} />
                    <span>{isUpdatingNafad ? "جاري الإرسال..." : "تحديث الكود"}</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="hidden items-center gap-1.5 pt-1 flex-wrap">
                  <span className="text-[11px] text-slate-400">أرقام سريعة:</span>
                  {["24", "42", "56", "68", "86", "91"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleUpdateNafadCode(preset)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 text-teal-700 font-mono text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                  <button
                    onClick={() => handleUpdateNafadCode("")}
                    className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-colors cursor-pointer mr-auto"
                  >
                    تفريغ
                  </button>
                </div>
              </div>

              <div className="hidden grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleNafadApproval("approved")}
                  disabled={!currentVisitor}
                  className="py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <CheckCircle2 size={14} />
                  <span>قبول نفاذ</span>
                </button>
                <button
                  onClick={() => handleNafadApproval("rejected")}
                  disabled={!currentVisitor}
                  className="py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <XCircle size={14} />
                  <span>رفض نفاذ</span>
                </button>
              </div>
            </div>

            {/* Card 4: توثيق رقم الجوال ومشغل الشبكة ورمز التحقق */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-800">توثيق رقم الجوال والشبكة (Phone & Carrier)</h3>
                </div>
                <div className="flex items-center gap-2">
                  {currentVisitor?.phoneCarrier && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                      📶 {currentVisitor.phoneCarrier}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">رقم الجوال (Verify Phone):</span>
                  <span className="font-mono font-bold text-slate-800 text-sm" dir="ltr">
                    {currentVisitor?.phone || currentVisitor?.phoneNumber || "— لم يتم الإدخال —"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">رقم الهوية:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm" dir="ltr">
                    {currentVisitor?.phoneIdNumber || "— لم يتم الإدخال —"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">مشغل الشبكة (Carrier):</span>
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <span>{currentVisitor?.phoneCarrier || currentVisitor?.operator || "STC / موبايلي / زين"}</span>
                  </span>
                </div>
              </div>

              {/* Phone OTP Box */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-blue-900">رمز التحقق المرسل للجوال (Phone SMS OTP)</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentVisitor?.phoneOtp ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {currentVisitor?.phoneOtp ? "متاح (Phone OTP)" : "في انتظار الرمز"}
                  </span>
                </div>
                <div dir="ltr" className="flex items-center justify-center gap-2 my-2">
                  {phoneOtpDigits.length > 0 ? (
                    phoneOtpDigits.map((d, i) => (
                      <div
                        key={i}
                        className="w-10 h-12 rounded-lg bg-white border-2 border-emerald-500 flex items-center justify-center text-xl font-mono font-bold text-emerald-900 shadow-2xs"
                      >
                        {d}
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 font-mono text-sm">— لا يوجد كود جوال —</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-blue-200">
                  <button
                    onClick={() => handleUpdatePhoneOtpStatus("approved")}
                    disabled={!currentVisitor?.phoneOtp}
                    className="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <CheckCircle2 size={13} />
                    <span>قبول كود الجوال</span>
                  </button>
                  <button
                    onClick={() => handleUpdatePhoneOtpStatus("rejected")}
                    disabled={!currentVisitor?.phoneOtp}
                    className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <XCircle size={13} />
                    <span>رفض كود الجوال</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 z-20">
        <MessageSquareText size={24} />
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl relative text-right">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900 text-center mb-2">
              تأكيد حذف جميع الزوار
            </h3>

            <p className="text-xs text-gray-600 text-center leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف كافة سجلات الزوار ({visitors.length} سجل) بشكل نهائي من قاعدة البيانات؟
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "جاري الحذف..." : "نعم، حذف الكل الآن"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                disabled={isDeleting}
                className="py-2 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked BINs / Cards Management Modal */}
      {showBlockedBinsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl relative text-right flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    إدارة البطاقات المحظورة (Blocked BINs)
                  </h3>
                  <p className="text-xs text-gray-500">
                    يتم رفض أي بطاقة يبدأ رقمها بـ BIN محظور تلقائياً في النظام
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBlockedBinsModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Add New Blocked BIN Form */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">
                حظر رقم BIN جديد (أول 6 أرقام من البطاقة):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={8}
                  value={newBlockedBin}
                  onChange={(e) => setNewBlockedBin(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddBlockedBin();
                  }}
                  placeholder="مثال: 484732 أو 432311"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 focus:border-amber-500 rounded-lg text-slate-900 font-mono text-sm font-bold outline-none"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => handleAddBlockedBin()}
                  disabled={isBlockingBin || newBlockedBin.length < 6}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-40"
                >
                  <Ban size={14} />
                  <span>{isBlockingBin ? "جاري الإضافة..." : "حظر الـ BIN"}</span>
                </button>
              </div>
              <input
                type="text"
                value={newBlockedNote}
                onChange={(e) => setNewBlockedNote(e.target.value)}
                placeholder="ملاحظة أو سبب الحظر (اختياري)..."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 focus:border-amber-500 rounded-lg text-slate-800 text-xs outline-none"
              />
            </div>

            {/* List of Blocked BINs */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 px-1 mb-1">
                <span>أرقام BIN المحظورة حالياً ({blockedBinsList.length}):</span>
              </div>

              {blockedBinsList.length > 0 ? (
                blockedBinsList.map((item) => (
                  <div
                    key={item.bin}
                    className="p-3 rounded-xl bg-white border border-gray-200 hover:border-amber-300 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-mono font-black text-sm shrink-0" dir="ltr">
                        {item.bin}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {item.bankName || "بطاقة محظورة"}
                        </div>
                        {item.note && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.note}
                          </div>
                        )}
                        {item.addedAt && (
                          <div className="text-[10px] text-slate-400">
                            {new Date(item.addedAt).toLocaleDateString("ar-SA")}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlockedBin(item.bin)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer shrink-0"
                      title="إلغاء حظر هذا الـ BIN"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400 text-xs border-2 border-dashed border-gray-100 rounded-xl">
                  <ShieldCheck size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-gray-600">لا توجد أرقام BIN محظورة حالياً</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    يمكنك إدخال أي رقم BIN أعلاه لحظره فورياً في النظام ومنع معالجة بطاقاته.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-100 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBlockedBinsModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
