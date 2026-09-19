"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BookOpen, PenLine, Headphones, Mic, ArrowRight, ClipboardList } from "lucide-react";

const STEPS = [
  { type: "Listening", icon: Headphones, href: "/practice/listening?exam=listening-test-1", min: 20, note: "Demo transcript format" },
  { type: "Reading", icon: BookOpen, href: "/practice/reading?exam=reading-academic-1", min: 60, note: "2 passages · 6 questions (demo)" },
  { type: "Writing", icon: PenLine, href: "/practice/writing?exam=writing-task-2-1", min: 40, note: "Task 2 opinion essay · AI marked" },
  { type: "Speaking", icon: Mic, href: "/practice/speaking?exam=speaking-part-1-1", min: 12, note: "Part 1 · record or type" },
];

export default function MockTestPage() {
  const [done, setDone] = useState({});

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/mock-test" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Mock Test" }]} />
          <h1 className="type-h1">Mini mock test</h1>
          <p className="mt-1 text-slate-600">
            All four modules in exam order. Tick each one off as you finish — your dashboard radar
            updates automatically when signed in.
          </p>

          <div className="mt-6 space-y-3">
            {STEPS.map((s, i) => (
              <div key={s.type} className="warm-card relative flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7]">
                  <s.icon size={22} strokeWidth={1.75} className="text-[#B45309]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-slate-900">
                    {i + 1}. {s.type} <span className="badge-blue ml-1">~{s.min} min</span>
                  </p>
                  <p className="text-sm text-slate-600">{s.note}</p>
                </div>
                <label className="z-20 flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!done[s.type]}
                    onChange={() => setDone((d) => ({ ...d, [s.type]: !d[s.type] }))}
                    className="h-4 w-4 accent-[#D97706]"
                  />
                  Done
                </label>
                <Link href={s.href} className="absolute inset-0 z-10 rounded-2xl" aria-label={`Start ${s.type}`} />
              </div>
            ))}
          </div>

          <div className="warm-card mt-4 flex items-center gap-3 p-5">
            <ClipboardList size={22} strokeWidth={1.75} className="shrink-0 text-[#0284C7]" />
            <p className="text-sm text-slate-600">
              Progress: <span className="font-bold text-slate-900">{Object.values(done).filter(Boolean).length}/4</span>{" "}
              modules complete.{" "}
              <Link href="/dashboard" className="inline-flex items-center gap-1 font-bold text-[#B45309] hover:underline">
                View dashboard <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
