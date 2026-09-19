import { prisma } from "@/lib/prisma";
import { issueSession, publicUser } from "@/lib/auth";
import { hashToken, safeEqual } from "@/lib/security";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const MAX_ATTEMPTS = 5;

// Verifies the emailed code, then issues the first real session.
async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const code = String(body.code ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!/^\d{6}$/.test(code)) return jsonError("Please enter the 6-digit code.", 400);
  if (!email) return jsonError("Missing email address.", 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return jsonError("Invalid or expired code.", 400);

  // Latest live code for this account.
  const record = await prisma.emailVerification.findFirst({
    where: { userId: user.id, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) {
    return jsonError("That code has expired — request a new one.", 400, {}, {
      code: "CODE_EXPIRED",
    });
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    return jsonError("Too many incorrect codes. Request a new one.", 429, {}, {
      code: "CODE_LOCKED",
    });
  }

  if (!safeEqual(hashToken(code), record.codeHash)) {
    await prisma.emailVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    const left = MAX_ATTEMPTS - (record.attempts + 1);
    return jsonError(`That code isn't right. ${Math.max(0, left)} attempt(s) left.`, 400);
  }

  // Batched: consume the code + verify the account in one transaction.
  const [verified] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, lastLoginAt: new Date(), lastLoginIp: ctx?.ip ?? null },
    }),
    prisma.emailVerification.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
    prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email: user.email,
        ip: ctx?.ip ?? null,
        success: true,
        reason: "email-verified",
      },
    }),
  ]);

  await issueSession(verified);
  return jsonOk({ user: publicUser(verified), verified: true });
}

export const POST = withApiGuard(handler, "verify-email");
