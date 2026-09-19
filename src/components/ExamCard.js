import Link from "next/link";
import { Clock, FileText, ArrowUpRight } from "lucide-react";

// Stretched-link pattern: card is a plain div; an absolute Link covers it.
// Never nest divs inside the Link (avoids hydration errors).
export default function ExamCard({ exam, href }) {
  return (
    <div className="warm-card-hover relative p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="badge-yellow capitalize">{exam.type}</span>
        <span className="badge-blue">{exam.difficulty}</span>
      </div>
      <h3 className="type-h3">{exam.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{exam.description}</p>
      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1">
          <Clock size={14} strokeWidth={1.75} /> {exam.durationMin} min
        </span>
        <span className="flex items-center gap-1">
          <FileText size={14} strokeWidth={1.75} /> {exam.questions} Qs
        </span>
        <span className="ml-auto flex items-center gap-1 font-bold text-[#B45309]">
          Start <ArrowUpRight size={14} strokeWidth={1.75} />
        </span>
      </div>
      <Link href={href} className="absolute inset-0 z-10 rounded-2xl" aria-label={exam.title} />
    </div>
  );
}
