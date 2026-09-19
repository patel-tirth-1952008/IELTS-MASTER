import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";
import { ShieldCheck, Eye, Database, Mail } from "lucide-react";

export const metadata = pageMetadata({
  title: "Privacy & Cookie Policy",
  description:
    "What IELTS Master stores, why we store it, and how to opt out of analytics. Plain-English privacy and cookie policy.",
  path: "/privacy",
});

const SECTIONS = [
  {
    icon: Database,
    title: "What we store",
    points: [
      "Your name, email and a bcrypt hash of your password — never the password itself.",
      "Your practice results (band scores, answers, time taken) so your dashboard and progress charts work.",
      "One essential cookie (ielts_token) that keeps you signed in. It is HTTP-only, so scripts cannot read it.",
    ],
  },
  {
    icon: Eye,
    title: "Analytics (optional)",
    points: [
      "We count page views and Core Web Vitals with our own first-party code — no Google Analytics tracker, no cross-site profiling, no advertising identifiers.",
      "Analytics only starts after you press “Accept all” on the cookie banner and stops immediately if you choose “Essential only”.",
      "Events are stored against a random session id, not your identity.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Security",
    points: [
      "Passwords hashed with bcrypt (12 rounds) and screened against known-breached password lists.",
      "Email verification is required before an account can sign in; two-factor codes are available on every account.",
      "Rate limiting and lockouts protect the sign-in, password-reset and AI-marking endpoints.",
      "All traffic is served over HTTPS with a strict Content-Security-Policy.",
    ],
  },
  {
    icon: Mail,
    title: "Your choices",
    points: [
      "Ask us to export or delete your account data any time by emailing hello@ieltsmaster.app.",
      "Change your cookie choice by clearing the “ielts_consent” cookie for this site — the banner will ask again.",
      "AI marking sends your essay or transcript to Groq for evaluation; nothing is used to train third-party models.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap max-w-3xl py-10">
        <Breadcrumbs trail={[{ label: "Privacy" }]} />
        <h1 className="type-h1">Privacy &amp; cookies</h1>
        <p className="type-lead mt-2">
          Short version: we store what is needed to run your practice account, we use
          no advertising trackers, and analytics stays switched off until you say yes.
        </p>

        <div className="mt-8 space-y-4">
          {SECTIONS.map((s) => (
            <section key={s.title} className="warm-card p-6">
              <h2 className="type-h3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF3C7]">
                  <s.icon size={16} strokeWidth={1.75} className="text-[#B45309]" />
                </span>
                {s.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Questions about your data?{" "}
          <Link href="/contact" className="font-semibold text-[#B45309] underline">
            Contact us
          </Link>{" "}
          — we answer every message.
        </p>
      </main>
    </div>
  );
}
