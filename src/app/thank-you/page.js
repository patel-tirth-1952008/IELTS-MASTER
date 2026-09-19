import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";
import { CheckCircle2, ArrowRight, BookOpen, Trophy, BarChart3 } from "lucide-react";

export const metadata = pageMetadata({
  title: "Thank you — you're all set",
  description: "Your message or practice attempt has been received. Here's what to do next.",
  path: "/thank-you",
  noindex: true, // confirmation pages shouldn't compete for search traffic
});

const NEXT_STEPS = [
  {
    href: "/dashboard",
    icon: BarChart3,
    title: "See your progress",
    body: "Band-by-band breakdown, streak and recent attempts in one place.",
  },
  {
    href: "/mock-test",
    icon: BookOpen,
    title: "Try a full mock test",
    body: "All four skills back-to-back, timed like the real thing.",
  },
  {
    href: "/leaderboard",
    icon: Trophy,
    title: "Compare with peers",
    body: "See how your average band stacks up this week.",
  },
];

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap max-w-3xl py-14">
        <Breadcrumbs trail={[{ label: "Thank you" }]} />
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 size={32} strokeWidth={1.75} className="text-emerald-500" />
          </div>
          <h1 className="type-h1 mt-5">Thank you — got it</h1>
          <p className="type-lead mx-auto mt-3 max-w-xl">
            Your submission went through. We reply to messages within a couple of days,
            and your practice scores appear on your dashboard instantly.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="btn-primary">
              Go to my dashboard <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
            <Link href="/practice/reading" className="btn-secondary">
              Start a practice test
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {NEXT_STEPS.map((s) => (
            <div key={s.href} className="warm-card-hover relative p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF3C7]">
                <s.icon size={18} strokeWidth={1.75} className="text-[#B45309]" />
              </span>
              <h2 className="type-h3 mt-3">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</p>
              <Link
                href={s.href}
                className="absolute inset-0 z-10 rounded-2xl"
                aria-label={s.title}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
