"use client";

import { useEffect, useRef, useState } from "react";
import Timer from "./Timer";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import { CheckCircle2, XCircle, Loader2, Send, Play, Pause, Volume2, Headphones } from "lucide-react";

export default function ListeningTest({ exam }) {
  const { applyStats } = useUser();
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(() => Date.now());

  // Audio Player State
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [hasPlayedAtLeastOnce, setHasPlayedAtLeastOnce] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync volume state with HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!mounted) return <div className="skeleton h-96 rounded-2xl" />;

  // Support both the new nested section schema and the flat questionsList fallback
  const sections = exam.sections ?? [
    {
      id: "sec-default",
      title: "Questions",
      description: "Answer the questions below as you listen.",
      questions: exam.questionsList ?? [],
    },
  ];

  const totalQuestionsCount = sections.reduce((acc, s) => acc + (s.questions ?? []).length, 0);

  // Audio element control handlers
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Audio play deferred:", err));
      setIsPlaying(true);
      setHasPlayedAtLeastOnce(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  async function submit() {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setSubmitting(true);
    setError("");
    try {
      const data = await apiPost("/api/score/listening", {
        examId: exam.id,
        answers,
        timeTaken: Math.round((Date.now() - startedAt) / 1000),
      });
      setResult(data);
      if (data.stats) applyStats(data.stats);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
        
        {sections.map((sec) => (
          <div key={sec.id} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2 border-[#EBE3D5]">{sec.title}</h3>
            {(sec.questions ?? []).map((q, i) => {
              const d = byId[q.id];
              return (
                <div key={q.id} className="warm-card p-5">
                  <p className="font-semibold text-slate-800">
                    Q. {q.text}
                  </p>
                  <div className="mt-2 text-sm">
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
        ))}
      </div>
    );
  }

  const hasAudio = !!exam.audioUrl;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {Object.keys(answers).length}/{totalQuestionsCount} answered
        </p>
        {/* Timer is active only when audio is playing, or if there is no audio file */}
        <Timer 
          seconds={exam.durationMin * 60} 
          onExpire={submit} 
          isActive={hasAudio ? isPlaying : true} 
        />
      </div>

      {/* HTML5 Audio Tag */}
      {hasAudio && (
        <audio
          ref={audioRef}
          src={exam.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Interactive Player Dashboard */}
      {hasAudio && (
        <div className="rounded-2xl border-2 border-[#D97706] bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F59E0B] text-slate-950 transition-transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Headphones size={18} className="text-[#F59E0B]" />
                  IELTS Academic Listening Track
                </h3>
                <p className="text-xs text-slate-500">
                  {isPlaying ? "Audio playing · Timer active" : hasPlayedAtLeastOnce ? "Audio paused · Timer paused" : "Click play to start audio and countdown"}
                </p>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-[#F59E0B] cursor-pointer"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="h-2 flex-1 accent-[#F59E0B] bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-500">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Graceful fallback banner if test is running as a text transcript */}
      {!hasAudio && exam.transcript && (
        <div className="warm-card p-6">
          <h2 className="type-h3 flex items-center gap-2">
            <Headphones size={20} className="text-[#F59E0B]" /> Transcript (Demo Mode)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">{exam.transcript}</p>
        </div>
      )}

      {/* Sections and Questions */}
      <div className="space-y-6">
        {sections.map((sec, secIdx) => (
          <section key={sec.id} className="warm-card p-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FCF9F2] border border-[#EBE3D5] text-sm text-[#D97706]">
                {secIdx + 1}
              </span>
              {sec.title}
            </h2>
            {sec.description && <p className="mt-1 text-sm text-slate-500 italic">{sec.description}</p>}
            
            <div className="mt-5 space-y-4">
              {(sec.questions ?? []).map((q, qIdx) => (
                <div key={q.id} className="flex flex-col gap-2 rounded-xl border border-[#EBE3D5] bg-[#FCF9F2] p-4 md:flex-row md:items-center">
                  <label htmlFor={q.id} className="flex-1 text-sm font-semibold text-slate-800">
                    Q{q.id.replace(/[^\d]/g, "")}. {q.text}
                  </label>
                  <input
                    id={q.id}
                    disabled={hasAudio && !hasPlayedAtLeastOnce}
                    className="warm-input md:max-w-[240px] disabled:bg-slate-50 disabled:cursor-not-allowed"
                    placeholder={hasAudio && !hasPlayedAtLeastOnce ? "Play audio to unlock" : "Type answer here"}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </section>
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