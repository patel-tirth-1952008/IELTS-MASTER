import { prisma } from "@/lib/prisma";

// IELTS academic reading/listening band conversion (40-question scale).
const BAND_TABLE = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
  [23, 6], [19, 5.5], [15, 5], [12, 4.5], [9, 4], [6, 3.5], [3, 3], [1, 2.5],
];

export function bandFromRaw(correct, total = 40) {
  if (!total || total <= 0) return 0;
  const scaled = Math.round((correct / total) * 40);
  if (scaled <= 0) return 0;
  for (const [min, band] of BAND_TABLE) {
    if (scaled >= min) return band;
  }
  return 2;
}

export function normaliseAnswer(v) {
  return String(v ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

// Recompute per-skill averages with ONE grouped aggregate query executed in
// the database (no rows shipped to Node, no JS reduce over hundreds of rows),
// then persist the result.
//
// @param db optional transaction client — lets callers batch this with the
//           submission insert so the whole save is a single round-trip.
export async function refreshUserStats(userId, db = prisma) {
  if (!userId) return null;

  // Aggregate + read in parallel: the counts/sums and the test total are
  // two independent queries, so there's no reason to serialise them.
  const [grouped, totalTests] = await Promise.all([
    db.submission.groupBy({
      by: ["examType"],
      where: { userId, bandScore: { not: null } },
      _avg: { bandScore: true },
      _count: { _all: true },
    }),
    db.submission.count({ where: { userId, bandScore: { not: null } } }),
  ]);

  const pick = (type) => {
    const row = grouped.find((g) => g.examType === type);
    return row?._avg?.bandScore ?? 0;
  };
  const readingAvg = pick("reading");
  const writingAvg = pick("writing");
  const listeningAvg = pick("listening");
  const speakingAvg = pick("speaking");

  const graded = grouped.reduce((n, g) => n + (g._count?._all ?? 0), 0) || 1;
  const weightedSum =
    readingAvg * (grouped.find((g) => g.examType === "reading")?._count?._all ?? 0) +
    writingAvg * (grouped.find((g) => g.examType === "writing")?._count?._all ?? 0) +
    listeningAvg * (grouped.find((g) => g.examType === "listening")?._count?._all ?? 0) +
    speakingAvg * (grouped.find((g) => g.examType === "speaking")?._count?._all ?? 0);

  const data = {
    totalTests,
    readingAvg: round1(readingAvg),
    writingAvg: round1(writingAvg),
    listeningAvg: round1(listeningAvg),
    speakingAvg: round1(speakingAvg),
    averageBand: round1(weightedSum / graded),
  };

  await db.userStats.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
  return data;
}

/**
 * Save a graded attempt and update the user's rolling stats.
 * The insert, the stat upsert and the streak all happen inside ONE
 * transaction — previously this was 3+ sequential statements per test.
 * Returns the fresh stats so the caller can return them to the UI
 * (optimistic client update, no second fetch).
 */
export async function saveSubmission({ userId, examType, examId, score, bandScore, feedback, answers, timeTaken }) {
  if (!userId) return null;
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.submission.create({
        data: {
          userId,
          examType,
          examId: examId ?? null,
          score: typeof score === "number" ? score : null,
          bandScore: typeof bandScore === "number" ? bandScore : null,
          feedback: feedback ?? null,
          answers: answers ?? undefined,
          timeTaken: typeof timeTaken === "number" ? timeTaken : null,
        },
      });

      const stats = await refreshUserStats(userId, tx);
      const streak = await tx.submission.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: 1,
        select: { createdAt: true },
      });
      return { stats, previousAt: streak?.createdAt ?? null };
    });
  } catch (err) {
    // Never fail a scored test because persisting failed.
    console.error("[saveSubmission]", err?.message ?? err);
    return null;
  }
}

/**
 * Persist a graded attempt for the signed-in user, if there is one.
 * Guests are scored normally and simply not stored.
 */
export async function persistAttempt(payload) {
  const { getCurrentUser } = await import("@/lib/auth");
  const session = getCurrentUser();
  if (!session?.userId) return null;
  const saved = await saveSubmission({ userId: session.userId, ...payload });
  return saved?.stats ?? null;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

// Groq chat completion helper. Returns parsed JSON, or null on any failure
// (missing key, network error, bad JSON) so routes can fall back gracefully.
export async function groqJson({ system, user, maxTokens = 1200 }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  try {
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey });
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    });
    const text = res.choices?.[0]?.message?.content ?? "";
    return JSON.parse(text);
  } catch (err) {
    console.error("[groq]", err?.message ?? err);
    return null;
  }
}
