"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCF9F2] px-4">
      <div className="warm-card max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <TriangleAlert size={28} strokeWidth={1.75} className="text-red-500" />
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
