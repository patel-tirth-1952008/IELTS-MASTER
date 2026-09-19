"use client";

import { useEffect, useState } from "react";
import Timer from "./Timer";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import { Loader2, Send, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function WritingTest({ exam }) {
  const { applyStats } = useUser();
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <div className="skeleton h-96 rounded-2xl" />;

  const words = text.split(/\s+/).filter(Boolean).length;
  const minWords = exam.minWords ?? 250;

  async function submit() {
    if (words < 20) {
      setError("Please write at least 20 words for feedback.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // apiPost attaches the CSRF header and normalises API errors.
      const data = await apiPost("/api/score/writing", {
        examId: exam.id,
        text,
        timeTaken: Math.round((Date.now() - startedAt) / 1000),
      });
      setResult(data);
      // Optimistic dashboard: push the fresh stats straight into the
      // session context so /dashboard is already correct — no refetch.
      if (data.stats) applyStats(data.stats);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const criteria = [
      ["Task Achievement", result.task],
      ["Coherence & Cohesion", result.coherence],
      ["Lexical Resource", result.lexical],
      ["Grammar Range & Accuracy", result.grammar],
    ];
    return (
      <div className="space-y-4">
        <div className="warm-card p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Overall band {result.aiUsed ? "· AI examiner" : "· quick estimate"}
          </p>
          <p className="text-5xl font-black tracking-tight text-slate-900">{result.overall}</p>
          <p className="mt-1 text-sm text-slate-600">
            {result.wordCount} words · target {result.minWords}+
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {criteria.map(([label, band]) => (
            <div key={label} className="warm-card p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{band ?? "—"}</p>
              <p className="text-xs font-semibold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="warm-card p-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 size={18} strokeWidth={1.75} className="text-emerald-500" /> Strengths
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {(result.strengths ?? []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="warm-card p-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <AlertCircle size={18} strokeWidth={1.75} className="text-[#D97706]" /> To improve
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {(result.improvements ?? []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        {result.corrected && (
          <div className="warm-card p-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles size={18} strokeWidth={1.75} className="text-[#0284C7]" /> Examiner rewrite
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.corrected}</p>
          </div>
        )}
        <button onClick={() => setResult(null)} className="btn-secondary">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="warm-card p-6">
        <span className="badge-blue">Question</span>
        <p className="mt-2 font-medium leading-relaxed text-slate-800">{exam.prompt}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm font-semibold ${words >= minWords ? "text-emerald-600" : "text-slate-500"}`}>
          {words} / {minWords}+ words
        </p>
        <Timer seconds={exam.durationMin * 60} onExpire={submit} />
      </div>
      <textarea
        className="warm-input min-h-[320px] leading-relaxed"
        placeholder="Write your essay here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
      <button onClick={submit} disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={1.75} />}
        {submitting ? "AI is marking…" : "Get AI band score"}
      </button>
      <p className="text-xs text-slate-500">
        Powered by Groq (Llama 3.3). Without an API key you get an instant heuristic estimate.
      </p>
    </div>
  );
}
