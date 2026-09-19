"use client";

import { useState } from "react";
import ExamCard from "./ExamCard";

const LEVELS = ["All", "Easy", "Medium", "Hard"];

// Client-side difficulty filter. Takes plain data props only (no render
// functions) so server pages can render it without serialization errors.
export default function ExamListFilter({ exams = [], practicePath = "" }) {
  const [level, setLevel] = useState("All");
  const shown = level === "All" ? exams : exams.filter((e) => e.difficulty === level);
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by difficulty">
        {LEVELS.map((l) => (
          <button
            key={l}
            role="tab"
            aria-selected={level === l}
            onClick={() => setLevel(l)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              level === l
                ? "border-[#D97706] bg-[#F59E0B] text-slate-950"
                : "border-[#EBE3D5] bg-white text-slate-600 hover:border-[#D97706]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="warm-card p-6 text-center text-sm text-slate-500">
          No {level.toLowerCase()} exams yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((e) => (
            <ExamCard key={e.id} exam={e} href={`${practicePath}?exam=${e.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
