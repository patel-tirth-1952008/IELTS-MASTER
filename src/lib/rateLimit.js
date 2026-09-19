// ── Tiered rate limiter ──────────────────────────────────────
// In-memory sliding window by default; automatically upgrades to
// Redis (Upstash REST) when UPSTASH_REDIS_REST_URL + _TOKEN are set,
// which is what you want on serverless where every lambda instance
// has its own memory.
//
// Why both: memory keeps local/dev and single-instance hosting safe,
// Redis makes the limit global (real protection behind a CDN/proxy).

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const memory = new Map(); // key -> { count, resetAt }
let lastPrune = Date.now();

function pruneMemory() {
  const now = Date.now();
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [key, rec] of memory) {
    if (rec.resetAt <= now) memory.delete(key);
  }
}

async function redisIncr(key, windowMs) {
  const body = [
    ["INCR", key],
    ["PEXPIRE", key, windowMs, "NX"],
  ];
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`ratelimit redis ${res.status}`);
  const json = await res.json();
  const count = Number(json?.[0]?.result ?? 0);
  return Number.isFinite(count) ? count : 0;
}

function memoryIncr(key, windowMs) {
  pruneMemory();
  const now = Date.now();
  const rec = memory.get(key);
  if (!rec || rec.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }
  rec.count += 1;
  return rec.count;
}

/**
 * Consume one token for `key`.
 * @returns {Promise<{limited:boolean, remaining:number, retryAfter:number}>}
 */
export async function rateLimit({ key, limit, windowMs, cost = 1 }) {
  if (!key) return { limited: false, remaining: limit, retryAfter: 0 };
  const bucketKey = `rl:${key}:${windowMs}`;
  try {
    const count = useRedis
      ? await redisIncr(bucketKey, windowMs)
      : memoryIncr(bucketKey, windowMs);
    const remaining = Math.max(0, limit - count);
    return {
      limited: count > limit,
      remaining,
      retryAfter: count > limit ? Math.ceil(windowMs / 1000) : 0,
      cost,
    };
  } catch {
    // Never let the limiter itself take the site down — fail open.
    return { limited: false, remaining: limit, retryAfter: 0 };
  }
}

/** Reset a bucket (e.g. after a successful login). */
export async function resetLimit(key, windowMs) {
  const bucketKey = `rl:${key}:${windowMs}`;
  memory.delete(bucketKey);
  if (useRedis) {
    try {
      await fetch(`${UPSTASH_URL}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([["DEL", bucketKey]]),
        cache: "no-store",
      });
    } catch {
      /* best effort */
    }
  }
}

/** Best-effort client IP behind Vercel / Cloudflare / proxies. */
export function getClientIp(req) {
  const h = req?.headers;
  if (!h) return "unknown";
  return (
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export const RATE_TIERS = {
  // Credential endpoints — tight, brute-force hostile.
  login: { limit: 5, windowMs: 60_000 },
  register: { limit: 3, windowMs: 60_000 },
  "forgot-password": { limit: 3, windowMs: 15 * 60_000 },
  "reset-password": { limit: 5, windowMs: 15 * 60_000 },
  "verify-email": { limit: 6, windowMs: 15 * 60_000 },
  "2fa": { limit: 6, windowMs: 15 * 60_000 },
  "change-password": { limit: 5, windowMs: 15 * 60_000 },
  contact: { limit: 3, windowMs: 15 * 60_000 },
  // Expensive AI endpoints — protect the Groq quota.
  "grammar-check": { limit: 20, windowMs: 60_000 },
  "score-writing": { limit: 15, windowMs: 60_000 },
  "score-speaking": { limit: 15, windowMs: 60_000 },
  "score-reading": { limit: 40, windowMs: 60_000 },
  "score-listening": { limit: 40, windowMs: 60_000 },
  // Product reads.
  "auth-me": { limit: 120, windowMs: 60_000 },
  stats: { limit: 120, windowMs: 60_000 },
  exams: { limit: 120, windowMs: 60_000 },
  analytics: { limit: 120, windowMs: 60_000 },
  global: { limit: 100, windowMs: 60_000 },
};
