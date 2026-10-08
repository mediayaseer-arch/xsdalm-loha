"use client";

import { Loader2 } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-white/90 backdrop-blur-md
      "
      role="status"
      aria-live="polite"
      aria-label="جاري المعالجة"
    >
      <div className="flex flex-col items-center">
        {/* Loader */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Soft glow */}
          <div className="absolute inset-2 rounded-full bg-emerald-500/10 blur-xl" />

          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-stone-200" />

          {/* Spinner */}
          <Loader2
            className="
              relative h-10 w-10
              animate-spin
              text-emerald-600
            "
            strokeWidth={1.8}
          />
        </div>

        {/* Text */}
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold text-stone-800">جاري المعالجة</p>

          <p className="mt-1.5 text-xs text-stone-500">
            يرجى الانتظار لحظات...
          </p>
        </div>

        {/* Animated dots */}
        <div className="mt-4 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
        </div>
      </div>
    </div>
  );
}
