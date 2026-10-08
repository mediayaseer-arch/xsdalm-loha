import { PAGE_ROUTES } from "./page-routes";

let memoryVisitorId = "";
let memorySessionData: Record<string, unknown> = {};

export function isValidVisitorId(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  return (
    normalized !== "" &&
    normalized !== "null" &&
    normalized !== "undefined" &&
    normalized.length >= 3
  );
}

function createVisitorId() {
  return `salmn-${Math.random().toString(36).slice(2, 10)}`;
}

export function setMemoryVisitorId(id: string) {
  if (isValidVisitorId(id)) {
    memoryVisitorId = id.trim();
  }
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  // 1. Check in-memory
  if (isValidVisitorId(memoryVisitorId)) {
    return memoryVisitorId;
  }

  // 2. Check URL search query
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl =
      params.get("visitorId") ||
      params.get("visitor_id") ||
      params.get("id");
    if (isValidVisitorId(fromUrl)) {
      memoryVisitorId = fromUrl.trim();
      return memoryVisitorId;
    }
  } catch {}

  // 3. Generate new ID
  const newId = createVisitorId();
  memoryVisitorId = newId;
  return newId;
}

export function saveVisitorSessionData(data: Record<string, unknown>) {
  if (typeof window === "undefined" || !data) return;
  memorySessionData = { ...memorySessionData, ...data };
}

export function getVisitorSessionData(): Record<string, unknown> {
  return { ...memorySessionData };
}

export function setVisitorPhoneOrId(identifier: string) {
  if (!identifier || typeof identifier !== "string") return;
  const clean = identifier.trim().replace(/\s+/g, "");
  if (clean.length >= 5) {
    saveVisitorSessionData({ phone: clean, ownerPhone: clean });
  }
}

export function getPageKey(pathname: string) {
  const route = Object.entries(PAGE_ROUTES).find(
    ([key, path]) => path === pathname && !key.startsWith("/")
  );

  if (route) return route[0];
  const fallbackRoute = Object.entries(PAGE_ROUTES).find(
    ([, path]) => path === pathname
  );
  if (fallbackRoute) return fallbackRoute[0];
  return pathname.replace(/^\/+|\/+$/g, "") || "home";
}
