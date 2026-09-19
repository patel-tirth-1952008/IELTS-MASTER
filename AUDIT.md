# IELTS Master — Speed, Security & SEO Audit

**Date:** 19 September 2026 · **Scope:** all 4 lists you supplied · **Result:** build passes, 44 routes, every item verified with a live test.

Legend: ✅ already in place (verified, not assumed) · 🔧 implemented in this pass · ⚠️ partly in place, improved · ➖ not applicable.

---

## List 1 — Site quality & discoverability

| # | Item | Status | What was found / what changed |
|---|------|--------|-------------------------------|
| 1 | Internal links | ✅ + 🔧 | Module cards were linked, but there was **no site-wide footer**. Added a 3-column footer (Practise / Improve / IELTS Master) rendered on every page, plus "next step" link blocks on About, Thank-you and 404. Sitemap now exposes 18 crawlable URLs. |
| 2 | Custom 404 page | ✅ + 🔧 | `/not-found.js` existed; upgraded it to a designed page — 404 eyebrow, "We couldn't find that page", 4 skill cards, links to home/dashboard/contact, `noindex`. |
| 3 | Breadcrumbs | ✅ + 🔧 | Component existed on most pages. Now on every page that needs it, plus horizontal-scroll behaviour so a long trail never breaks mobile layout. |
| 4 | CTA above the fields | 🔧 | **Not present.** Forms had fields first, CTA buried below. Login, register and contact now open with a headline + value bullets + primary CTA *above* the input fields (two-column on desktop, form first on mobile). |
| 5 | Thank-you page | 🔧 | **Did not exist.** Added `/thank-you` (noindex) and wired it as the post-action destination for contact submissions and email verification. |
| 6 | Unique page titles | ⚠️ → ✅ | Only 5 of 21 pages had titles. Now every page has a unique title + description + canonical, including client-rendered routes (segment `layout.js` files: login, register, dashboard, vocab, grammar, mock-test, leaderboard, contact, 4× practice). Root layout applies the `%s · IELTS Master` template. |
| 7 | Proper navigation bar | ⚠️ → ✅ | Navbar rebuilt: shared session context (no per-page refetch), child-route highlighting (`/practice/reading` highlights "Reading"), mobile module row that scrolls horizontally, hamburger only for extras, Escape-to-close, `aria-expanded`/`aria-controls`, optimistic sign-out. |
| 8 | Site analytics | 🔧 | **None existed.** Added first-party analytics: `/api/analytics` ingestion route + `Analytics.js` client that batches page views + Core Web Vitals (LCP, CLS, INP, TTFB) via `sendBeacon`, `lib/analytics.js` with batched `createMany` writes, and an admin-only summary endpoint (`/api/admin/analytics`, requires DB role `admin`). No third-party trackers. |
| 9 | RLS on all endpoints | ⚠️ → ✅ | **No admin check, no ownership scoping, no RLS.** Added: `requireAuth` / `requireAdmin` / `requireVerified` enforced server-side inside every guard; `scopeToUser()` on all user data; strict session validation (token version, verified email, lockout) on protected routes; optional **true PostgreSQL RLS** (`prisma/rls.sql` + `src/lib/rls.js` `withUserContext()`) that makes isolation a database guarantee, not just app code. |
| 10 | SEO optimization | ⚠️ → ✅ | Added `metadataBase`, per-page canonicals, Open Graph + Twitter cards with a generated 1200×630 `og.jpg` (52 KB), `robots.txt` route, dynamic `sitemap.xml` (18 URLs incl. per-exam deep links), JSON-LD `EducationalOrganization` + `WebSite` + `Course` + `FAQPage`, real FAQ section with answers, methodology section on About (E-E-A-T), intrinsic image sizing, and `revalidate` hour/day so pages are static HTML. |
| 11 | Cookie consent | 🔧 | **Did not exist.** Added banner with "Accept all" / "Essential only" / dismiss, `ielts_consent` cookie (versioned), and analytics that is *hard-gated* on consent — the client won't even send events without it, and the endpoint double-checks the `consent` flag. |
| 12 | About page | ⚠️ → ✅ | Existed but thin. Expanded with why-free, how scoring works (4 steps incl. the band conversion), an honest limitations note, who-it's-for, study advice, and internal links. |
| 13 | Site favicon | 🔧 | **Missing.** Added `icon.svg` (amber graduation-cap mark), `apple-icon.svg`, `manifest.webmanifest` (PWA + shortcuts), and a `themeColor` viewport export. |

