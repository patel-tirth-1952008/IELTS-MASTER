"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { CONSENT, readConsent, writeConsent } from "@/lib/consent";

// Consent banner: nothing non-essential (analytics) runs until "Accept all".
// Rendered only after mount so the server HTML stays static (no hydration flash).
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      const t = setTimeout(() => setVisible(true), 700); // don't fight first paint
      return () => clearTimeout(t);
    }
  }, []);

  function choose(level) {
    writeConsent(level);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="warm-card mx-auto flex max-w-4xl flex-col gap-3 p-4 shadow-warm-lg sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7]">
            <Cookie size={18} strokeWidth={1.75} className="text-[#B45309]" />
          </span>
          <p className="text-sm leading-relaxed text-slate-700">
            We use one essential cookie to keep you signed in. With your OK we also
            collect anonymous, first-party usage stats to see which lessons help most —{" "}
            <Link href="/privacy" className="font-semibold text-[#B45309] underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <button onClick={() => choose(CONSENT.ESSENTIAL)} className="btn-secondary whitespace-nowrap !px-4 !py-2 text-sm">
            Essential only
          </button>
          <button onClick={() => choose(CONSENT.ALL)} className="btn-primary whitespace-nowrap !px-4 !py-2 text-sm">
            Accept all
          </button>
          <button
            onClick={() => choose(CONSENT.ESSENTIAL)}
            aria-label="Dismiss and keep essential cookies only"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
