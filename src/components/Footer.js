import Link from "next/link";
import { GraduationCap, Mail } from "lucide-react";
import { SITE } from "@/lib/site";

// Site-wide internal linking (SEO: every page gets a crawlable path to the
// money pages; users get a way out of a dead end). Server-rendered, zero JS.

const COLUMNS = [
  {
    title: "Practise",
    links: [
      { href: "/reading", label: "Reading practice" },
      { href: "/writing", label: "Writing task 1 & 2" },
      { href: "/listening", label: "Listening tests" },
      { href: "/speaking", label: "Speaking cue cards" },
      { href: "/mock-test", label: "Full mock test" },
    ],
  },
  {
    title: "Improve",
    links: [
      { href: "/vocab", label: "Vocabulary flashcards" },
      { href: "/grammar", label: "Grammar gym" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/dashboard", label: "Your progress" },
    ],
  },
  {
    title: "IELTS Master",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy & cookies" },
      { href: "/register", label: "Create free account" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-[#EBE3D5] bg-white/60">
      <div className="page-wrap py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="IELTS Master home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F59E0B]">
                <GraduationCap size={20} strokeWidth={1.75} className="text-slate-950" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                IELTS <span className="text-[#D97706]">Master</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              {SITE.tagline}. AI band feedback, model answers and a study plan that
              adapts to your weak spots — always free.
            </p>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#B45309] hover:underline"
            >
              <Mail size={15} strokeWidth={1.75} />
              {SITE.contactEmail}
            </a>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="type-eyebrow text-slate-500">{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-slate-600 transition-colors hover:text-[#B45309]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#EBE3D5] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Built for self-study — always double-check band
            estimates with a qualified teacher.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/about" className="hover:text-slate-900">About</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-900">Sitemap</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
