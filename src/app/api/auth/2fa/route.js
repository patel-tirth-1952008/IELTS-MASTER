import { prisma } from "@/lib/prisma";
import { issueSession, publicUser } from "@/lib/auth";
import { hashToken, safeEqual } from "@/lib/security";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const MAX_ATTEMPTS = 5;

// Second factor: completes a sign-in started by /api/auth/login when the
// account has 2FA enabled. Codes are single-use and expire in 10 minutes.
async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const challengeId = String(body.challengeId ?? "");
  const code = String(body.code ?? "").trim();
  if (!challengeId) return jsonError("Missing challenge. Please sign in again.", 400);
  if (!/^\d{6}$/.test(code)) return jsonError("Please enter the 6-digit code.", 400);

  const challenge = await prisma.authChallenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.type !== "2fa") {
    return jsonError("That sign-in attempt has expired. Please start again.", 400);
  }
  if (challenge.consumedAt) {
    return jsonError("That code was already used. Please start again.", 400);
  }
  if (challenge.expiresAt.getTime() < Date.now()) {
    return jsonError("That code expired. Please sign in again.", 400);
  }
  if (challenge.attempts >= MAX_ATTEMPTS) {
    return jsonError("Too many incorrect codes. Please sign in again.", 429);
  }

  if (!safeEqual(hashToken(code), challenge.codeHash)) {
    await prisma.authChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    const left = MAX_ATTEMPTS - (challenge.attempts + 1);
    return jsonError(`That code isn't right. ${Math.max(0, left)} attempt(s) left.`, 400);
  }

  const user = await prisma.user.findUnique({ where: { id: challenge.userId } });
  if (!user) return jsonError("Account not found. Please sign in again.", 400);

  const [fresh] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ctx?.ip ?? null,
        failedLoginCount: 0,
        lockedUntil: null,
      },
    }),
    prisma.authChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    }),
    prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email: user.email,
        ip: ctx?.ip ?? null,
        success: true,
        reason: "2fa",
      },
    }),
  ]);

  await issueSession(fresh);
  return jsonOk({ user: publicUser(fresh) });
}

export const POST = withApiGuard(handler, "2fa");
