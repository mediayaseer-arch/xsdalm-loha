"use client"

import { useEffect } from "react"
import { getRedirectUrl } from "./page-routes"
import { watchVisitorData } from "./visitor-data"
import { getOrCreateVisitorId } from "./visitor-presence"
import { handleCurrentPage } from "./data-store"

/**
 * Hook that listens to the visitor's server-backed document and redirects
 * when `redirectTo` is set to a page other than `myPageKey`.
 *
 * Use this on pages that do NOT already have their own onSnapshot listener.
 * Pages that already have a listener should call `getRedirectUrl()` directly
 * inside their existing listener callback instead.
 */
export function usePageRedirect(myPageKey: string) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const visitorId = getOrCreateVisitorId()
    if (!visitorId) return

    // Signal landing to clear previous consumed redirects
    handleCurrentPage(myPageKey, {}, visitorId);

    const unsubscribe = watchVisitorData(
      visitorId,
      (data) => {
        if (!data) return
        const url = getRedirectUrl(data.redirectTo, myPageKey)
        if (url) {
          window.location.href = url
        }
      },
      (err) => {
        if (err instanceof Error) {
          console.warn("usePageRedirect warning:", err.message)
        }
      },
    )

    return () => unsubscribe()
  }, [myPageKey])
}