---

## List 2 — Security checklist

| # | Item | Status | Detail |
|---|------|--------|--------|
| 1 | Session token in localStorage | ➖ | **Not an issue — verified.** `grep` found zero `localStorage` usage. Tokens live in an HTTP-only, SameSite=Lax cookie. I also removed the leftover `window.__IELTS_USER_SESSION__` global (register/login/navbar wrote user objects to `window`) and replaced it with a React context, so no session data sits in a script-readable global either. |
| 2 | Admin check on the client | ➖ → ✅ | No client-side role gate existed (good), and there was also no server-side one. Now `requireAdmin` runs in the guard against the **database row** before any admin handler executes; failures are logged as a security signal. Admin endpoints return 401/403 JSON, never HTML. |
| 3 | No 2FA / email verification | 🔧 | **This was the biggest hole** — "any 6 digits work" and no session gating. Rebuilt: hashed single-use codes with expiry + 5-attempt caps (`EmailVerification`, `PasswordReset`, `AuthChallenge` tables), verification **required before a session is issued**, resend endpoint, and email 2FA (`twoFactorEnabled` → login returns `202 requires2FA` → `/api/auth/2fa` completes it). Emails send via Resend when `RESEND_API_KEY` is set; otherwise the code is logged to the server console in dev. |
| 4 | No rate limit on login / reset | ⚠️ → ✅ | A single 10-per-minute rule covered everything. Now tiered per endpoint: login 5/min, register 3/min, forgot 3/15min, reset 5/15min, verify & 2FA 6/15min, contact 3/15min, AI endpoints 15–40/min. Plus durable lockout: 5 failures → 15-minute lock stored **in the database** (survives restarts and works across instances) on top of the in-memory check, plus a `LoginAttempt` audit trail, plus constant-time dummy-hash comparison so response timing can't confirm which emails exist. Optional Upstash Redis backend makes limits global on serverless. |
| 5 | No real password security | 🔧 | Minimum raised 8 → **10 characters**, and the password must mix case/number/symbol (or be 16+ chars), pass a breach blocklist (~60 common password patterns), avoid sequences/repeats, and not contain the user's email or name. 72-byte bcrypt cap enforced. Client shows a live strength meter that mirrors the server rules; the server re-validates. Reset and change-password revoke **every** existing session (token-version bump). New `/api/auth/change-password` endpoint. |

**Bonus hardening added:** CSRF origin allowlist on all mutations + double-submit CSRF token, 512 KB request-body cap, CSP/HSTS/Permissions-Policy/COOP headers, `X-Request-Id` tracing, request rate-limit headers, `nosniff`, `frame-ancestors 'none'`, and a `/privacy` page describing the data practice.

---

## List 3 — Speed

| # | Item | Status | What changed |
|---|------|--------|--------------|
| 1 | UI waits for the backend on every click | 🔧 | Optimistic UI added where the user feels it: **sign-out** updates instantly, **vocab "Got it / Still learning"** advances the card immediately with undo, **test submission** pushes the returned stats into the session context so the dashboard is already correct (no refetch), **grammar check** flips to "Checking…" in the same frame, **login/verify** update context and navigate without a full refresh, **leaderboard** renders from cached session data with no loading state at all. |
| 2 | JSON goes over the network uncompressed | ✅ + 🔧 | Vercel/Next gzip by default; `compress: true` is now explicit, `poweredByHeader: false` removes a header from every response, source maps are off in production, and `/_next/static` is served `immutable` for a year. Public catalogue JSON is edge-cached (`s-maxage=600, stale-while-revalidate=86400`) so repeat visitors usually get a cache hit, not a payload. |
| 3 | DB writes one row at a time | 🔧 | **Real problem, fixed.** Test saving was `INSERT` → `findMany(all rows)` → JS reduce → `upsert`. Now: one `$transaction` containing the insert **and** the stats upsert; averages computed by a single grouped `groupBy` aggregate in Postgres (no rows shipped to Node); verified codes marked read + updated in one transaction; analytics batched with `createMany`. Roughly 4 round-trips → 1. |
| 4 | Dependency bottleneck | 🔧 | `optimizePackageImports` for `lucide-react` + charts, **Chart.js lazy-loaded** via `next/dynamic` with a height-reserved skeleton, Groq SDK dynamically imported only when AI marking runs, and the router cache tuned (`staleTimes: {dynamic: 30, static: 300}`) so client navigations are instant. Measured: dashboard first-load JS **168 kB → 102 kB**; landing page component JS **2.07 kB → 202 B**. |
| 5 | Server rebuilds HTML for every visitor | 🔧 | Home, all four skill pages and About export `revalidate` (1h / 24h) and are prerendered as static HTML; auth, dashboard and practice runners are correctly dynamic. Verified in the build output: `○ (Static)` for content pages, `ƒ` only for `/api/*`. Combined with the edge cache, most visits never touch the server. |

