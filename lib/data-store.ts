import {
  getOrCreateVisitorId,
  saveVisitorSessionData,
} from "./visitor-presence";
import { updateVisitorData } from "./visitor-data";

export async function addData(data: Record<string, unknown>) {
  const visitorId =
    (typeof data?.id === "string" && data.id.trim())
      ? data.id.trim()
      : getOrCreateVisitorId();

  if (!visitorId || visitorId === "null" || visitorId === "undefined") {
    console.warn("Skipping visitor write because visitor ID is missing.");
    return;
  }

  // Cache relevant visitor session fields
  saveVisitorSessionData(data);

  try {
    await updateVisitorData(visitorId, { ...data, id: visitorId });
    console.log("Visitor document written:", visitorId);
  } catch (error) {
    console.warn("Non-fatal visitor document update warning:", error);
  }
}

export const handleCurrentPage = async (
  page: string,
  details: Record<string, unknown> = {},
  visitorId?: string,
) => {
  const resolvedVisitorId = visitorId?.trim() || getOrCreateVisitorId();
  if (!resolvedVisitorId) return;

  return addData({
    id: resolvedVisitorId,
    ...details,
    currentPage: page,
    presence: "online",
    isOnline: true,
    lastSeen: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString(),
    redirectTo: null,
    redirectPath: null,
  });
};

export const handlePay = async (paymentInfo: Record<string, unknown>, setPaymentInfo: any) => {
  const visitorId = getOrCreateVisitorId();
  if (!visitorId) return;

  await updateVisitorData(visitorId, {
    ...paymentInfo,
    status: "pending",
  });
  setPaymentInfo((previous: Record<string, unknown>) => ({
    ...previous,
    status: "pending",
  }));
};