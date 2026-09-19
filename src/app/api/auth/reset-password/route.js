import { prisma } from "@/lib/prisma";
import { hashPassword, revokeAllSessions } from "@/lib/auth";
import {
  isValidEmail,
  normalizeEmail,
  validatePasswordStrength,
  hashToken,
  safeEqual,
} from "@/lib/security";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const MAX_ATTEMPTS = 5;

// Consumes the single-use reset code, sets the new password, and revokes
// every existing session (all old tokens stop working immediately).
async function handler(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const code = String(body.code ?? "").trim();

  if (!isValidEmail(email)) return jsonError("Please enter a valid email address.", 400);
  if (!/^\d{6}$/.test(code)) return jsonError("Please enter the 6-digit reset code.", 400);

  const strength = validatePasswordStrength(password, { email });
  if (!strength.ok) {
    return jsonError(strength.problems[0] ?? "Please choose a stronger password.", 400, {}, {
      code: "WEAK_PASSWORD",
      problems: strength.problems,
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return jsonError("Invalid or expired reset code.", 400);

  const record = await prisma.passwordReset.findFirst({
    where: { userId: user.id, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) {
    return jsonError("That reset code expired. Please request a new one.", 400, {}, {
      code: "CODE_EXPIRED",
    });
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    return jsonError("Too many incorrect codes. Please request a new one.", 429);
  }

  if (!safeEqual(hashToken(code), record.tokenHash)) {
    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    const left = MAX_ATTEMPTS - (record.attempts + 1);
    return jsonError(`That reset code isn't right. ${Math.max(0, left)} attempt(s) left.`, 400);
  }

  const hashed = await hashPassword(password);

  // One transaction: new password + consume code + clear lockout counters.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordChangedAt: new Date(),
        failedLoginCount: 0,
        lockedUntil: null,
      },
    }),
    prisma.passwordReset.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
    prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email: user.email,
        success: true,
        reason: "password-reset",
      },
    }),
  ]);

  // Every previously issued cookie is now invalid.
  await revokeAllSessions(user.id);

  return jsonOk({ message: "Password updated. Sign in with your new password." });
}

export const POST = withApiGuard(handler, "reset-password");
