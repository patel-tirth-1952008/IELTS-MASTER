import Link from "next/link";
import Navbar from "@/components/Navbar";
import { pageMetadata } from "@/lib/site";
import { Compass, BookOpen, PenLine, Headphones, Mic, ArrowRight } from "lucide-react";

export const metadata = pageMetadata({
  title: "Page not found (404)",
  description:
    "That page has moved or never existed. Jump back into free IELTS reading, writing, listening and speaking practice.",
  path: "/404",
  noindex: true,
});

const DESTINATIONS = [
  { href: "/reading", label: "Reading practice", icon: BookOpen },
  { href: "/writing", label: "Writing task 1 & 2", icon: PenLine },
  { href: "/listening", label: "Listening tests", icon: Headphones },
  { href: "/speaking", label: "Speaking cue cards", icon: Mic },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex max-w-3xl flex-col items-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEF3C7]">
          <Compass size={30} strokeWidth={1.75} className="text-[#B45309]" />
        </div>
        <p className="type-eyebrow mt-5 text-[#B45309]">Error 404</p>
        <h1 className="type-h1 mt-2">We couldn&apos;t find that page</h1>
        <p className="type-lead mx-auto mt-3 max-w-lg">
          The link may be old or mistyped. Nothing lost — your progress is saved. Pick a
          skill below and keep going.
        </p>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          {DESTINATIONS.map((d) => (
            <div key={d.href} className="warm-card-hover relative flex items-center gap-3 p-4 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7]">
                <d.icon size={18} strokeWidth={1.75} className="text-[#B45309]" />
              </span>
              <span className="font-bold text-slate-900">{d.label}</span>
              <ArrowRight size={16} strokeWidth={1.75} className="ml-auto text-slate-400" />
              <Link href={d.href} className="absolute inset-0 z-10 rounded-2xl" aria-label={d.label} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            My dashboard
          </Link>
          <Link href="/contact" className="btn-secondary">
            Report a broken link
          </Link>
        </div>
      </main>
    </div>
  );
}
