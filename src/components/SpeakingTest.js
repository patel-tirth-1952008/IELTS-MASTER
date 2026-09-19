"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import { Loader2, Send, Mic, Square, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function SpeakingTest({ exam }) {
  const { applyStats } = useUser();
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(() => Date.now());
  const recRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-GB";
      rec.onresult = (e) => {
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        }
        if (final) setText((t) => (t ? t + " " : "") + final.trim());
      };
      rec.onend = () => setRecording(false);
      recRef.current = rec;
    }
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  if (!mounted) return <div className="skeleton h-96 rounded-2xl" />;

  function toggleRecording() {
    if (!recRef.current) return;
    try {
      if (recording) {
        recRef.current.stop();
      } else {
        recRef.current.start();
        setRecording(true);
      }
    } catch {
      setRecording(false);
    }
  }

  async function submit() {
    if (text.split(/\s+/).filter(Boolean).length < 10) {
      setError("Please speak or type at least a few sentences.");
      return;
    }
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setSubmitting(true);
    setError("");
    try {
      // apiPost attaches the CSRF header and normalises API errors.
      const data = await apiPost("/api/score/speaking", {
        examId: exam.id,
        transcript: text,
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
      ["Fluency & Coherence", result.fluency],
      ["Lexical Resource", result.lexical],
      ["Grammar", result.grammar],
      ["Pronunciation*", result.pronunciation],
    ];
    return (
      <div className="space-y-4">
        <div className="warm-card p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Overall band {result.aiUsed ? "· AI examiner" : "· quick estimate"}
          </p>
          <p className="text-5xl font-black tracking-tight text-slate-900">{result.overall}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {criteria.map(([label, band]) => (
            <div key={label} className="warm-card p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{band ?? "—"}</p>
              <p className="text-xs font-semibold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">*Pronunciation is approximated from your transcript.</p>
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
        {result.sampleAnswer && (
          <div className="warm-card p-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles size={18} strokeWidth={1.75} className="text-[#0284C7]" /> Band-8 model answer
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.sampleAnswer}</p>
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
        <span className="badge-blue">Cue card{exam.cueCards?.length > 1 ? "s" : ""}</span>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-medium leading-relaxed text-slate-800">
          {(exam.cueCards ?? []).map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ol>
      </div>

      <div className="warm-card space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-3">
          {supported ? (
            <button
              onClick={toggleRecording}
              className={recording ? "btn-secondary !border-red-300 !text-red-600" : "btn-primary"}
            >
              {recording ? <Square size={18} strokeWidth={1.75} /> : <Mic size={18} strokeWidth={1.75} />}
              {recording ? "Stop recording" : "Record answer"}
            </button>
          ) : (
            <span className="badge-yellow">Mic transcription not supported here — please type below</span>
          )}
          {recording && (
            <span className="flex items-center gap-2 text-sm font-semibold text-red-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Listening…
            </span>
          )}
        </div>
        <textarea
          className="warm-input min-h-[220px] leading-relaxed"
          placeholder="Your answer will appear here as you speak — or type it directly…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p className="text-xs text-slate-500">
          {text.split(/\s+/).filter(Boolean).length} words · aim for 120+ for a full Part-2 style answer.
        </p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      <button onClick={submit} disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={1.75} />}
        {submitting ? "AI is marking…" : "Get AI band score"}
      </button>
    </div>
  );
}
