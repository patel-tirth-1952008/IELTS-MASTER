"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReadingTest from "@/components/ReadingTest";
import { getExamById, getExamsByType } from "@/data/sampleExams";

function Runner() {
  const params = useSearchParams();
  const id = params.get("exam") ?? getExamsByType("reading")[0]?.id;
  const exam = getExamById(id);

  if (!exam || exam.type !== "reading") {
    return (
      <div className="warm-card p-8 text-center">
        <p className="type-h3">Exam not found.</p>
        <Link href="/reading" className="btn-primary mt-4">
          Back to reading
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs trail={[{ label: "Reading", href: "/reading" }, { label: exam.title }]} />
      <h1 className="type-h1">{exam.title}</h1>
      <p className="mb-6 mt-1 text-slate-600">{exam.description}</p>
      <ReadingTest exam={exam} />
    </>
  );
}

export default function PracticeReadingPage() {
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
