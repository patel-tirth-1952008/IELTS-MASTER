export default function XPBar({ value = 0, target = 7.5, label = "Overall band" }) {
  const pct = Math.max(0, Math.min(100, (value / 9) * 100));
  const targetPct = Math.max(0, Math.min(100, (target / 9) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">
          {value} <span className="font-medium text-slate-500">/ target {target}</span>
        </span>
      </div>
      <div className="relative h-3 overflow-visible rounded-full bg-[#F1EAD9]">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] transition-all"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute -top-1 h-5 w-1 rounded-full bg-[#0284C7]"
          style={{ left: `calc(${targetPct}% - 2px)` }}
          title={`Target ${target}`}
        />
      </div>
    </div>
  );
}
