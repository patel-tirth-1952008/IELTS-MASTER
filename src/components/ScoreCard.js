import { Award } from "lucide-react";

export default function ScoreCard({ label, band, sub }) {
  return (
    <div className="warm-card p-5 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF3C7]">
        <Award size={20} strokeWidth={1.75} className="text-[#B45309]" />
      </div>
      <p className="type-score text-3xl">{band ?? "—"}</p>
      <p className="text-sm font-bold text-slate-700">{label}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
