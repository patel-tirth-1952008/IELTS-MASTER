"use client";

import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScoreCard from "@/components/ScoreCard";
import XPBar from "@/components/XPBar";
import { useUser } from "@/components/UserProvider";
import { Flame, BookOpen, PenLine, Headphones, Mic, ArrowUpRight, Lightbulb } from "lucide-react";

// Charts are the heaviest dependency on this page (Chart.js ≈ 70 kB), so they
// load lazily *after* the numbers are on screen. The fixed-height skeleton
// reserves the exact space, so nothing jumps when they arrive.
const chartSkeleton = () => <div className="skeleton h-64 rounded-2xl" />;
const BandChart = dynamic(() => import("@/components/BandChart"), {
  ssr: false,
  loading: chartSkeleton,
});
const ProgressChart = dynamic(() => import("@/components/ProgressChart"), {
  ssr: false,
  loading: chartSkeleton,
});

const QUICK = [
  { href: "/reading", icon: BookOpen, label: "Reading test" },
  { href: "/writing", icon: PenLine, label: "Writing test" },
  { href: "/listening", icon: Headphones, label: "Listening test" },
  { href: "/speaking", icon: Mic, label: "Speaking test" },
];

const SKILLS = [
  { key: "readingAvg", label: "Reading", href: "/reading" },
  { key: "writingAvg", label: "Writing", href: "/writing" },
  { key: "listeningAvg", label: "Listening", href: "/listening" },
  { key: "speakingAvg", label: "Speaking", href: "/speaking" },
];

export default function DashboardPage() {
  // Session comes from the shared context: one fetch per browser session,
  // shared with the navbar — this page no longer re-requests it.
  const { ready, authenticated, user, stats, recent } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) router.replace("/login");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-[#FCF9F2]">
        <Navbar />
        <main className="page-wrap space-y-4 py-10">
          <div className="skeleton h-10 w-64 rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-36 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </main>
      </div>
    );
  }

  const s = stats ?? {};
  const target = user?.targetBand ?? 7.5;

  // Weakest scored skill → one concrete next step (actionable, not chatty).
  const scored = SKILLS.filter((sk) => (s[sk.key] ?? 0) > 0);
  const weakest = scored.length
    ? scored.reduce((min, sk) => ((s[sk.key] ?? 0) < (s[min.key] ?? 0) ? sk : min), scored[0])
    : null;

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap py-10">
        <Breadcrumbs trail={[{ label: "Dashboard" }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="type-h1">Hello, {user?.name?.split(" ")[0] || "Student"} 👋</h1>
            <p className="type-lead mt-1">
              Target band <span className="type-score">{target}</span> ·{" "}
              <span className="type-score">{s.totalTests ?? 0}</span> tests taken
            </p>
          </div>
          <span className="badge-yellow !py-1.5 !text-sm">
            <Flame size={16} strokeWidth={1.75} /> {s.studyStreak ?? 0}-day streak
          </span>
        </div>

        <div className="mt-6">
          <XPBar value={s.averageBand ?? 0} target={target} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Reading" band={s.readingAvg ?? 0} />
          <ScoreCard label="Writing" band={s.writingAvg ?? 0} />
          <ScoreCard label="Listening" band={s.listeningAvg ?? 0} />
          <ScoreCard label="Speaking" band={s.speakingAvg ?? 0} />
        </div>

        {weakest && (
          <div className="warm-card mt-6 flex flex-wrap items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF3C7]">
              <Lightbulb size={18} strokeWidth={1.75} className="text-[#B45309]" />
            </span>
            <p className="type-body">
              <strong className="font-bold text-slate-900">Next best step:</strong> your{" "}
              {weakest.label.toLowerCase()} average is{" "}
              <span className="type-score">{s[weakest.key]}</span> — a focused session there
              moves your overall band fastest.
            </p>
            <Link href={weakest.href} className="btn-primary ml-auto !px-4 !py-2 text-sm">
              Practise {weakest.label.toLowerCase()}
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="warm-card p-6">
            <h2 className="type-h3">Skill radar</h2>
            <div className="mt-2">
              <BandChart stats={s} />
            </div>
          </div>
          <div className="warm-card p-6">
            <h2 className="type-h3">Progress over time</h2>
            <div className="mt-2">
              <ProgressChart recent={recent} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="warm-card p-6">
            <h2 className="type-h3">Quick actions</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {QUICK.map(({ href, icon: Icon, label }) => (
                <div key={href} className="relative">
                  <div className="flex items-center gap-2 rounded-xl border border-[#EBE3D5] bg-[#FCF9F2] px-4 py-3 text-sm font-bold text-slate-800">
                    <Icon size={16} strokeWidth={1.75} className="text-[#B45309]" />
                    {label}
                    <ArrowUpRight size={14} strokeWidth={1.75} className="ml-auto text-slate-400" />
                  </div>
                  <Link href={href} className="absolute inset-0 z-10 rounded-2xl" aria-label={label} />
                </div>
              ))}
            </div>
          </div>
          <div className="warm-card p-6">
            <h2 className="type-h3">Recent activity</h2>
            {recent.length === 0 ? (
              <p className="type-body mt-3">
                No tests yet.{" "}
                <Link href="/practice/reading" className="font-semibold text-[#B45309] underline">
                  Take your first reading test
                </Link>{" "}
                to light up this dashboard.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-[#EBE3D5]">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-semibold capitalize text-slate-700">
                      {r.examType} {r.examId ? <span className="text-slate-400">· {r.examId}</span> : ""}
                    </span>
                    <span className="badge-blue">Band {r.bandScore ?? "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
