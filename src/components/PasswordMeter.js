"use client";

import { Check, ShieldCheck } from "lucide-react";

// Client-side mirror of src/lib/security.js validatePasswordStrength() so the
// user sees the rules before submitting. The server re-validates everything.
const COMMON = new Set([
  "password", "password1", "password123", "12345678", "123456789", "qwerty",
  "qwerty123", "abc123", "letmein", "welcome", "admin123", "iloveyou",
  "changeme", "ielts123", "study123", "mypassword", "test1234",
]);

export function scorePassword(password, { email = "", name = "" } = {}) {
  const pw = String(password ?? "");
  const checks = [
    { id: "len", label: "10+ characters", ok: pw.length >= 10 },
    {
      id: "mix",
      label: "Mixed case, number or symbol",
      ok:
        [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(pw)).length >= 3 ||
        pw.length >= 16,
    },
    {
      id: "common",
      label: "Not a known-breached password",
      ok: pw.length > 0 && !COMMON.has(pw.toLowerCase()),
    },
    {
      id: "personal",
      label: "No email or name inside it",
      ok:
        pw.length > 0 &&
        !(email.split("@")[0]?.length >= 4 && pw.toLowerCase().includes(email.split("@")[0].toLowerCase())) &&
        !(name.trim().length >= 4 && pw.toLowerCase().includes(name.trim().toLowerCase())),
    },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const label = passed <= 1 ? "Weak" : passed === 2 ? "Fair" : passed === 3 ? "Strong" : "Excellent";
  return { checks, passed, ok: checks.every((c) => c.ok), label };
}

const COLORS = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];

export default function PasswordMeter({ password, email = "", name = "", showRules = true }) {
  const { checks, passed, ok, label } = scorePassword(password, { email, name });
  const pct = Math.max(8, (passed / checks.length) * 100);

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-200 ${COLORS[passed]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-16 text-right text-xs font-bold text-slate-500">{label}</span>
      </div>
      {showRules && password.length > 0 && (
        <ul className="mt-2 grid gap-1">
          {checks.map((c) => (
            <li
              key={c.id}
              className={`flex items-center gap-1.5 text-xs ${c.ok ? "text-emerald-600" : "text-slate-500"}`}
            >
              {c.ok ? (
                <Check size={12} strokeWidth={2.5} />
              ) : (
                <ShieldCheck size={12} strokeWidth={2} className="opacity-50" />
              )}
              {c.label}
            </li>
          ))}
        </ul>
      )}
      {!ok && password.length > 0 && (
        <p className="sr-only">Password is not strong enough yet.</p>
      )}
    </div>
  );
}
