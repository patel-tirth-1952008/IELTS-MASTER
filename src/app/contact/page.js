"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { apiPost } from "@/lib/client/api";
import { Mail, Send, Loader2, CheckCircle2, MessageSquare, Bug, Sparkles } from "lucide-react";

const CTA_POINTS = [
  "Answers within a couple of days — a human writes back",
  "Bug reports get fixed fast, with credit if you want it",
  "Feature requests shape what we build next",
];

const TOPICS = [
  { icon: MessageSquare, title: "General question", body: "Something unclear about a test, a score or your account." },
  { icon: Bug, title: "Report a bug", body: "Tell us the page and what you expected to happen instead." },
  { icon: Sparkles, title: "Feature request", body: "A question type, a study tool, a language you wish we had." },
];

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await apiPost("/api/contact", form);
      router.push("/thank-you?flow=contact");
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap max-w-5xl py-10">
        <Breadcrumbs trail={[{ label: "Contact" }]} />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_minmax(0,430px)] lg:items-start">
          {/* ── CTA above the fields ── */}
          <section>
            <h1 className="type-h1">Say hello 👋</h1>
            <p className="type-lead mt-3 max-w-xl">
              Questions, bug reports, or a band-9 success story — we read everything and
              reply within a couple of days.
            </p>
            <ul className="mt-5 space-y-2">
              {CTA_POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="shrink-0 text-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {TOPICS.map((t) => (
                <div key={t.title} className="warm-card p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF3C7]">
                    <t.icon size={17} strokeWidth={1.75} className="text-[#B45309]" />
                  </span>
                  <h2 className="type-h3 mt-3">{t.title}</h2>
                  <p className="type-body mt-1">{t.body}</p>
                </div>
              ))}
            </div>

            <p className="type-meta mt-6">
              Prefer email?{" "}
              <a
                href="mailto:hello@ieltsmaster.app"
                className="font-semibold text-[#B45309] underline"
              >
                hello@ieltsmaster.app
              </a>{" "}
              · Looking for quick answers?{" "}
              <Link href="/#faq" className="font-semibold text-[#B45309] underline">
                Read the FAQ
              </Link>
              .
            </p>
          </section>

          {/* ── Form ── */}
          <section className="warm-card p-6 sm:p-7">
            <h2 className="type-h2">Send a message</h2>
            <p className="type-meta mt-1">All fields required — it takes 30 seconds.</p>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={submit} className="mt-5 space-y-4">
              {/* Honeypot: hidden from humans, tempting for bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="hidden"
                aria-hidden="true"
              />
              <div>
                <label className="warm-label" htmlFor="name">Your name</label>
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
              </div>
              <div>
                <label className="warm-label" htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  className="warm-input"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="">Choose a topic…</option>
                  <option value="General question">General question</option>
                  <option value="Bug report">Bug report</option>
                  <option value="Feature request">Feature request</option>
                  <option value="Feedback on AI scores">Feedback on AI scores</option>
                  <option value="Something else">Something else</option>
                </select>
              </div>
              <div>
                <label className="warm-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  className="warm-input min-h-[140px]"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  minLength={10}
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full">
                {sending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={1.75} />
                )}
                {sending ? "Sending…" : "Send message"}
              </button>
              <p className="type-meta flex items-center justify-center gap-1.5 text-center">
                <Mail size={14} strokeWidth={1.75} />
                We only use your email to reply. No newsletters, no sharing.
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
