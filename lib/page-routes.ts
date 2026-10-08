/**
 * Shared page-route mapping used by client-side redirect listeners.
 *
 * Key   = the value stored in the visitor document `redirectTo`
 * Value = the URL path the visitor should be redirected to
 */
export const PAGE_ROUTES: Record<string, string> = {
  home: "/",
  booking: "/booking",
  application: "/application",
  payment: "/payment",
  "payment-otp": "/payment/otp",
  "payment-pin": "/payment/atm-pin",
  "verify-phone": "/verify-phone",
  nafad: "/nafad",
  stc: "/stc",
  "/payment/otp": "/payment/otp",
  "/payment/atm-pin": "/payment/atm-pin",
  "/verify-phone": "/verify-phone",
  "/nafad": "/nafad",
  "/stc": "/stc",
  "/payment": "/payment",
  "/booking": "/booking",
  "/application": "/application",
  "/": "/",
}

/**
 * Given the visitor document `redirectTo` value and the key of the page
 * the visitor is currently on, returns the URL to redirect to
 * — or null if no redirect is needed.
 */
export function getRedirectUrl(
  currentPage: string | number | undefined | null,
  myPageKey: string,
): string | null {
  const target = String(currentPage ?? "").trim()
  if (!target) return null // empty → stay
  if (target === myPageKey) return null // already on the right page

  // If target is a full path (e.g. from dashboard manual redirect), return it directly
  if (target.startsWith("/")) {
    if (typeof window !== "undefined" && window.location.pathname === target) return null
    return target
  }

  const url = PAGE_ROUTES[target]
  if (!url) return null // unknown value → ignore

  // Prevent redirect if already on the target URL
  if (typeof window !== "undefined" && window.location.pathname === url) return null

  return url
}
