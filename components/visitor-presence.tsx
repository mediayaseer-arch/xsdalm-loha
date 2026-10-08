import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleCurrentPage } from "@/lib/data-store";
import { setupOnlineStatus } from "@/lib/utils";
import { getPageKey } from "@/lib/visitor-presence";
import { getRedirectUrl } from "@/lib/page-routes";

interface VisitorPresenceProps {
  visitorId: string;
}

export function VisitorPresence({ visitorId }: VisitorPresenceProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lastRedirectRef = useRef<string>("");

  // 1. Maintain active online presence & heartbeat for the visitor tab session
  useEffect(() => {
    if (!visitorId) return;
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return;

    const cleanupOnline = setupOnlineStatus(visitorId);

    // Fetch actual country & IP
    async function fetchGeoLocation() {
      try {
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && (data.country_name || data.ip)) {
            const countryName = data.country_name === "Saudi Arabia" ? "المملكة العربية السعودية" : (data.country_name || "المملكة العربية السعودية");
            const countryFlag = data.country_code === "SA" ? "🇸🇦" : (data.country_code ? `🌍 (${data.country_code})` : "🇸🇦");
            await handleCurrentPage(
              getPageKey(pathname),
              {
                ip: data.ip || "",
                country: countryName,
                countryFlag: countryFlag,
                city: data.city || "",
              },
              visitorId
            );
          }
        }
      } catch (err) {
        try {
          const res2 = await fetch("https://ip-api.com/json/", { cache: "no-store" });
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2 && data2.status === "success") {
              const countryName = data2.country === "Saudi Arabia" ? "المملكة العربية السعودية" : (data2.country || "المملكة العربية السعودية");
              await handleCurrentPage(
                getPageKey(pathname),
                {
                  ip: data2.query || "",
                  country: countryName,
                  countryFlag: data2.countryCode === "SA" ? "🇸🇦" : "🌍",
                  city: data2.city || "",
                },
                visitorId
              );
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }

    fetchGeoLocation();

    return () => {
      cleanupOnline();
    };
  }, [visitorId]);

  // 2. Track current page & listen for admin redirects
  useEffect(() => {
    if (!visitorId) return;
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return;

    const currentPage = getPageKey(pathname);
    void handleCurrentPage(currentPage, {}, visitorId);

    // Poll for admin redirect command
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/visitors/${visitorId}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        const rawTarget = json?.data?.redirectTo || json?.data?.redirectPath;
        if (!rawTarget) return;

        const targetUrl = getRedirectUrl(rawTarget, currentPage);
        if (
          targetUrl &&
          targetUrl !== pathname &&
          targetUrl !== lastRedirectRef.current
        ) {
          lastRedirectRef.current = targetUrl;
          // Clear consumed redirect so it does not loop
          void handleCurrentPage(
            getPageKey(targetUrl),
            { redirectTo: null, redirectPath: null },
            visitorId,
          );
          navigate(targetUrl);
        }
      } catch (err) {
        // ignore
      }
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [visitorId, pathname, navigate]);

  return null;
}