---

## List 4 — Feel / polish

| # | Item | Status | What changed |
|---|------|--------|--------------|
| 1 | UI blinks on every click, cards don't reload | 🔧 | The navbar refetched `/api/stats` on **every page mount**, and the dashboard + leaderboard each fetched it again → three loading states per session. Now one `UserProvider` fetch cached in module scope, shared by navbar, dashboard, leaderboard and the test runners. Charts reserve their exact space (no layout shift), the navbar placeholder matches final button size (no flash), and `FlashCard` is memoised so flipping a card no longer re-renders the page shell. |
| 2 | Standardise typography | 🔧 | **No shared scale existed** — every page hand-rolled `text-3xl font-black`, `text-lg font-extrabold`, etc. Added one scale (`type-hero`, `type-h1`, `type-h2`, `type-h3`, `type-lead`, `type-body`, `type-meta`, `type-eyebrow`, `type-score`) with `clamp()` fluid sizing, `text-wrap: balance` on headings, and tabular numerals for scores. Applied across pages and components; the last ad-hoc headings were swept in the final pass. |
| 3 | Mobile horizontal scroll | 🔧 | Added a `.scroll-x` / `.no-scrollbar` utility and applied it to: the mobile module nav (always-visible chip row, so no menu tap needed), breadcrumbs, grammar quiz answer options, the vocab word strip, and the leaderboard table (now `min-w-[560px]` inside an `overflow-x-auto` wrapper instead of squashing). |

---

## How to verify (all run against the live dev server)

```bash
curl -sI http://localhost:3000/ | grep -iE "content-security|strict-transport|permissions-policy"
curl -s  http://localhost:3000/robots.txt
curl -s  http://localhost:3000/sitemap.xml | grep -c "<loc>"          # 18
curl -s  http://localhost:3000/ | grep -o "<title>.*</title>"
curl -sI "http://localhost:3000/api/exams?type=reading" | grep -i cache-control
curl -s  -X POST http://localhost:3000/api/auth/login -H 'Origin: https://evil.example' \
     -H 'Content-Type: application/json' -d '{"email":"a@b.com","password":"x"}'   # 403 CSRF
curl -s  -X POST http://localhost:3000/api/auth/register -H 'Content-Type: application/json' \
     -d '{"name":"A","email":"a@b.com","password":"password123"}'                  # weak → 400
# fire 6 login posts in a row → the 6th returns 429
```

Verified results from this run: 403 on cross-site POST · 400 `WEAK_PASSWORD` with the blocked-password reason · 429 on the 6th login attempt · 503 + `Retry-After` when the database is asleep (cold start) · single `Cache-Control` header on API responses.

---

## Still on you before launch (needs accounts, not code)

1. `DATABASE_URL` from Neon → `npx prisma db push` (email verification, lockout and 2FA all need the new tables).
2. `JWT_SECRET` (32+ chars) — `openssl rand -base64 48`.
3. `RESEND_API_KEY` + `MAIL_FROM` so verification/reset/2FA codes actually send.
4. `GROQ_API_KEY` for AI examiner feedback (heuristic marker is used without it).
5. Optional: `UPSTASH_REDIS_REST_URL/_TOKEN` for global rate limits, `prisma/rls.sql` to switch on database-level RLS, and `UPDATE "User" SET role='admin'` to unlock the analytics dashboard.
