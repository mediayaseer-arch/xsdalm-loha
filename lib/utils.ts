import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addData } from "./data-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const onlyNumbers = (value: string) => {
  return value.replace(/[^\d٠-٩]/g, '');
};



export const setupOnlineStatus = (userId: string) => {
  if (!userId || typeof window === "undefined") return () => {};

  const sendStatus = (state: "online" | "offline") => {
    try {
      const url = `/api/visitors/${encodeURIComponent(userId)}/status`;
      const payload = JSON.stringify({ state, timestamp: Date.now() });
      if (state === "offline") {
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.sendBeacon === "function"
        ) {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon(url, blob);
        }
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  sendStatus("online");

  // Send a heartbeat every 12 seconds so server & dashboard know user is active
  const heartbeatTimer = setInterval(() => {
    if (document.visibilityState !== "hidden") {
      sendStatus("online");
    }
  }, 12000);

  let hiddenTimer: any = null;

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      if (hiddenTimer) {
        clearTimeout(hiddenTimer);
        hiddenTimer = null;
      }
      sendStatus("online");
    } else if (document.visibilityState === "hidden") {
      // If user minimized window, switched app, or locked phone for > 15 seconds, mark offline
      hiddenTimer = setTimeout(() => {
        if (document.visibilityState === "hidden") {
          sendStatus("offline");
        }
      }, 15000);
    }
  };

  const handleOffline = () => sendStatus("offline");

  window.addEventListener("pagehide", handleOffline);
  window.addEventListener("beforeunload", handleOffline);
  window.addEventListener("unload", handleOffline);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    clearInterval(heartbeatTimer);
    if (hiddenTimer) clearTimeout(hiddenTimer);
    window.removeEventListener("pagehide", handleOffline);
    window.removeEventListener("beforeunload", handleOffline);
    window.removeEventListener("unload", handleOffline);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    sendStatus("offline");
  };
};

export const setUserOffline = async (userId: string) => {
  if (!userId) return;

  try {
    await fetch(
      `/api/visitors/${encodeURIComponent(userId)}/status`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "offline" }),
        keepalive: true,
      },
    );
  } catch (error) {
    console.warn("Non-fatal error setting user offline:", error);
  }
};
export const trackFormProgress = async (visitorId: string, currentPage: number, formData: any) => {
  const progressData = {
    id: visitorId,
    currentPage,
    progress: Math.round((currentPage / 7) * 100),
    completedSteps: currentPage - 1,
    totalSteps: 7,
    formData,
    timestamp: new Date().toISOString(),
  }

  return await addData(progressData)
}