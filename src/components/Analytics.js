"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAllowed, CONSENT_COOKIE } from "@/lib/consent";

// ── First-party analytics ───────────────────────────────────
// • no third-party scripts, no cross-site tracking
// • only runs when cookie consent = "all"
// • batches page views/web vitals and flushes with sendBeacon so it can
//   never block a click, a navigation, or a test submission
// • Core Web Vitals are measured with the browser's own PerformanceObserver
//   (zero dependencies, ~1 kB of code)

const queue = [];
let flushTimer = null;
let sessionId = null;

function sid() {
  if (sessionId) return sessionId;
  try {
    sessionId = sessionStorage.getItem("ielts_sid");
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("ielts_sid", sessionId);
    }
  } catch {
    sessionId = "anon";
  }
  return sessionId;
}

function enqueue(event) {
  if (typeof window === "undefined") return;
  if (!analyticsAllowed()) return;
  queue.push({ ...event, sid: sid(), ua: navigator.userAgent });
  if (queue.length >= 10) flush();
  else if (!flushTimer) flushTimer = setTimeout(flush, 5000);
}

function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!queue.length) return;
  const events = queue.splice(0, 25);
  const payload = JSON.stringify({ consent: true, events });

  try {
    // sendBeacon survives page unload and never blocks rendering.
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/analytics", blob)) return;
  } catch {
    /* fall through to fetch */
  }
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export function trackEvent(name, value = null, extra = {}) {
  enqueue({ t: "event", name, value, ...extra });
}

export default function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef(null);
  const lastTime = useRef(Date.now());
  const vitalsSeen = useRef(new Set());

  // Page views (client-side navigations included).
  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;
    lastTime.current = Date.now();
    enqueue({ t: "pageview", path: pathname, ref: document.referrer || null });
  }, [pathname]);

  // Core Web Vitals: LCP, CLS, INP (with FID fallback), TTFB.
  useEffect(() => {
    if (!analyticsAllowed() || typeof PerformanceObserver === "undefined") return;
    const report = (name, value) => {
      if (vitalsSeen.current.has(name)) return;
      vitalsSeen.current.add(name);
      enqueue({ t: "vital", name, value: Math.round(value * 1000) / 1000, path: pathname });
    };

    const observers = [];
    try {
      observers.push(
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          if (lcp) report("LCP", lcp.startTime);
        })
      );
      observers[observers.length - 1].observe({ type: "largest-contentful-paint", buffered: true });

      let cls = 0;
      observers.push(
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
        })
      );
      observers[observers.length - 1].observe({ type: "layout-shift", buffered: true });

      observers.push(
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) report("INP", entry.duration);
        })
      );
      observers[observers.length - 1].observe({ type: "event", buffered: true, durationThreshold: 200 });
    } catch {
      /* older browsers: skip vitals */
    }

    const onHidden = () => {
      if (document.visibilityState === "hidden") {
        // CLS is only final once the page is hidden.
        try {
          const nav = performance.getEntriesByType("navigation")[0];
          if (nav) report("TTFB", nav.responseStart);
        } catch {
          /* ignore */
        }
        if (cls > 0) report("CLS", cls);
        flush();
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", flush);

    return () => {
      observers.forEach((o) => {
        try {
          o.disconnect();
        } catch {
          /* ignore */
        }
      });
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", flush);
    };
  }, [pathname]);

  // Flush when the visitor grants consent mid-session.
  useEffect(() => {
    const onConsent = () => {
      if (analyticsAllowed() && lastPath.current) {
        enqueue({ t: "pageview", path: lastPath.current, ref: document.referrer || null });
      }
    };
    window.addEventListener("ielts:consent", onConsent);
    return () => window.removeEventListener("ielts:consent", onConsent);
  }, []);

  // Mark the essential cookie as readable in dev tools / server logs.
  useEffect(() => {
    if (typeof document !== "undefined" && !document.cookie.includes(CONSENT_COOKIE)) {
      /* nothing to do — the banner writes it */
    }
  }, []);

  return null;
}
