"use client";

import { useEffect, useState } from "react";
import { Timer as TimerIcon } from "lucide-react";

export default function Timer({ seconds, onExpire }) {
  const [left, setLeft] = useState(seconds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!mounted || left <= 0) return;
    const id = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(id);
          onExpire?.();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mounted, onExpire, left <= 0]);

  if (!mounted) {
    return <div className="skeleton h-10 w-28 rounded-xl" />;
  }

  const m = Math.floor(left / 60);
  const s = left % 60;
  const urgent = left < 300;
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-lg font-bold ${
        urgent ? "border-red-200 bg-red-50 text-red-600" : "border-[#EBE3D5] bg-white text-slate-800"
      }`}
      role="timer"
    >
      <TimerIcon size={18} strokeWidth={1.75} />
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </div>
  );
}
