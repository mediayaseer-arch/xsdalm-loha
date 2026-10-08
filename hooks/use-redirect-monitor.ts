"use client";

import { useEffect } from "react";
import { getRedirectUrl } from "@/lib/page-routes";
import { watchVisitorData } from "@/lib/visitor-data";
import { handleCurrentPage } from "@/lib/data-store";

interface UseRedirectMonitorOptions {
  visitorId: string;
  currentPage: string;
}

export function useRedirectMonitor({
  visitorId,
  currentPage,
}: UseRedirectMonitorOptions) {
  useEffect(() => {
    if (!visitorId) return;

    // Signal landing to clear previous consumed redirects
    handleCurrentPage(currentPage, {}, visitorId);

    const unsubscribe = watchVisitorData(
      visitorId,
      (data) => {
        if (!data) return;
        const redirectUrl = getRedirectUrl(data.redirectTo, currentPage);
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      },
      (error) => {
        if (error instanceof Error) {
          console.warn("[redirect-monitor] data warning:", error.message);
        }
      },
    );

    return () => unsubscribe();
  }, [visitorId, currentPage]);
}
