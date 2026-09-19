import Link from "next/link";
import {
  BookOpen,
  PenLine,
  Headphones,
  Mic,
  Layers,
  SpellCheck,
  ClipboardList,
  Trophy,
} from "lucide-react";

const ITEMS = [
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/writing", label: "Writing", icon: PenLine },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/vocab", label: "Vocabulary", icon: Layers },
  { href: "/grammar", label: "Grammar", icon: SpellCheck },
  { href: "/mock-test", label: "Mock Test", icon: ClipboardList },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Sidebar({ active }) {
  return (
    <aside className="warm-card hidden w-56 shrink-0 self-start p-3 lg:block">
      <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Practice modules
      </p>
      <nav className="grid gap-1" aria-label="Practice modules">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              active === href
                ? "bg-[#FEF3C7] text-[#B45309]"
                : "text-slate-600 hover:bg-[#FCF9F2] hover:text-slate-900"
            }`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
