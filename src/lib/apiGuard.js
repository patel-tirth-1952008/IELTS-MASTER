import { NextResponse } from "next/server";
import { getCurrentUser, getSessionUser } from "@/lib/auth";
import { rateLimit, getClientIp, RATE_TIERS } from "@/lib/rateLimit";

// ── API guard ───────────────────────────────────────────────
// One wrapper that every route goes through, giving:
//   1. rate limiting (tiered per endpoint, Redis-capable)
//   2. CSRF origination checks on mutations
//   3. server-side session / role enforcement  ← authorisation never
//      runs in the browser, where a user could just edit it
//   4. request-body size caps
//   5. try/catch → always JSON, never an HTML error page
//   6. sane cache headers (private by default)

const MUTATIONS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const MAX_BODY_BYTES = 512 * 1024; // 512 KB — writing answers are small

/** Distinguish "database is asleep/unreachable" from a real bug. */
function isDatabaseDown(err) {
  const code = err?.code ?? err?.errorCode;
  if (["P1001", "P1002", "P1017", "P2024"].includes(code)) return true;
  if (err?.name === "PrismaClientInitializationError") return true;
  return /can't reach database server|connection refused|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|timed out fetching a new connection|server has closed the connection/i.test(
    String(err?.message ?? "")
  );
}

function hostOf(req) {
  return req.headers.get("host") ?? "";
}

/** Same-site check for state-changing requests (CSRF layer 1). */
function originAllowed(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser / server-to-server: nothing to forge

  try {
    const url = new URL(origin);
    const host = hostOf(req);
    if (host && url.host === host) return true;

    const extra = (process.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (extra.includes(url.origin)) return true;

    // Workspace / preview proxies and local development.
    if (/\.e2b\.app$/.test(url.hostname)) return true;
    if (/\.vercel\.app$/.test(url.hostname)) return true;
    if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname)) return true;

    return false;
  } catch {
    return false;
  }
}

/** Double-submit CSRF token (layer 2) for session-bearing mutations. */
function csrfValid(req, session) {
  if (!session?.csrf) return true; // token minted before CSRF shipping
  const header = req.headers.get("x-csrf-token");
  return Boolean(header) && header === session.csrf;
}

export function jsonError(message, status = 400, extraHeaders = {}, extra = {}) {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    { status, headers: { "Cache-Control": "no-store", ...extraHeaders } }
  );
}

export function jsonOk(data = {}, status = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

/** Public, cacheable JSON (used by the exam catalogue). */
export function jsonCached(data = {}, { sMaxAge = 300, swr = 3600 } = {}) {
  return NextResponse.json(
    { success: true, ...data },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`,
      },
    }
  );
}

/**
 * Wrap a route handler.
 * @param {(req: Request, ctx: any) => Promise<Response>} handler
 * @param {string|{name?:string, limit?:number, windowMs?:number,
 *                 requireAuth?:boolean, requireAdmin?:boolean,
 *                 requireVerified?:boolean, csrf?:boolean,
 *                 cache?:null|{sMaxAge:number, swr:number},
 *                 rateLimitBy?:'ip'|'user'|'ip+email'}} options
 */
export function withApiGuard(handler, options = {}) {
  const opts = typeof options === "string" ? { name: options } : options;
  const name = opts.name ?? "global";
  const tier = RATE_TIERS[name] ?? RATE_TIERS.global;
  const limit = opts.limit ?? tier.limit;
  const windowMs = opts.windowMs ?? tier.windowMs;

  return async function guarded(req, ctx) {
    const started = Date.now();
    const requestId = Math.random().toString(36).slice(2, 10);

    try {
      // 1. CSRF origin gate for state-changing verbs.
      if (MUTATIONS.has(req.method) && !originAllowed(req)) {
        return jsonError("Request blocked: cross-site request rejected.", 403);
      }

      // 2. Body size cap (protects the AI + DB pathways).
      if (MUTATIONS.has(req.method)) {
        const declared = Number(req.headers.get("content-length") ?? 0);
        if (declared > MAX_BODY_BYTES) {
          return jsonError("Request payload too large.", 413);
        }
      }

      // 3. Rate limit — per IP, optionally tightened per user.
      let session = null;
      if (opts.requireAuth || opts.requireAdmin || opts.csrf) {
        session = getCurrentUser();
      }

      const ip = getClientIp(req);
      const scope = opts.rateLimitBy === "user" && session?.userId ? session.userId : ip;
      const { limited, remaining, retryAfter } = await rateLimit({
        key: `${name}:${scope}`,
        limit,
        windowMs,
      });
      if (limited) {
        return jsonError("Too many requests. Please slow down and try again shortly.", 429, {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        });
      }

      // 4. Authorisation — checked here, on the server, for every route.
      let user = null;
      if (opts.requireAuth || opts.requireAdmin || opts.requireVerified) {
        if (!session?.userId) {
          return jsonError("You need to sign in to do that.", 401);
        }
        // Durable check: token version, verified email, not locked.
        user = await getSessionUser({
          requireVerified: Boolean(opts.requireVerified || opts.requireAdmin),
        });
        if (!user) {
          return jsonError("Your session has expired. Please sign in again.", 401);
        }
        if (opts.csrf && !csrfValid(req, session)) {
          return jsonError("Session check failed. Please reload the page.", 403);
        }
        if (opts.requireAdmin && user.role !== "admin") {
          // Log the attempt — a user probing admin routes is a signal.
          console.warn(`[api:${name}] forbidden admin access by ${user.email} (${ip})`);
          return jsonError("Not authorised.", 403);
        }
      }

      // 5. Run the handler with the resolved user attached.
      const res = await handler(req, { ...(ctx ?? {}), user, requestId, ip });

      const headers = new Headers(res.headers);
      headers.set("X-RateLimit-Limit", String(limit));
      headers.set("X-RateLimit-Remaining", String(remaining));
      headers.set("X-Request-Id", requestId);
      if (opts.cache && req.method === "GET") {
        headers.set(
          "Cache-Control",
          `public, s-maxage=${opts.cache.sMaxAge}, stale-while-revalidate=${opts.cache.swr}`
        );
      } else if (!headers.has("Cache-Control")) {
        headers.set("Cache-Control", "no-store, must-revalidate");
      }
      if (process.env.NODE_ENV !== "production") {
        headers.set("Server-Timing", `app;dur=${Date.now() - started}`);
      }
      return new NextResponse(res.body, { status: res.status, headers });
    } catch (err) {
      console.error(`[api:${name}] ${requestId}`, err?.message ?? err);
      if (isDatabaseDown(err)) {
        // Neon's free tier suspends when idle; the first request wakes it.
        return jsonError("The database is waking up (cold start). Try again in a few seconds.", 503, {
          "Retry-After": "3",
        });
      }
      return jsonError("Something went wrong. Please try again.", 500);
    }
  };
}

/**
 * Row-level security helper: scope a Prisma `where` clause to the
 * signed-in user so an endpoint can never read another tenant's rows.
 */
export function scopeToUser(userId, where = {}) {
  if (!userId) throw new Error("scopeToUser requires a userId");
  return { ...where, userId };
}
