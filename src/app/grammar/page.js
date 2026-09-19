"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { grammarQuestions } from "@/data/vocabWords";
import { apiPost } from "@/lib/client/api";
import { CheckCircle2, XCircle, Loader2, Sparkles, Send, RotateCcw } from "lucide-react";

export default function GrammarPage() {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [checkText, setCheckText] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const score = grammarQuestions.filter((q) => answers[q.id] === q.answer).length;

  // The button flips to "Checking…" in the same frame the user clicks
  // (instant feedback) while the AI call runs in the background.
  async function grammarCheck() {
    if (checkText.trim().length < 5) return;
    setChecking(true);
    setCheckResult(null);
    try {
      const data = await apiPost("/api/grammar-check", { text: checkText });
      setCheckResult(data);
    } catch (err) {
      setCheckResult({ error: err.message });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/grammar" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Grammar" }]} />
          <h1 className="type-h1">Grammar gym</h1>
          <p className="type-lead mt-1">8-topic quiz plus an AI grammar checker.</p>

          {/* AI checker */}
          <section className="warm-card mt-6 p-6">
            <h2 className="type-h3 flex items-center gap-2">
              <Sparkles size={20} strokeWidth={1.75} className="text-[#0284C7]" /> AI grammar checker
            </h2>
            <textarea
              className="warm-input mt-3 min-h-[100px]"
              placeholder="Paste a sentence, e.g. She have been working here since five years."
              value={checkText}
              onChange={(e) => setCheckText(e.target.value)}
            />
            <button onClick={grammarCheck} disabled={checking} className="btn-primary mt-3">
              {checking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={1.75} />}
              {checking ? "Checking…" : "Check grammar"}
            </button>
            {checkResult?.error && (
              <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {checkResult.error}
              </p>
            )}
            {checkResult && !checkResult.error && (
              <div className="mt-4 space-y-2 rounded-xl border border-[#EBE3D5] bg-[#FCF9F2] p-4 text-sm">
                <p>
                  <span className="font-bold text-slate-800">Corrected: </span>
                  <span className="text-slate-700">{checkResult.corrected}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-800">Score: </span>
                  <span className="badge-blue">{checkResult.score}/100</span>{" "}
                  {!checkResult.aiUsed && <span className="badge-yellow">offline mode</span>}
                </p>
                {(checkResult.issues ?? []).map((iss, i) => (
                  <p key={i} className="text-slate-600">
                    <span className="font-semibold text-red-500 line-through">{iss.original}</span>
                    {" → "}
                    <span className="font-semibold text-emerald-600">{iss.fix}</span>
                    <span className="text-slate-500"> ({iss.rule})</span>
                  </p>
                ))}
                {checkResult.tip && <p className="italic text-slate-500">Tip: {checkResult.tip}</p>}
              </div>
            )}
          </section>

          {/* Quiz */}
          <section className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="type-h3">Quick quiz</h2>
              {checked && (
                <span className="badge-yellow !text-sm">
                  Score: {score}/{grammarQuestions.length}
                </span>
              )}
            </div>
            {grammarQuestions.map((q, i) => (
              <div key={q.id} className="warm-card p-5">
                <p className="text-sm font-semibold text-slate-800">
                  Q{i + 1} <span className="badge-blue ml-1">{q.topic}</span>
                </p>
                <p className="mt-1 font-medium text-slate-800">{q.question}</p>
                <div className="scroll-x no-scrollbar mt-3 sm:flex-wrap sm:overflow-visible">
                  {q.options.map((opt) => {
                    const picked = answers[q.id] === opt;
                    let cls = "border-[#EBE3D5] bg-white text-slate-700 hover:border-[#D97706]";
                    if (checked && opt === q.answer) cls = "border-emerald-400 bg-emerald-50 text-emerald-700";
                    else if (checked && picked) cls = "border-red-300 bg-red-50 text-red-600";
                    else if (picked) cls = "border-[#D97706] bg-[#F59E0B] text-slate-950";
                    return (
                      <button
                        key={opt}
                        onClick={() => !checked && setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {checked && (
                  <p className={`mt-2 flex items-start gap-1 text-sm ${answers[q.id] === q.answer ? "text-emerald-600" : "text-slate-500"}`}>
                    {answers[q.id] === q.answer ? (
                      <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                    )}
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}
            <div className="flex gap-2">
              {!checked ? (
                <button onClick={() => setChecked(true)} className="btn-primary">
                  Check answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setChecked(false);
                    setAnswers({});
                  }}
                  className="btn-secondary"
                >
                  <RotateCcw size={18} strokeWidth={1.75} /> Retry
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
