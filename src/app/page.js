import Link from "next/link";
import Navbar from "@/components/Navbar";
import { pageMetadata, structuredData } from "@/lib/site";
import {
  BookOpen, PenLine, Headphones, Mic, Sparkles, Trophy, Layers,
  ArrowRight, CheckCircle2, Target, Timer, LineChart,
} from "lucide-react";

export const metadata = pageMetadata({
  title: "IELTS Master — Free AI-Powered IELTS Preparation",
  description:
    "Prepare for IELTS free: full reading, writing, listening and speaking practice with instant AI band scores, model answers, vocabulary flashcards and a personalised study plan.",
  path: "/",
  keywords: [
    "IELTS practice test",
    "free IELTS preparation",
    "AI IELTS band score",
    "IELTS mock test online",
    "IELTS writing feedback",
  ],
});

// Prerendered at build time; refresh hourly. Visitors get static HTML from
// the edge instead of a fresh server render on every request.
export const revalidate = 3600;

const MODULES = [
  { href: "/reading", icon: BookOpen, title: "Reading", desc: "Timed passages with instant band conversion.", badge: "40 Qs" },
  { href: "/writing", icon: PenLine, title: "Writing", desc: "Task 1 & 2 with AI examiner feedback.", badge: "AI marked" },
  { href: "/listening", icon: Headphones, title: "Listening", desc: "Sections with auto-scored answers.", badge: "Demo audio" },
  { href: "/speaking", icon: Mic, title: "Speaking", desc: "Record answers, get fluency feedback.", badge: "Mic + AI" },
];

const PERKS = [
  "100% free — no card, no trial expiry",
  "AI band scores on writing & speaking",
  "Progress radar chart & streaks",
  "Vocab flashcards & grammar drills",
];

const STEPS = [
  {
    icon: Target,
    title: "Pick your skill",
    body: "Reading, writing, listening or speaking — every module is unlocked from the first second.",
  },
  {
    icon: Timer,
    title: "Practise under exam timing",
    body: "Our timer mirrors real IELTS conditions and auto-submits when the clock runs out.",
  },
  {
    icon: LineChart,
    title: "Get band feedback instantly",
    body: "AI examiner marks against the four official criteria, then your dashboard radar updates.",
  },
];

