# IELTS Master — Free AI-Powered IELTS Preparation

Next.js 14 (App Router, JavaScript) · Prisma 5 · PostgreSQL (Neon) · JWT in HTTP-only cookies ·
Groq (Llama 3.3) AI marking · Tailwind 3 · Lucide · Chart.js · Vercel-ready.

> Full speed/security/SEO audit report: **[AUDIT.md](./AUDIT.md)**

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL, JWT_SECRET, GROQ_API_KEY
npx prisma db push           # creates all tables on Neon
npm run dev                  # http://localhost:3000
```

Without a database the app still runs: exam lists, practice tests, vocab, grammar,
mock test and leaderboard all work in guest mode, and the UI shows a friendly
"database is waking up" message instead of an error page. AI marking needs
`GROQ_API_KEY`; emails need `RESEND_API_KEY` (codes print to the server console
in dev until then).

## Scripts

| Command            | What it does                              |
|--------------------|-------------------------------------------|
| `npm run dev`      | Start dev server                          |
| `npm run build`    | `prisma generate && next build`           |
| `npm start`        | Start production server                   |
| `npm run db:push`  | Push Prisma schema to Neon                |

## Environment

| Variable | Needed for |
|---|---|
| `DATABASE_URL` | everything account-related (Neon pooled string) |
| `JWT_SECRET` | sessions — 32+ characters |
| `GROQ_API_KEY` | AI writing/speaking/grammar marking |
| `NEXT_PUBLIC_SITE_URL` | canonicals, sitemap, OG tags, email links |
| `RESEND_API_KEY`, `MAIL_FROM` | verification, reset and 2FA codes |
| `ALLOWED_ORIGINS` | extra CSRF-allowed origins (comma separated) |
| `UPSTASH_REDIS_REST_URL/_TOKEN` | global rate limiting on serverless |
| `GOOGLE_SITE_VERIFICATION` | Search Console meta tag |

## Security (all enforced server-side)

- bcrypt 12-round hashing, 10-char minimum + breach blocklist + live strength meter
- Sessions only in HTTP-only, SameSite=Lax cookies + double-submit CSRF token
- **Email verification required before any session is issued**; optional email 2FA
- Hashed single-use codes (verification / reset / 2FA) with expiry + attempt caps
- Tiered rate limits per endpoint (login 5/min, reset 5/15min, AI 15–40/min)
- Durable lockout (5 fails → 15 min) stored in the database + in-memory fast path
- Origin allowlist on every mutation, 512 KB body cap, audit trail for every attempt
- Admin checks against the database row; RLS-ready (`prisma/rls.sql`, `withUserContext()`)
- CSP, HSTS, Permissions-Policy, COOP, nosniff, frame-deny headers

## Performance

- Content pages are prerendered static HTML with `revalidate` (1h / 24h)
- Catalogue JSON served from the edge (`s-maxage=600, stale-while-revalidate=86400`)
- Test saving = 1 transaction; stats via a single grouped aggregate, analytics batched
- Chart.js lazy-loaded (dashboard first-load JS 168 kB → 102 kB)
- One cached session request per browser session, shared via `UserProvider`
- Optimistic UI on sign-out, flashcards, quiz, marking and navigation

## Deploy to Vercel

1. Push this folder to GitHub → import the repo in Vercel.
2. Add the env vars above.
3. Deploy — `prisma generate` runs on build.
4. Optional hardening: run `psql "$DATABASE_URL" -f prisma/rls.sql`.

## Not yet production-grade (honest list)

- AI band scores are a strong practice signal, not an examiner's verdict — the About
  page says so explicitly.
- The leaderboard blends your real average with sample peers until a rankings API exists.
- Listening uses transcript-style demo audio; swap in hosted audio clips when available.
