"use client";

import { useEffect, useRef, useState } from "react";
import Timer from "./Timer";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import {
  CheckCircle2, XCircle, Loader2, Send,
  Play, Pause, RotateCcw, Volume2, Headphones, 
  Sparkles, ChevronDown, ChevronUp, Activity
} from "lucide-react";

export default function ListeningTest({ exam }) {
  const { applyStats } = useUser();
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(() => Date.now());

  // Section State
  const [activeSection, setActiveSection] = useState("all");
  
  // Transcript Visibility State
  const [showTranscript, setShowTranscript] = useState(true);

  // Speech Engine State
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [rate, setRate] = useState(1.0); // Speed: 0.8, 1.0, 1.2
  const [isPlaying, setIsPlaying] = useState(false);
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);

  // Keep ref of values for speech callbacks to avoid stale state closures
  const stateRef = useRef({ isPlaying: false, sentences: [], currentSentenceIdx: 0, rate: 1.0, voice: null });

  useEffect(() => {
    setMounted(true);
    
    // Load system voices
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const systemVoices = window.speechSynthesis.getVoices();
        // Filter for English-language voices
        const englishVoices = systemVoices.filter(v => v.lang.startsWith("en"));
        setVoices(englishVoices);
        
        // Auto-select a high-quality default English voice
        const defaultVoice = englishVoices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || englishVoices[0];
        if (defaultVoice) setSelectedVoiceName(defaultVoice.name);
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update State Ref whenever values change so TTS callback reads fresh values
  useEffect(() => {
    const selectedVoice = voices.find(v => v.name === selectedVoiceName) || null;
    stateRef.current = {
      isPlaying,
      sentences,
      currentSentenceIdx,
      rate,
      voice: selectedVoice
    };
  }, [isPlaying, sentences, currentSentenceIdx, rate, selectedVoiceName, voices]);

  // Re-build sentences array when selected section or exam transcript changes
  useEffect(() => {
    if (!mounted) return;
    
    let textToSpeak = "";
    if (activeSection === "all") {
      // Concatenate all section transcripts
      textToSpeak = (exam.sections ?? []).map(s => s.transcript).filter(Boolean).join(" ");
    } else {
      const activeSecObj = (exam.sections ?? []).find(s => s.id === activeSection);
      textToSpeak = activeSecObj?.transcript ?? "";
    }

    if (!textToSpeak && exam.transcript) {
      textToSpeak = exam.transcript;
    }

    // Split text into distinct sentences cleanly using punctuation bounds
    const parsedSentences = textToSpeak
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    setSentences(parsedSentences);
    setCurrentSentenceIdx(0);
    setIsPlaying(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [activeSection, exam, mounted]);

  if (!mounted) return <div className="skeleton h-96 rounded-2xl" />;

  const sections = exam.sections ?? [
    {
      id: "sec-default",
      title: "Questions",
      description: "Answer the questions below as you listen.",
      questions: exam.questionsList ?? [],
    },
  ];

  const totalQ = sections.reduce((n, s) => n + (s.questions ?? []).length, 0);

  // SPEAK UTTERANCE RECURSIVE CONTROLLER
  const speakCurrentSentence = (index) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const currentRef = stateRef.current;
    if (!currentRef.isPlaying || index >= currentRef.sentences.length) {
      setIsPlaying(false);
      return;
    }

    const text = currentRef.sentences[index];
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = currentRef.rate;
    if (currentRef.voice) {
      utterance.voice = currentRef.voice;
    }

    utterance.onend = () => {
      const nextIndex = index + 1;
      if (nextIndex < stateRef.current.sentences.length) {
        setCurrentSentenceIdx(nextIndex);
        speakCurrentSentence(nextIndex);
      } else {
        setIsPlaying(false);
        setCurrentSentenceIdx(0);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        setIsPlaying(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setTimeout(() => {
        speakCurrentSentence(currentSentenceIdx);
      }, 50);
    }
  };

  const handleResetAudio = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentSentenceIdx(0);
  };

  const handleProgressBarSeek = (e) => {
    const targetIdx = Math.floor(parseFloat(e.target.value));
    setCurrentSentenceIdx(targetIdx);
    if (isPlaying) {
      setTimeout(() => {
        speakCurrentSentence(targetIdx);
      }, 50);
    }
  };

  // Submit
  async function submit() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
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

  // Format Voice Name Function
  const getCleanVoiceName = (voice) => {
    const cleanName = voice.name
      .replace(/(Microsoft|Google|Desktop|Online|Natural)/ig, "")
      .trim()
      .substring(0, 16);
    return `${cleanName} · ${voice.lang.toUpperCase()}`;
  };

  // ---- RESULTS VIEW ----
  if (result) {
    const byId = Object.fromEntries((result.detail ?? []).map((d) => [d.id, d]));
    let globalIdx = 0;
    return (
      <div className="space-y-4">
        <div className="warm-card p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Your band score</p>
          <p className="text-5xl font-black tracking-tight text-slate-900">{result.bandScore}</p>
          <p className="mt-1 text-sm text-slate-600">{result.correct} of {result.total} correct</p>
        </div>
        {sections.map((sec) => (
          <div key={sec.id} className="space-y-3">
            <h3 className="mt-4 border-b border-[#EBE3D5] pb-2 text-lg font-bold text-slate-800">{sec.title}</h3>
            {(sec.questions ?? []).map((q) => {
              globalIdx += 1;
              const d = byId[q.id];
              return (
                <div key={q.id} className="warm-card p-5">
                  <p className="font-semibold text-slate-800">Q{globalIdx}. {q.text}</p>
                  <div className="mt-2 text-sm">
                    {d?.isCorrect ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <CheckCircle2 size={16} strokeWidth={1.75} /> Correct — {d.correctAnswer}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-red-500">
                        <XCircle size={16} strokeWidth={1.75} /> You: {d?.userAnswer || "—"} · Correct: {d?.correctAnswer}
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

  // ---- TEST VIEW ----
  const visibleSections = activeSection === "all"
    ? sections
    : sections.filter((s) => s.id === activeSection);

  // Build global question numbers
  const qNumberMap = {};
  let gIdx = 0;
  sections.forEach((sec) => {
    (sec.questions ?? []).forEach((q) => {
      gIdx += 1;
      qNumberMap[q.id] = gIdx;
    });
  });

  const totalSentences = sentences.length || 1;

  return (
    <div className="space-y-6">
      {/* Top statistics and count-down timer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {Object.keys(answers).length}/{totalQ} answered
        </p>
        <Timer
          seconds={exam.durationMin * 60}
          onExpire={submit}
          isActive={isPlaying}
        />
      </div>

      {/* ===== POLISHED SPEECH-PLAYER PANEL ===== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#F59E0B]" />
            <span className="text-sm font-bold tracking-wide">IELTS DYNAMIC TTS READER</span>
          </div>
          {isPlaying && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>
              Live
            </span>
          )}
        </div>

        {/* Main Control Area */}
        <div className="px-5 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Circular Play/Pause */}
            <button
              type="button"
              onClick={handlePlayPause}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-slate-950 shadow-lg transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause speaker" : "Play speaker"}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            
            {/* Progress & Status */}
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="font-bold text-slate-800">Section Transcript Audio</h4>
                <p className="text-xs text-slate-500">
                  {isPlaying 
                    ? `Reading sentence ${currentSentenceIdx + 1} of ${totalSentences}` 
                    : currentSentenceIdx > 0 
                      ? `Paused at sentence ${currentSentenceIdx + 1}` 
                      : "Press play to hear the actual text read out loud."}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="w-6 text-right text-xs font-mono font-bold text-slate-400">
                  {currentSentenceIdx}
                </span>
                <input
                  type="range"
                  min="0"
                  max={totalSentences - 1}
                  value={currentSentenceIdx}
                  onChange={handleProgressBarSeek}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-100 accent-[#F59E0B]"
                />
                <span className="w-6 text-xs font-mono font-bold text-slate-400">
                  {totalSentences}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area with Warm Colors */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EBE3D5] bg-[#FCF9F2] px-5 py-3">
          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetAudio}
            className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            title="Reset audio to beginning"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <div className="flex items-center gap-4">
            {/* Speed Pills */}
            <div className="hidden items-center gap-1 rounded-lg border border-[#EBE3D5] bg-white p-1 shadow-sm sm:flex">
              {[0.8, 1.0, 1.2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setRate(speed)}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    rate === speed 
                      ? "bg-[#F59E0B] text-slate-950" 
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Voice/Accent Selection Dropdown */}
            {voices.length > 0 && (
              <div className="relative flex items-center rounded-lg border border-[#EBE3D5] bg-white px-3 py-1.5 shadow-sm transition-colors focus-within:border-[#F59E0B] focus-within:ring-1 focus-within:ring-[#F59E0B]">
                <Volume2 size={14} className="text-slate-400" />
                <select
                  className="peer w-full cursor-pointer appearance-none bg-transparent pl-2 pr-6 text-xs font-bold text-slate-700 outline-none"
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {getCleanVoiceName(v)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2 text-slate-400 peer-focus:text-[#F59E0B]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== TOGGLEABLE WRITTEN TRANSCRIPT PANEL ===== */}
      <div className="warm-card p-5">
        <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-2">
          <h3 className="type-h3 flex items-center gap-2 text-slate-900">
            <Headphones size={20} className="text-[#D97706]" />
            Interactive Section Transcript
          </h3>
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-[#EBE3D5] hover:text-slate-900"
            title={showTranscript ? "Hide Transcript" : "Show Transcript"}
          >
            {showTranscript ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {showTranscript && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line bg-[#FCF9F2] p-4 rounded-xl border border-[#EBE3D5] max-h-56 overflow-y-auto">
            {activeSection === "all"
              ? (exam.sections ?? []).map((s, idx) => `[SECTION ${idx + 1}]\n${s.transcript}`).join("\n\n")
              : (exam.sections ?? []).find(s => s.id === activeSection)?.transcript ?? exam.transcript}
          </p>
        )}
      </div>

      {/* ===== SECTION NAVIGATION TABS ===== */}
      {sections.length > 1 && (
        <div className="sticky top-16 z-20 flex flex-wrap gap-2 rounded-xl border border-[#EBE3D5] bg-white/90 p-3 backdrop-blur-sm shadow-sm">
          <button
            type="button"
            onClick={() => setActiveSection("all")}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              activeSection === "all"
                ? "bg-[#F59E0B] text-slate-950"
                : "bg-[#FCF9F2] text-slate-600 hover:bg-[#EBE3D5]"
            }`}
          >
            All Sections
          </button>
          {sections.map((sec, i) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                activeSection === sec.id
                  ? "bg-[#F59E0B] text-slate-950"
                  : "bg-[#FCF9F2] text-slate-600 hover:bg-[#EBE3D5]"
              }`}
            >
              Section {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ===== QUESTIONS INTERFACE ===== */}
      <div className="space-y-6">
        {visibleSections.map((sec) => {
          const realSecIdx = sections.indexOf(sec);
          return (
            <section key={sec.id} className="warm-card p-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F59E0B] text-sm font-black text-slate-950">
                  {realSecIdx + 1}
                </span>
                {sec.title}
              </h2>
              {sec.description && (
                <p className="mt-1 text-sm italic text-slate-500">{sec.description}</p>
              )}

              <div className="mt-5 space-y-4">
                {(sec.questions ?? []).map((q) => (
                  <div
                    key={q.id}
                    className="flex flex-col gap-2 rounded-xl border border-[#EBE3D5] bg-[#FCF9F2] p-4 md:flex-row md:items-center"
                  >
                    <label htmlFor={q.id} className="flex-1 text-sm font-semibold text-slate-800">
                      <span className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D97706] text-xs font-black text-white">
                        {qNumberMap[q.id]}
                      </span>
                      {q.text}
                    </label>
                    <input
                      id={q.id}
                      className="warm-input md:max-w-[260px]"
                      placeholder="Type your answer"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
      )}

      <button onClick={submit} disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={1.75} />}
        {submitting ? "Scoring…" : "Submit answers"}
      </button>
    </div>
  );
}