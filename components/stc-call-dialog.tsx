import React from "react";

interface StcCallDialogProps {
  open: boolean;
  onComplete: () => void;
}

export const StcCallDialog: React.FC<StcCallDialogProps> = ({
  open,
  onComplete,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="min-h-screen flex flex-col items-center px-4 py-6 relative font-sans">
        {/* Muvi Logo Image */}
        <div className="mt-8 text-center">
          <img
            src="/next.svg"
            alt="next next"
            className="w-44 h-auto object-contain"
          />
        </div>

        {/* MyStc Title Image */}
        <div className="mt-12 mb-8">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='60'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-family='Arial,sans-serif' font-size='48' font-weight='800' fill='%234a148c'%3EMyStc%3C/text%3E%3C/svg%3E"
            alt="MyStc"
            className="w-52 h-auto"
          />
        </div>

        {/* Illustration */}
        <div className="relative w-64 h-56 mb-6">
          {/* Speech Bubble */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white border-2 border-purple-500 rounded-xl px-5 py-2 z-10">
            <span className="text-pink-600 text-xl font-bold tracking-widest">
              ******
            </span>
            <div className="absolute -bottom-2.5 left-5 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-purple-500" />
            <div className="absolute -bottom-[7px] left-[22px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
          </div>

          {/* Phone Body */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-52 h-28 border-[3px] border-purple-500 rounded-2xl bg-white flex items-center justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              className="-rotate-[30deg]"
            >
              <defs>
                <linearGradient
                  id="phoneGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#7c4dff" />
                  <stop offset="100%" stopColor="#4a148c" />
                </linearGradient>
              </defs>
              <path
                d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57a.98.98 0 00.24-1.01c-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                fill="url(#phoneGrad)"
              />
              <path
                d="M16 3c-2.5 0-4.76 1.03-6.37 2.68l1.41 1.41C12.3 5.8 14.03 5 16 5c3.87 0 7 3.13 7 7h2c0-4.97-4.03-9-9-9z"
                fill="#e91e63"
                opacity="0.6"
              />
              <path
                d="M16 7c-1.65 0-3.15.67-4.24 1.76l1.41 1.41C13.85 9.58 14.88 9 16 9c1.66 0 3 1.34 3 3h2c0-2.76-2.24-5-5-5z"
                fill="#e91e63"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Phone Base */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-14 bg-gradient-to-b from-pink-600 to-purple-900 rounded-lg -z-10" />

          {/* Sparkles */}
          <div className="absolute bottom-10 right-5 text-pink-600 text-xl">
            ✦
          </div>
          <div className="absolute bottom-14 right-2 text-purple-500 text-sm">
            ✦
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8 max-w-xs">
          <p className="text-2xl font-bold text-gray-900 mb-4 leading-relaxed">
            سوف نتلقى مكالمة قريباً.
          </p>
          <p className="text-base text-gray-600 leading-7">
            يرجى الموافقة عليها وإدخال الرقم{" "}
            <span className="text-pink-600 font-bold">5</span> في
            <br />
            المكالمة و المتابعة
          </p>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onComplete}
          className="w-full max-w-sm py-3.5 px-6 rounded-xl bg-text-white bg-gradient-to-b from-pink-600 to-purple-900 text-lg font-semibold shadow-md active:scale-[0.98] transition-transform mb-6"
        >
          تم تلقي المكالمة
        </button>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-black/20 cursor-pointer">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
        </div>
      </div>
    </div>
  );
};

export default StcCallDialog;
