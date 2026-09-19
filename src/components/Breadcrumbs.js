import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ trail = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="scroll-x no-scrollbar mb-6 items-center gap-1 text-sm sm:flex-wrap sm:overflow-visible">
      <Link href="/" className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-900">
        <Home size={14} strokeWidth={1.75} />
        Home
      </Link>
      {trail.map((t, i) => (
        <span key={t.href ?? i} className="flex items-center gap-1">
          <ChevronRight size={14} strokeWidth={1.75} className="text-slate-400" />
          {t.href && i < trail.length - 1 ? (
            <Link href={t.href} className="font-medium text-slate-500 hover:text-slate-900">
              {t.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-800">{t.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
