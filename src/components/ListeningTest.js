"use client";

import { useEffect, useState } from "react";
import Timer from "./Timer";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import { CheckCircle2, XCircle, Loader2, Send, AudioLines } from "lucide-react";

export default function ListeningTest({ exam }) {
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
  if (!mounted) return <div className="skeleton h-96 rounded-2xl" />;

  const questions = exam.questionsList ?? [];

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      // apiPost attaches the CSRF header and normalises API errors.
      const data = await apiPost("/api/score/listening", {
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
    return (
      <div className="space-y-4">
        <div className="warm-card p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Your band score</p>
          <p className="text-5xl font-black tracking-tight text-slate-900">{result.bandScore}</p>
          <p className="mt-1 text-sm text-slate-600">
            {result.correct} of {result.total} correct
          </p>
        </div>
        {(result.detail ?? []).map((d, i) => (
          <div key={d.id} className="warm-card p-5">
            <p className="font-semibold text-slate-800">
              Q{i + 1}. {d.question}
            </p>
            <div className="mt-2 text-sm">
              {d.isCorrect ? (
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle2 size={16} strokeWidth={1.75} /> Correct — {d.correctAnswer}
                </span>
              ) : (
                <span className="flex items-center gap-1 font-semibold text-red-500">
                  <XCircle size={16} strokeWidth={1.75} /> You: {d.userAnswer || "—"} · Correct:{" "}
                  {d.correctAnswer}
                </span>
              )}
            </div>
            {d.explanation && <p className="mt-1 text-sm text-slate-500">{d.explanation}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {Object.keys(answers).length}/{questions.length} answered
        </p>
        <Timer seconds={exam.durationMin * 60} onExpire={submit} />
      </div>

      <div className="warm-card p-6">
        <h2 className="type-h3 flex items-center gap-2">
          <AudioLines size={20} strokeWidth={1.75} className="text-[#0284C7]" /> Audio transcript (demo)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{exam.transcript}</p>
        {exam.audioNote && <p className="mt-2 text-xs italic text-slate-500">{exam.audioNote}</p>}
      </div>

      <div className="warm-card space-y-4 p-6">
        <h2 className="type-h3">Questions</h2>
        {questions.map((q, i) => (
          <div key={q.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label htmlFor={q.id} className="flex-1 text-sm font-medium text-slate-700">
              Q{i + 1}. {q.text}
            </label>
            <input
              id={q.id}
              className="warm-input sm:max-w-[220px]"
              placeholder="Your answer"
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      <button onClick={submit} disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={1.75} />}
        {submitting ? "Scoring…" : "Submit answers"}
      </button>
    </div>
  );
}
