"use client";

import { memo, useCallback, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useUser } from "@/components/UserProvider";
import { vocabWords } from "@/data/vocabWords";
import { ArrowLeft, ArrowRight, RotateCcw, Shuffle, Volume2, Undo2 } from "lucide-react";

// The card is memoised: flipping it or marking it known no longer re-renders
// the page shell, the progress bar or the toolbar (that was the "blink").
const FlashCard = memo(function FlashCard({ card, flipped, onFlip, onSpeak }) {
  return (
    <button
      onClick={onFlip}
      aria-label={flipped ? "Hide meaning" : "Reveal meaning"}
      className="warm-card-hover block min-h-[280px] w-full p-8 text-center"
    >
      {!flipped ? (
        <>
          <span className="badge-blue">
            Band {card.band}+ · {card.pos}
          </span>
          <p className="type-score mt-4 text-4xl">{card.word}</p>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onSpeak();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                e.preventDefault();
                onSpeak();
              }
            }}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0284C7]"
          >
            <Volume2 size={16} strokeWidth={1.75} /> Pronounce
          </span>
          <p className="type-meta mt-6 opacity-70">Tap card to reveal meaning</p>
        </>
      ) : (
        <>
          <p className="text-lg font-bold text-slate-900">{card.meaning}</p>
          <p className="mx-auto mt-3 max-w-md text-sm italic leading-relaxed text-slate-600">
            “{card.example}”
          </p>
          <p className="type-meta mt-6 opacity-70">Tap card to hide</p>
        </>
      )}
    </button>
  );
});

export default function VocabPage() {
  const [order, setOrder] = useState(() => vocabWords.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState({});
  const [lastAction, setLastAction] = useState(null); // for optimistic undo
  const { authenticated, stats } = useUser();

  const card = useMemo(() => vocabWords[order[pos]], [order, pos]);
  const knownCount = useMemo(() => Object.values(known).filter(Boolean).length, [known]);
  const progress = ((pos + 1) / order.length) * 100;

  // useCallback keeps <FlashCard /> referentially stable → memo actually works.
  const flip = useCallback(() => setFlipped((f) => !f), []);
  const speak = useCallback(() => {
    try {
      const u = new SpeechSynthesisUtterance(card.word);
      u.lang = "en-GB";
      window.speechSynthesis.speak(u);
    } catch {
      /* speech unavailable */
    }
  }, [card.word]);

  const go = useCallback(
    (d) => {
      setPos((p) => (p + d + order.length) % order.length);
      setFlipped(false);
    },
    [order.length]
  );

  /** Optimistic mark: the card advances instantly and the badge updates in
   *  the same frame — no spinner, no waiting on a request. */
  const mark = useCallback(
    (isKnown) => {
      setKnown((k) => ({ ...k, [card.word]: isKnown }));
      setLastAction({ word: card.word, previous: known[card.word] });
      go(1);
    },
    [card.word, known, go]
  );

  const undo = useCallback(() => {
    if (!lastAction) return;
    setKnown((k) => {
      const next = { ...k };
      if (lastAction.previous === undefined) delete next[lastAction.word];
      else next[lastAction.word] = lastAction.previous;
      return next;
    });
    setLastAction(null);
  }, [lastAction]);

  function shuffle() {
    const arr = [...order];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    setPos(0);
    setFlipped(false);
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/vocab" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Vocabulary" }]} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="type-h1">Vocabulary flashcards</h1>
              <p className="type-lead mt-1">
                Card <span className="type-score">{pos + 1}</span> of {order.length} ·{" "}
                <span className="type-score">{knownCount}</span> marked known
                {authenticated && stats?.totalTests ? "" : ""}
              </p>
            </div>
            <button onClick={shuffle} className="btn-secondary !px-4 !py-2 text-sm">
              <Shuffle size={16} strokeWidth={1.75} /> Shuffle
            </button>
          </div>

          <div className="mt-6">
            <FlashCard card={card} flipped={flipped} onFlip={flip} onSpeak={speak} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button onClick={() => go(-1)} className="btn-secondary !px-4 !py-2 text-sm">
              <ArrowLeft size={16} strokeWidth={1.75} /> Prev
            </button>
            <div className="flex gap-2">
              <button onClick={() => mark(false)} className="btn-secondary !px-4 !py-2 text-sm">
                <RotateCcw size={16} strokeWidth={1.75} /> Still learning
              </button>
              <button onClick={() => mark(true)} className="btn-primary !px-4 !py-2 text-sm">
                Got it ✓
              </button>
            </div>
            <button onClick={() => go(1)} className="btn-secondary !px-4 !py-2 text-sm">
              Next <ArrowRight size={16} strokeWidth={1.75} />
            </button>
          </div>

          {lastAction && (
            <button
              onClick={undo}
              className="pop-in mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              <Undo2 size={14} strokeWidth={1.75} /> Undo “{lastAction.word}”
            </button>
          )}

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F1EAD9]">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Word-jump strip: horizontal scroll on mobile, wraps on desktop. */}
          <div className="scroll-x no-scrollbar mt-4 lg:flex-wrap lg:overflow-visible">
            {order.map((idx, i) => {
              const w = vocabWords[idx];
              const state = known[w.word];
              return (
                <button
                  key={w.word}
                  onClick={() => {
                    setPos(i);
                    setFlipped(false);
                  }}
                  aria-current={i === pos}
                  title={w.word}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    i === pos
                      ? "border-[#D97706] bg-[#F59E0B] text-slate-950"
                      : state === true
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : state === false
                          ? "border-[#EBE3D5] bg-[#FCF9F2] text-slate-500"
                          : "border-[#EBE3D5] bg-white text-slate-600"
                  }`}
                >
                  {w.word}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
