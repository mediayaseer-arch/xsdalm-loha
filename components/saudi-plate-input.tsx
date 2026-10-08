"use client";

import { useState, useRef, useEffect } from "react";

interface SaudiPlateInputProps {
  numbers: string;
  letters: string;
  onNumbersChange: (value: string) => void;
  onLettersChange: (value: string) => void;
}

// Complete Arabic characters list for vehicle license plates
const arabicLetters = [
  "أ", "ا", "ب", "ت", "ث", "ج", "ح", "خ",
  "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض",
  "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل",
  "م", "ن", "هـ", "ه", "و", "ي", "ى", "ة",
];

export function SaudiPlateInput({
  numbers,
  letters,
  onNumbersChange,
  onLettersChange,
}: SaudiPlateInputProps) {
  const [showLetterPicker, setShowLetterPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const arabicToWestern = (str: string) => {
    const arabicNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/[٠-٩]/g, (d) => arabicNums.indexOf(d).toString());
  };

  const handleLetterAdd = (letter: string) => {
    const cleanLetters = letters.replace(/\s+/g, "");
    if (cleanLetters.length < 4) {
      onLettersChange(cleanLetters + letter);
    }
  };

  const handleLetterRemoveLast = () => {
    const cleanLetters = letters.replace(/\s+/g, "");
    onLettersChange(cleanLetters.slice(0, -1));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowLetterPicker(false);
      }
    };
    if (showLetterPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLetterPicker]);

  const cleanLetters = letters.replace(/\s+/g, "");

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        لوحة المركبة
      </label>

      {/* Plate preview — single row */}
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white rounded-xl p-0.5 border-2 sm:border-4 border-gray-800 shadow-lg">
          <div className="flex items-stretch">
            {/* Numbers — left side, LTR */}
            <div className="flex-1 flex items-center justify-center py-2 sm:py-3 border-r-2 border-gray-800">
              <div className="flex gap-0.5 sm:gap-1 items-center" dir="ltr">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="text-xl sm:text-2xl font-bold font-mono text-gray-800 w-5 sm:w-6 text-center">
                    {numbers?.[i] ?? <span className="text-gray-300">-</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Center emblem */}
            <div className="flex flex-col items-center justify-center px-1.5 sm:px-3 py-1 sm:py-2 shrink-0">
              <svg className="w-5 h-4 sm:w-6 sm:h-5 mb-0.5" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" fill="#165E3C" rx="2" />
                <path
                  d="M12 8l-1.5 4h3L12 8z M8 14h8 M10 16l2-2 2 2"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-[6px] sm:text-[8px] font-bold text-gray-800 leading-none">السعودية</div>
              <div className="text-[5px] sm:text-[7px] font-bold text-gray-500 leading-none">KSA</div>
            </div>

            {/* Letters — right side, 4 slots */}
            <div className="flex-1 flex items-center justify-center py-2 sm:py-3 border-l-2 border-gray-800">
              <div className="flex gap-0.5 sm:gap-1 items-center">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="text-xl sm:text-2xl font-bold text-gray-800 w-5 sm:w-6 text-center">
                    {cleanLetters?.[i] ?? <span className="text-gray-300">-</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Letters picker & direct input */}
        <div className="relative" ref={pickerRef}>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">الحروف (حتى 4 حروف)</label>
              <button
                type="button"
                onClick={() => setShowLetterPicker(!showLetterPicker)}
                className="text-[11px] text-[#1a7a3a] hover:underline font-semibold"
              >
                {showLetterPicker ? "إغلاق اللوحة" : "لوحة الأحرف ▾"}
              </button>
            </div>
            <div className="flex w-full h-11 items-center rounded-lg border border-border bg-background hover:border-[#1a7a3a]/50 focus-within:border-[#1a7a3a] transition-colors">
              <input
                type="text"
                autoComplete="off"
                data-lpignore="true"
                value={letters}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\u0621-\u064A\u0671-\u06D3\s]/g, "");
                  if (val.replace(/\s+/g, "").length <= 4) {
                    onLettersChange(val);
                  }
                }}
                onFocus={() => setShowLetterPicker(true)}
                placeholder="اختر أو اكتب الحروف"
                className="h-full min-w-0 flex-1 px-3 text-foreground text-center text-lg font-bold tracking-widest bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowLetterPicker(!showLetterPicker)}
                aria-expanded={showLetterPicker}
                className="px-2 h-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
                title="فتح لوحة الحروف"
              >
                ▼
              </button>
              {letters && (
                <button
                  type="button"
                  aria-label="مسح الحروف"
                  onClick={() => onLettersChange("")}
                  className="mx-2 w-5 h-5 shrink-0 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {showLetterPicker && (
            <div className="absolute z-35 top-full mt-1.5 left-0 right-0 p-3 bg-white border border-[#1a7a3a]/20 rounded-xl shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-500">
                  اختر حروف اللوحة ({cleanLetters.length}/4)
                </span>
                {cleanLetters && (
                  <button
                    type="button"
                    onClick={handleLetterRemoveLast}
                    className="text-[10px] text-red-500 hover:text-red-700 font-bold px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    ← حذف آخر حرف
                  </button>
                )}
              </div>
              <div className="grid grid-cols-8 gap-1.5 max-h-[190px] overflow-y-auto p-1">
                {arabicLetters.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleLetterAdd(letter)}
                    disabled={cleanLetters.length >= 4}
                    className="h-9 rounded-lg border border-gray-200 hover:border-[#1a7a3a] hover:bg-[#1a7a3a]/10 font-bold text-base text-gray-800 disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center"
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-gray-100">
                <div className="flex-1 text-center text-xs font-bold tracking-widest text-gray-700 bg-gray-50 rounded-lg py-1">
                  {cleanLetters || "----"}
                </div>
                <button
                  type="button"
                  onClick={() => setShowLetterPicker(false)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#1a7a3a] rounded-lg hover:bg-[#0d5c2a] transition-colors shadow-sm"
                >
                  تم
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Numbers input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">الأرقام (حتى 4 أرقام)</label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            data-lpignore="true"
            value={numbers}
            onChange={(e) => {
              const normalized = arabicToWestern(e.target.value);
              const value = normalized.replace(/[^0-9]/g, "");
              if (value.length <= 4) {
                onNumbersChange(value);
              }
            }}
            placeholder="1234"
            className="w-full h-11 px-3 rounded-lg border border-border bg-background text-foreground text-center text-lg font-mono focus:outline-none focus:border-[#1a7a3a] transition-colors"
            maxLength={4}
          />
        </div>
      </div>
    </div>
  );
}
