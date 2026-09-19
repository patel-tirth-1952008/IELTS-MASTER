import { prisma } from "@/lib/prisma";

// ── First-party analytics ───────────────────────────────────
// No third-party trackers, no cookies for tracking, no personal data.
// Events are written in ONE batched INSERT (createMany) instead of a
// row-per-request, and never block the response the user is waiting on.

const DEVICE_OF = (ua = "") => {
  if (/bot|crawler|spider|crawling/i.test(ua)) return "bot";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
};

/** Persist a batch of client events. Best-effort: never throws. */
export async function recordEvents({ events = [], userId = null, ip = null }) {
  const rows = events
    .slice(0, 25) // hard cap per request
    .map((e) => ({
      userId: userId ?? null,
      type: ["pageview", "vital", "event"].includes(e.t) ? e.t : "event",
      path: typeof e.path === "string" ? e.path.slice(0, 200) : null,
      name: typeof e.name === "string" ? e.name.slice(0, 60) : null,
      value: Number.isFinite(Number(e.value)) ? Number(e.value) : null,
      referrer: typeof e.ref === "string" ? e.ref.slice(0, 200) : null,
      sessionId: typeof e.sid === "string" ? e.sid.slice(0, 60) : null,
      device: DEVICE_OF(e.ua ?? ""),
      country: null,
    }));

  if (!rows.length) return { inserted: 0 };

  try {
    const { count } = await prisma.analyticsEvent.createMany({ data: rows });
    return { inserted: count };
  } catch (err) {
    // Analytics must never break or slow the product.
    console.error("[analytics] write failed:", err?.message ?? err);
    return { inserted: 0 };
  }
}

/** Aggregate summary for the admin dashboard — 3 grouped queries, no scans. */
export async function analyticsSummary({ days = 7 } = {}) {
  const since = new Date(Date.now() - days * 86400000);

  const [byPath, byDay, byType, vitals, totals] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { type: "pageview", createdAt: { gte: since } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 15,
    }),
    prisma.$queryRaw`
      SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
             count(*)::int AS views,
             count(DISTINCT "sessionId")::int AS visitors
      FROM "AnalyticsEvent"
      WHERE type = 'pageview' AND "createdAt" >= ${since}
      GROUP BY 1 ORDER BY 1`,
    prisma.analyticsEvent.groupBy({
      by: ["name"],
      where: { type: "event", createdAt: { gte: since } },
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
      take: 20,
    }),
    prisma.$queryRaw`
      SELECT name, avg(value)::float AS avg_value, count(*)::int AS samples
      FROM "AnalyticsEvent"
      WHERE type = 'vital' AND "createdAt" >= ${since}
      GROUP BY name ORDER BY name`,
    prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
  ]);

  return { days, since, totals, byPath, byDay, byType, vitals };
}