const FAQS = [
  {
    q: "Is IELTS Master really free?",
    a: "Yes. Every practice test, AI marking request and study tool on IELTS Master is free, with no credit card and no trial that expires. AI marking is powered by Groq's Llama 3.3 inference.",
  },
  {
    q: "How accurate is the AI band score?",
    a: "Our examiner prompt scores against the four official IELTS criteria and we convert raw reading and listening marks using the standard 40-question band table. Treat results as a strong practice signal, then confirm with a qualified teacher before exam day.",
  },
  {
    q: "Do I need to create an account?",
    a: "You can sit any practice test as a guest and see your score immediately. A free account saves your attempts, builds your progress charts, keeps your study streak and unlocks vocabulary and grammar tracking.",
  },
  {
    q: "Which IELTS modules are covered?",
    a: "All four: Academic reading with True/False/Not Given and matching questions, Writing Task 1 and Task 2 with AI examiner feedback, listening sections with auto-scoring, and speaking cue cards with fluency, lexical and grammar feedback.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes — the whole product is responsive, and speaking practice can use your phone's microphone, or you can type your answer instead if recording is not convenient.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      {/* FAQ + Course rich-result markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData({ faqs: FAQS })) }}
      />
      <Navbar />
      <main id="main">
        {/* Hero */}
        <section className="page-wrap pb-10 pt-12 text-center sm:pt-16">
          <span className="badge-yellow">
            <Sparkles size={14} strokeWidth={1.75} /> Free AI-powered IELTS prep
          </span>
          <h1 className="type-hero mx-auto mt-4 max-w-3xl">
            Master IELTS with an AI examiner by your side
          </h1>
          <p className="type-lead mx-auto mt-4 max-w-2xl">
            Practise all four modules, get instant band scores, and watch your radar chart
            climb — free forever.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-primary">
              Start preparing free <ArrowRight size={18} strokeWidth={1.75} />
            </Link>
            <Link href="/mock-test" className="btn-secondary">
              Try a mock test
            </Link>
          </div>
          <ul className="mx-auto mt-8 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CheckCircle2 size={16} strokeWidth={1.75} className="shrink-0 text-emerald-500" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* Modules — stretched-link cards */}
        <section className="page-wrap pb-12">
          <h2 className="type-h2">Choose your module</h2>
          <p className="type-body mt-1">Four skills, one dashboard, zero cost.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map(({ href, icon: Icon, title, desc, badge }) => (
              <div key={href} className="warm-card-hover relative p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEF3C7]">
                    <Icon size={22} strokeWidth={1.75} className="text-[#B45309]" />
                  </span>
                  <span className="badge-blue">{badge}</span>
                </div>
                <h3 className="type-h3 mt-3">{title}</h3>
                <p className="type-body mt-1">{desc}</p>
                <Link href={href} className="absolute inset-0 z-10 rounded-2xl" aria-label={title} />
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="page-wrap pb-12">
          <h2 className="type-h2">How it works</h2>
          <p className="type-body mt-1">Three steps from sign-up to a higher band.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.title} className="warm-card p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F2FE]">
                  <s.icon size={22} strokeWidth={1.75} className="text-[#0369A1]" />
                </span>
                <h3 className="type-h3 mt-3">{s.title}</h3>
                <p className="type-body mt-1">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Study tools */}
        <section className="page-wrap pb-12">
          <h2 className="type-h2">Free study tools</h2>
          <p className="type-body mt-1">Built for the gaps between practice tests.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="warm-card-hover relative p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F2FE]">
                <Layers size={22} strokeWidth={1.75} className="text-[#0369A1]" />
              </span>
              <h3 className="type-h3 mt-3">Vocabulary flashcards</h3>
              <p className="type-body mt-1">Band 7–8 words with meanings and examples.</p>
              <Link href="/vocab" className="absolute inset-0 z-10 rounded-2xl" aria-label="Vocabulary flashcards" />
            </div>
            <div className="warm-card-hover relative p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F2FE]">
                <PenLine size={22} strokeWidth={1.75} className="text-[#0369A1]" />
              </span>
              <h3 className="type-h3 mt-3">Grammar gym</h3>
              <p className="type-body mt-1">8-topic quiz plus an AI grammar checker.</p>
              <Link href="/grammar" className="absolute inset-0 z-10 rounded-2xl" aria-label="Grammar gym" />
            </div>
            <div className="warm-card-hover relative p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F2FE]">
                <Trophy size={22} strokeWidth={1.75} className="text-[#0369A1]" />
              </span>
              <h3 className="type-h3 mt-3">Leaderboard</h3>
              <p className="type-body mt-1">See how your average band compares.</p>
              <Link href="/leaderboard" className="absolute inset-0 z-10 rounded-2xl" aria-label="Leaderboard" />
            </div>
          </div>
        </section>

        {/* FAQ — also powers the FAQPage rich result */}
        <section className="page-wrap pb-12">
          <h2 className="type-h2">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="warm-card group p-5">
                <summary className="cursor-pointer list-none text-[1.0625rem] font-extrabold tracking-tight text-slate-900 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="text-[#D97706] transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="type-body mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="page-wrap pb-4">
          <div className="warm-card flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="type-h2">Ready to see your real band?</h2>
            <p className="type-lead max-w-xl">
              Take one reading test now — it takes 20 minutes and you get a scored report
              with explanations for every answer.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/practice/reading" className="btn-primary">
                Start a reading test <ArrowRight size={18} strokeWidth={1.75} />
              </Link>
              <Link href="/about" className="btn-secondary">
                Why it&apos;s free
              </Link>
            </div>
            <p className="type-meta">
              No account needed to try it.{" "}
              <Link href="/register" className="font-semibold text-[#B45309] underline">
                Create one free
              </Link>{" "}
              to save your progress.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
