import { prisma } from "@/lib/prisma";
import { getCurrentUser, getSessionUser, publicUser } from "@/lib/auth";
import { withApiGuard, jsonOk } from "@/lib/apiGuard";

const ZERO_STATS = {
  totalTests: 0,
  readingAvg: 0,
  writingAvg: 0,
  listeningAvg: 0,
  speakingAvg: 0,
  averageBand: 0,
  studyStreak: 0,
};

// GET /api/stats — the client session probe + dashboard payload in one call.
// NEVER crashes: guests and DB outages get zeros, not 500s.
// The user row and the recent-submissions list are fetched in parallel
// (both are keyed by the session userId, so there is no reason to wait).
async function handler() {
  try {
    const session = getCurrentUser();
    if (!session?.userId) {
      return jsonOk({ authenticated: false, user: null, stats: ZERO_STATS, recent: [] });
    }

    const [user, recent] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.userId }, include: { stats: true } }),
      prisma.submission.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true, examType: true, examId: true,
          bandScore: true, score: true, createdAt: true,
        },
      }).catch(() => []),
    ]);

    if (!user) {
      return jsonOk({ authenticated: false, user: null, stats: ZERO_STATS, recent: [] });
    }

    return jsonOk({
      authenticated: true,
      user: publicUser(user),
      stats: user.stats ?? ZERO_STATS,
      recent,
    });
  } catch (err) {
    console.error("[stats] db unreachable (cold start?):", err?.code ?? err?.message ?? err);
    return jsonOk({
      authenticated: false,
      user: null,
      stats: ZERO_STATS,
      recent: [],
      degraded: true,
    });
  }
}

export const GET = withApiGuard(handler, { name: "stats", rateLimitBy: "user" });
export const dynamic = "force-dynamic";
