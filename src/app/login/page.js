"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PasswordMeter, { scorePassword } from "@/components/PasswordMeter";
import { useUser } from "@/components/UserProvider";
import { apiPost } from "@/lib/client/api";
import {
  GraduationCap, Loader2, KeyRound, ArrowLeft, ShieldCheck,
  CheckCircle2, Sparkles, Smartphone,
} from "lucide-react";

const CTA_POINTS = [
  "AI band scores the moment you finish a test",
  "Progress charts, streaks and a study plan",
  "Free forever — no card, no trial",
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser, refresh } = useUser();
  const [mode, setMode] = useState("login"); // login | forgot | reset | verify | 2fa
  const [form, setForm] = useState({ email: "", password: "", code: "", newPassword: "" });
  const [challengeId, setChallengeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Land directly on the right step when another page hands off a code
  // (e.g. /login?mode=verify&email=…), without a full reload.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    const email = params.get("email");
    if (email) setForm((f) => ({ ...f, email }));
    if (m === "verify" || m === "2fa" || m === "forgot" || m === "reset") setMode(m);
  }, []);

  function go(next, nextInfo = "", nextError = "") {
    setMode(next);
    setInfo(nextInfo);
    setError(nextError);
  }

  /** Shared post-auth flow: update the session context, then navigate.
   *  No router.refresh() → no server round-trip, no blank flash. */
  async function finishSession(user, message) {
    setUser(user);
    refresh(); // background: refresh stats for the dashboard
    setInfo(message);
    router.push("/dashboard");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiPost("/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      if (data.requires2FA) {
        setChallengeId(data.challengeId);
        return go("2fa", data.message ?? "Enter the code we emailed you.");
      }
      await finishSession(data.user, "Signed in — taking you to your dashboard…");
    } catch (err) {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        setForm((f) => ({ ...f, email: err.data?.email ?? f.email }));
        return go("verify", "We emailed you a fresh 6-digit code. Enter it below to activate your account.", "");
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handle2fa(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiPost("/api/auth/2fa", { challengeId, code: form.code });
      await finishSession(data.user, "Verified — welcome back.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiPost("/api/auth/verify-email", { email: form.email, code: form.code });
      await finishSession(data.user, "Email verified — you're in.");
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
      setInfo("If that account needs verifying, a new code is on its way.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await apiPost("/api/auth/forgot-password", { email: form.email });
      go("reset", "If an account exists, a 6-digit code was sent. Enter it below with a new password.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!scorePassword(form.newPassword, { email: form.email }).ok) {
      setError("Please choose a stronger password — see the checklist below the field.");
      setLoading(false);
      return;
    }
    try {
      const data = await apiPost("/api/auth/reset-password", {
        email: form.email,
        code: form.code,
        password: form.newPassword,
      });
      setForm((f) => ({ ...f, code: "", newPassword: "" }));
      go("login", data.message ?? "Password updated. Sign in with your new password.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const headings = {
    login: "Welcome back",
    forgot: "Forgot password",
    reset: "Choose a new password",
    verify: "Verify your email",
    "2fa": "Two-factor sign-in",
  };

  const icons = { login: GraduationCap, forgot: KeyRound, reset: KeyRound, verify: ShieldCheck, "2fa": Smartphone };
  const Icon = icons[mode];

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex flex-col py-10 lg:py-14">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_minmax(0,420px)] lg:items-start">
          {/* ── CTA block: sits ABOVE the form fields so the value and the
                 primary action are visible before any input. ── */}
          <section className="order-2 lg:order-1 lg:pt-4">
            <span className="badge-yellow">
              <Sparkles size={14} strokeWidth={1.75} /> Free AI-powered IELTS prep
            </span>
            <h2 className="type-h1 mt-4">
              Your band score improves fastest when you practise and get feedback the same day
            </h2>
            <p className="type-lead mt-3 max-w-xl">
              Sign in to pick up your streak, revisit your weakest question types and let the
              AI examiner mark your next essay.
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
              <Link href="/register" className="btn-primary">
                Create a free account
              </Link>
              <Link href="/practice/reading" className="btn-secondary">
                Try a test as a guest
              </Link>
            </div>
          </section>

          {/* ── Form column ── */}
          <section className="order-1 w-full lg:order-2">
            <div className="warm-card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F59E0B]">
                  <Icon size={22} strokeWidth={1.75} className="text-slate-950" />
                </span>
                <div>
                  <h1 className="type-h2 leading-tight">{headings[mode]}</h1>
                  <p className="type-meta">
                    {mode === "login" && "Sign in with your email and password."}
                    {mode === "forgot" && "We'll email you a 6-digit reset code."}
                    {mode === "reset" && "Enter the code and your new password."}
                    {mode === "verify" && "6-digit code sent to your inbox."}
                    {mode === "2fa" && "Two-factor protection is on for this account."}
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

              {mode === "login" && (
                <form onSubmit={handleLogin} className="mt-5 space-y-4">
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
                  </div>
                  <div>
                    <label className="warm-label" htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="warm-input"
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? "Signing in…" : "Sign in"}
                  </button>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => go("forgot")}
                      className="font-semibold text-slate-500 hover:text-slate-900"
                    >
                      Forgot password?
                    </button>
                    <Link href="/register" className="font-bold text-[#B45309] hover:underline">
                      Create free account
                    </Link>
                  </div>
                </form>
              )}

              {mode === "2fa" && (
                <form onSubmit={handle2fa} className="mt-5 space-y-4">
                  <div>
                    <label className="warm-label" htmlFor="code2fa">Sign-in code</label>
                    <input
                      id="code2fa"
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
                    {loading ? "Checking…" : "Verify & sign in"}
                  </button>
                  <button type="button" onClick={() => go("login")} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-900">
                    Use a different account
                  </button>
                </form>
              )}

              {mode === "verify" && (
                <form onSubmit={handleVerify} className="mt-5 space-y-4">
                  <div>
                    <label className="warm-label" htmlFor="v-email">Email</label>
                    <input
                      id="v-email"
                      type="email"
                      className="warm-input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="warm-label" htmlFor="v-code">6-digit code</label>
                    <input
                      id="v-code"
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
                    {loading ? "Verifying…" : "Verify & sign in"}
                  </button>
                  <button type="button" onClick={resend} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-900">
                    Send a new code
                  </button>
                </form>
              )}

              {mode === "forgot" && (
                <form onSubmit={handleForgot} className="mt-5 space-y-4">
                  <div>
                    <label className="warm-label" htmlFor="f-email">Account email</label>
                    <input
                      id="f-email"
                      type="email"
                      autoComplete="email"
                      className="warm-input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? "Sending…" : "Send reset code"}
                  </button>
                </form>
              )}

              {mode === "reset" && (
                <form onSubmit={handleReset} className="mt-5 space-y-4">
                  <div>
                    <label className="warm-label" htmlFor="r-email">Account email</label>
                    <input
                      id="r-email"
                      type="email"
                      className="warm-input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="warm-label" htmlFor="r-code">6-digit code</label>
                    <input
                      id="r-code"
                      inputMode="numeric"
                      maxLength={6}
                      className="warm-input tracking-[0.3em]"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="warm-label" htmlFor="newPassword">New password</label>
                    <input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      className="warm-input"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      required
                    />
                    <PasswordMeter password={form.newPassword} email={form.email} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? "Resetting…" : "Reset password"}
                  </button>
                  <p className="type-meta">
                    Resetting signs out every device and revokes old session cookies.
                  </p>
                </form>
              )}

              {mode !== "login" && (
                <button
                  type="button"
                  onClick={() => go("login")}
                  className="mt-4 flex items-center gap-1 text-sm font-bold text-[#B45309] hover:underline"
                >
                  <ArrowLeft size={14} strokeWidth={1.75} /> Back to sign in
                </button>
              )}
            </div>

            <p className="type-meta mt-4 text-center">
              Protected by rate limiting, account lockout and 2FA —{" "}
              <Link href="/privacy" className="font-semibold text-[#B45309] underline">
                how we handle your data
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
