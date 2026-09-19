"use client";

import { useEffect, useMemo, useState } from "react";
import Timer from "./Timer";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import { CheckCircle2, XCircle, Loader2, Send } from "lucide-react";

export default function ReadingTest({ exam }) {
  const { applyStats } = useUser();
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    setMounted(true);
  }, []);

  const questions = useMemo(
    () => (exam.passages ?? []).flatMap((p) => p.questions ?? []),
    [exam]
  );

  if (!mounted) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  function setAnswer(id, value) {
    if (result) return;
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      // apiPost attaches the CSRF header and normalises API errors.
      const data = await apiPost("/api/score/reading", {
        examId: exam.id,
        answers,
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
    const byId = Object.fromEntries((result.detail ?? []).map((d) => [d.id, d]));
    return (
      <div className="space-y-4">
        <div className="warm-card p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Your band score</p>
          <p className="text-5xl font-black tracking-tight text-slate-900">{result.bandScore}</p>
          <p className="mt-1 text-sm text-slate-600">
            {result.correct} of {result.total} correct
          </p>
        </div>
        {questions.map((q, i) => {
          const d = byId[q.id];
          return (
            <div key={q.id} className="warm-card p-5">
              <p className="font-semibold text-slate-800">
                Q{i + 1}. {q.text}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                {d?.isCorrect ? (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 size={16} strokeWidth={1.75} /> Correct — {d.correctAnswer}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-red-500">
                    <XCircle size={16} strokeWidth={1.75} /> You: {d?.userAnswer || "—"} · Correct:{" "}
                    {d?.correctAnswer}
                  </span>
                )}
              </div>
              {d?.explanation && <p className="mt-1 text-sm text-slate-500">{d.explanation}</p>}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {Object.keys(answers).length}/{questions.length} answered
        </p>
        <Timer seconds={exam.durationMin * 60} onExpire={submit} />
      </div>

      {(exam.passages ?? []).map((p) => (
        <section key={p.id} className="warm-card p-6">
          <h2 className="type-h3">{p.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.text}</p>
          <div className="mt-5 space-y-4">
            {(p.questions ?? []).map((q) => (
              <div key={q.id} className="rounded-xl border border-[#EBE3D5] bg-[#FCF9F2] p-4">
                <p className="text-sm font-semibold text-slate-800">{q.text}</p>
                {q.kind === "gap" ? (
                  <input
                    className="warm-input mt-2 max-w-xs"
                    placeholder="Type your answer"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                  />
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(q.options ?? []).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswer(q.id, opt)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                          answers[q.id] === opt
                            ? "border-[#D97706] bg-[#F59E0B] text-slate-950"
                            : "border-[#EBE3D5] bg-white text-slate-700 hover:border-[#D97706]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      <button onClick={submit} disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={1.75} />}
        {submitting ? "Scoring…" : "Submit answers"}
      </button>
    </div>
  );
}
