"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ListeningTest from "@/components/ListeningTest";
import { getExamById, getExamsByType } from "@/data/sampleExams";

function Runner() {
  const params = useSearchParams();
  const id = params.get("exam") ?? getExamsByType("listening")[0]?.id;
  const exam = getExamById(id);

  if (!exam || exam.type !== "listening") {
    return (
      <div className="warm-card p-8 text-center">
        <p className="type-h3">Exam not found.</p>
        <Link href="/listening" className="btn-primary mt-4">
          Back to listening
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs trail={[{ label: "Listening", href: "/listening" }, { label: exam.title }]} />
      <h1 className="type-h1">{exam.title}</h1>
      <p className="mb-6 mt-1 text-slate-600">{exam.description}</p>
      <ListeningTest exam={exam} />
    </>
  );
}

export default function PracticeListeningPage() {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap max-w-4xl py-10">
        <Suspense fallback={<div className="skeleton h-96 rounded-2xl" />}>
          <Runner />
        </Suspense>
      </main>
    </div>
  );
}