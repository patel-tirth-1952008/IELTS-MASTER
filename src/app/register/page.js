"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PasswordMeter, { scorePassword } from "@/components/PasswordMeter";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import {
  GraduationCap, Loader2, MailCheck, CheckCircle2, ArrowRight, Sparkles,
} from "lucide-react";

const BANDS = ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5"];

const CTA_POINTS = [
  "Instant AI band score on every essay",
  "All four skills, 20+ practice tests, free",
  "Progress charts + study streak from day one",
];

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, refresh } = useUser();
  const [mode, setMode] = useState("register"); // register | verify
  const [form, setForm] = useState({ name: "", email: "", password: "", targetBand: "7.5", code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    const strength = scorePassword(form.password, { email: form.email, name: form.name });
    if (!strength.ok) {
      setError("Please choose a stronger password — check the list under the password field.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiPost("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        targetBand: Number(form.targetBand),
      });
      setMode("verify");
      setInfo(data.message ?? "We emailed you a 6-digit code.");
    } catch (err) {
      // Covers weak-password rejections from the server too.
      setError(
        err.data?.problems?.length ? err.data.problems.join(" ") : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiPost("/api/auth/verify-email", {
        email: form.email,
        code: form.code,
      });
      setUser(data.user);
      refresh();
      router.push("/thank-you?flow=verified");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError("");
    try {
      await apiPost("/api/auth/resend-verification", { email: form.email });
      setInfo("Sent — check your inbox (and your spam folder).");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex flex-col py-10 lg:py-14">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_minmax(0,430px)] lg:items-start">
          {/* ── CTA above the fields ── */}
          <section className="order-2 lg:order-1 lg:pt-4">
            <span className="badge-yellow">
              <Sparkles size={14} strokeWidth={1.75} /> Free forever · no card
            </span>
            <h2 className="type-h1 mt-4">
              Create your account and get your first band score in 20 minutes
            </h2>
            <p className="type-lead mt-3 max-w-xl">
              Join learners who practise with an AI examiner on their side. Everything is
              free: reading, writing, listening, speaking, vocabulary and grammar.
            </p>
            <ul className="mt-5 space-y-2">
              {CTA_POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="shrink-0 text-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/mock-test" className="btn-secondary">
                See a mock test <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
              <Link href="/about" className="btn-ghost">
                Why is it free?
              </Link>
            </div>
          </section>

          {/* ── Form column ── */}
          <section className="order-1 w-full lg:order-2">
            <div className="warm-card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F59E0B]">
                  {mode === "register" ? (
                    <GraduationCap size={22} strokeWidth={1.75} className="text-slate-950" />
                  ) : (
                    <MailCheck size={22} strokeWidth={1.75} className="text-slate-950" />
                  )}
                </span>
                <div>
                  <h1 className="type-h2 leading-tight">
                    {mode === "register" ? "Create your free account" : "Check your inbox"}
                  </h1>
                  <p className="type-meta">
                    {mode === "register"
                      ? "Two minutes now, better bands later."
                      : `We emailed a 6-digit code to ${form.email || "your address"}.`}
                  </p>
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
              {info && (
                <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {info}
                </p>
              )}

              {mode === "register" ? (
                <form onSubmit={handleRegister} className="mt-5 space-y-4">
                  <div>
                    <label className="warm-label" htmlFor="name">Full name</label>
                    <input
                      id="name"
                      className="warm-input"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="warm-label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="warm-input"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <p className="type-meta mt-1">
                      We send a 6-digit code here — that&apos;s how we keep fake accounts out.
                    </p>
                  </div>
                  <div>
                    <label className="warm-label" htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="warm-input"
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <PasswordMeter password={form.password} email={form.email} name={form.name} />
                  </div>
                  <div>
                    <label className="warm-label" htmlFor="targetBand">Target band</label>
                    <select
                      id="targetBand"
                      className="warm-input"
                      value={form.targetBand}
                      onChange={(e) => setForm({ ...form, targetBand: e.target.value })}
                    >
                      {BANDS.map((b) => (
                        <option key={b} value={b}>Band {b}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? "Creating…" : "Create free account"}
                  </button>
                  <p className="type-meta text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-[#B45309] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="mt-5 space-y-4">
                  <div>
                    <label className="warm-label" htmlFor="code">6-digit code</label>
                    <input
                      id="code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      className="warm-input text-center text-xl tracking-[0.3em]"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? "Verifying…" : "Verify & continue"}
                  </button>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={resend}
                      className="font-semibold text-slate-500 hover:text-slate-900"
                    >
                      Resend code
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-semibold text-slate-500 hover:text-slate-900"
                    >
                      Change email
                    </button>
                  </div>
                  <p className="type-meta">
                    No email yet? In local development the code is printed in the server
                    console — set RESEND_API_KEY to start sending real mail.
                  </p>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
