import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";
import {
  Heart, Zap, ShieldCheck, Target, Users, BookOpen, ArrowRight, CheckCircle2,
} from "lucide-react";

export const metadata = pageMetadata({
  title: "About IELTS Master — free IELTS preparation",
  description:
    "Why IELTS Master is free, how our AI examiner scores your writing and speaking against the official IELTS criteria, and how we protect your data.",
  path: "/about",
  keywords: ["about ielts master", "free ielts prep", "ai ielts examiner"],
});

export const revalidate = 86400;

const VALUES = [
  {
    icon: Heart,
    title: "Free forever",
    body: "No paywalls, no trials, no “upgrade to see your score”. Every module, every mark, every model answer is free.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    body: "Auto-scored reading and listening, plus AI criteria-level writing and speaking marks in seconds — not the days a tutor takes.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "HTTP-only session cookies, bcrypt-hashed passwords, rate-limited APIs and first-party analytics you can switch off.",
  },
];

const METHOD = [
  {
    step: "01",
    title: "You practise under exam conditions",
    body: "Every test runs against the real clock — 60 minutes for reading, 40 for listening, 60 for writing Task 1 + 2. The timer auto-submits so practising here feels like the real thing.",
  },
  {
    step: "02",
    title: "Objective sections are scored exactly",
    body: "Reading and listening are marked answer-by-answer, then converted to a band with the standard 40-question conversion table — the same mapping the exam uses for Academic Reading and Listening.",
  },
  {
    step: "03",
    title: "Productive skills go to the AI examiner",
    body: "Writing and speaking are assessed against the four official criteria: Task Achievement/Response, Coherence & Cohesion, Lexical Resource and Grammatical Range & Accuracy. You get a band per criterion, the reasons behind it, and a rewritten model of your weakest paragraph.",
  },
  {
    step: "04",
    title: "Your dashboard turns marks into a plan",
    body: "Averages per skill, a radar chart of strengths, a study streak, and a next-best-step suggestion that points at your weakest skill instead of leaving you guessing.",
  },
];

const FAQ_LINKS = [
  { href: "/practice/reading", label: "Start with reading" },
  { href: "/practice/writing", label: "Get an essay marked" },
  { href: "/mock-test", label: "Take a full mock test" },
  { href: "/vocab", label: "Build vocabulary" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap max-w-4xl py-10">
        <Breadcrumbs trail={[{ label: "About" }]} />
        <h1 className="type-h1 max-w-2xl">
          IELTS prep that is free, warm, and a little bit clever
        </h1>
        <p className="type-lead mt-3 max-w-2xl">
          IELTS Master was built for one reason: great exam preparation should not cost a
          month&apos;s salary. Every module — reading, writing, listening, speaking — runs on
          this site for free, with an AI examiner (Groq + Llama 3.3) marking your writing and
          speaking around the clock.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="warm-card p-6">
              <v.icon size={22} strokeWidth={1.75} className="text-[#D97706]" />
              <h2 className="type-h3 mt-3">{v.title}</h2>
              <p className="type-body mt-1">{v.body}</p>
            </div>
          ))}
        </div>

        {/* Methodology — the E-E-A-T signal that separates a real product
            from a content farm: we explain exactly how scores are produced. */}
        <section className="mt-12">
          <h2 className="type-h2">How our scoring actually works</h2>
          <p className="type-body mt-2 max-w-2xl">
            No black boxes. Here is exactly what happens between “start test” and your band
            score — including the parts where we tell you to double-check with a human.
          </p>
          <ol className="mt-6 space-y-4">
            {METHOD.map((m) => (
              <li key={m.step} className="warm-card flex gap-4 p-5">
                <span className="type-score h-10 w-10 shrink-0 rounded-xl bg-[#FEF3C7] pt-1.5 text-center text-sm text-[#B45309]">
                  {m.step}
                </span>
                <div>
                  <h3 className="type-h3">{m.title}</h3>
                  <p className="type-body mt-1">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="warm-card mt-4 border-l-4 border-l-[#F59E0B] p-5">
            <p className="type-body">
              <strong className="font-bold text-slate-900">Honest limitation:</strong> AI
              marking is a very good practice signal but it is not a substitute for an
              examiner. Pronunciation in particular can only be approximated from a
              transcript. Treat every AI band as a directional guide, and verify with a
              qualified teacher before booking the real exam.
            </p>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="warm-card p-6">
            <Target size={22} strokeWidth={1.75} className="text-[#0284C7]" />
            <h2 className="type-h3 mt-3">Who it is for</h2>
            <ul className="mt-3 space-y-2">
              {[
                "First-time candidates who need to learn the question types before booking a test.",
                "Repeat candidates stuck at 6.5 in writing who need criteria-level feedback, fast.",
                "Self-studiers who want daily practice without a monthly subscription.",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="warm-card p-6">
            <Users size={22} strokeWidth={1.75} className="text-[#0284C7]" />
            <h2 className="type-h3 mt-3">How to get the most out of it</h2>
            <ul className="mt-3 space-y-2">
              {[
                "One timed test a day beats five untimed ones — the clock is half the exam.",
                "Read every explanation, even for answers you got right. Guessing right still costs you marks.",
                "Keep a mistake bank: the question types you miss twice are your real syllabus.",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Internal links: give every visitor (and crawler) a next step. */}
        <section className="mt-12">
          <h2 className="type-h2">Start somewhere</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FAQ_LINKS.map((l) => (
              <div key={l.href} className="warm-card-hover relative flex items-center gap-3 p-4">
                <BookOpen size={18} strokeWidth={1.75} className="text-[#B45309]" />
                <span className="font-bold text-slate-900">{l.label}</span>
                <ArrowRight size={16} strokeWidth={1.75} className="ml-auto text-slate-400" />
                <Link href={l.href} className="absolute inset-0 z-10 rounded-2xl" aria-label={l.label} />
              </div>
            ))}
          </div>
          <p className="type-meta mt-6">
            Spotted something wrong, or want a feature that would help you pass?{" "}
            <Link href="/contact" className="font-semibold text-[#B45309] underline">
              Tell us
            </Link>{" "}
            — we build what learners ask for. Read our{" "}
            <Link href="/privacy" className="font-semibold text-[#B45309] underline">
              privacy policy
            </Link>{" "}
            for the full data picture.
          </p>
        </section>
      </main>
    </div>
  );
}
