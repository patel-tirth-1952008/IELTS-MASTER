import { prisma } from "@/lib/prisma";
import { hashPassword, publicUser } from "@/lib/auth";
import {
  isValidEmail,
  normalizeEmail,
  sanitizeName,
  validatePasswordStrength,
  generateCode,
  hashToken,
} from "@/lib/security";
import { getClientIp } from "@/lib/rateLimit";
import { sendVerificationEmail } from "@/lib/mailer";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const CODE_TTL_MS = 15 * 60 * 1000;

// Registers the account, then REQUIRES email verification before any
// session is issued — an attacker who knows your email cannot create and
// use an account on your behalf, and fake addresses never get a session.
async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const name = sanitizeName(body.name);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const targetBand = Number(body.targetBand ?? 7.5);

  if (!name) return jsonError("Please enter your name.", 400);
  if (!isValidEmail(email)) return jsonError("Please enter a valid email address.", 400);
  if (!(targetBand >= 6.0 && targetBand <= 8.5)) {
    return jsonError("Target band must be between 6.0 and 8.5.", 400);
  }

  // Real password policy: length + character classes + breach blocklist.
  const strength = validatePasswordStrength(password, { email, name });
  if (!strength.ok) {
    return jsonError(strength.problems[0] ?? "Please choose a stronger password.", 400, {}, {
      code: "WEAK_PASSWORD",
      problems: strength.problems,
      strength: strength.label,
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    // Generic message — never confirm which emails are registered.
    return jsonError(
      "If that email is available, we've sent a verification code to it. Check your inbox.",
      409,
      {},
      { code: "EMAIL_TAKEN" }
    );
  }

  const hashed = await hashPassword(password);
  const code = generateCode();
  const ip = ctx?.ip ?? getClientIp(req);

  // One transaction: user + stats + verification code (batched writes).
  const created = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: {
        email,
        password: hashed,
        name,
        targetBand,
        emailVerified: false,
        passwordChangedAt: new Date(),
        stats: { create: {} }, // n+1 avoided: nested create in one round-trip
      },
    });
    await tx.emailVerification.create({
      data: {
        userId: u.id,
        codeHash: hashToken(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    });
    await tx.loginAttempt.create({
      data: { userId: u.id, email, ip, success: true, reason: "register" },
    });
    return u;
  });

  const delivery = await sendVerificationEmail(email, code, name);

  return jsonOk(
    {
      requiresVerification: true,
      user: publicUser(created),
      email,
      delivery: { delivered: delivery.delivered, provider: delivery.provider },
      message: delivery.delivered
        ? `We emailed a 6-digit code to ${email}.`
        : `Mail provider not configured — the code is in the server console (dev mode).`,
    },
    201
  );
}

export const POST = withApiGuard(handler, "register");
