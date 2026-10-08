import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./dashboard";
import AdminLogin from "./admin-login";

import { VisitorPresence } from "@/components/visitor-presence";
import {
  getOrCreateVisitorId,
  isValidVisitorId,
  setMemoryVisitorId,
} from "@/lib/visitor-presence";

export default function App() {
  const [visitorId, setVisitorId] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    async function initSession() {
      // 1. Check URL parameters
      try {
        const params = new URLSearchParams(window.location.search);
        const fromUrl =
          params.get("visitorId") ||
          params.get("visitor_id") ||
          params.get("id");
        if (isValidVisitorId(fromUrl)) {
          const clean = fromUrl.trim();
          setMemoryVisitorId(clean);
          setVisitorId(clean);
          return;
        }
      } catch {}

      // 2. Ask server if this IP has an existing active session so returning visitors keep the same data
      try {
        const res = await fetch("/api/visitor-session", { cache: "no-store" });
        if (res.ok) {
          const session = await res.json();
          if (session.visitorId && isValidVisitorId(session.visitorId)) {
            setMemoryVisitorId(session.visitorId);
            setVisitorId(session.visitorId);
            return;
          }
        }
      } catch {}

      // 3. Fallback: create fresh visitor ID
      const newId = getOrCreateVisitorId();
      if (newId) setVisitorId(newId);
    }

    initSession();
  }, []);

  if (!visitorId) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700"
      >
        جاري تهيئة جلسة الزائر...
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />;
  }

  return (
    <>
      <VisitorPresence visitorId={visitorId} />
      <Routes>
        <Route path="/" element={<DashboardPage onLogout={() => setIsAdminAuthenticated(false)} />} />
        <Route path="/admin" element={<DashboardPage onLogout={() => setIsAdminAuthenticated(false)} />} />
        <Route path="*" element={<DashboardPage onLogout={() => setIsAdminAuthenticated(false)} />} />
      </Routes>
    </>
  );
}
