import { prisma } from "@/lib/prisma";
import { issueSession, publicUser, verifyPassword } from "@/lib/auth";
import {
  isValidEmail,
  normalizeEmail,
  checkAccountLockout,
  recordFailedLogin,
  resetFailedLogin,
  generateCode,
  hashToken,
} from "@/lib/security";
import { sendVerificationEmail } from "@/lib/mailer";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const CODE_TTL_MS = 10 * 60 * 1000;

// A valid bcrypt hash of a random string: comparing against it for unknown
// emails keeps response timing identical (no user enumeration via timing).
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEe.6H4Rtb0m0T5B.F1yH2xJb1CqvXk1ZTu";

async function audit(data) {
  try {
    await prisma.loginAttempt.create({ data });
  } catch {
    /* audit failures never block sign-in */
  }
}

async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const ip = ctx?.ip ?? null;

  if (!isValidEmail(email)) return jsonError("Please enter a valid email address.", 400);
  if (!password) return jsonError("Please enter your password.", 400);

  // 1. In-memory lockout (fast reject before any DB work).
  const quickLock = checkAccountLockout(email);
  if (quickLock.locked) {
    return jsonError(
      `Too many failed attempts. Try again in ${quickLock.retryInMin} minute(s).`,
      423,
      {},
      { code: "LOCKED" }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // 2. Durable lockout from the database (survives restarts, shared across instances).
  if (user?.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    await audit({ userId: user.id, email, ip, success: false, reason: "locked" });
    return jsonError(`Account temporarily locked. Try again in ${mins} minute(s).`, 423, {}, {
      code: "LOCKED",
    });
  }

  const ok = user
    ? await verifyPassword(password, user.password)
    : await verifyPassword(password, DUMMY_HASH);

  if (!user || !ok) {
    const after = recordFailedLogin(email);
    if (user) {
      const fails = (user.failedLoginCount ?? 0) + 1;
      const lockUntil = fails >= MAX_FAILS ? new Date(Date.now() + LOCK_MS) : null;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: lockUntil ? 0 : fails,
          lockedUntil: lockUntil,
        },
      });
      await audit({ userId: user.id, email, ip, success: false, reason: "bad-password" });
      if (lockUntil) {
        return jsonError("Too many failed attempts. Account locked for 15 minutes.", 423, {}, {
          code: "LOCKED",
        });
      }
    } else {
      await audit({ email, ip, success: false, reason: "unknown-email" });
    }
    return jsonError(
      `Incorrect email or password. ${after.remainingAttempts} attempt(s) left.`,
      401
    );
  }

  // 3. Email verification is mandatory before a session exists.
  if (!user.emailVerified) {
    const code = generateCode();
    try {
      await prisma.$transaction([
        prisma.emailVerification.create({
          data: {
            userId: user.id,
            codeHash: hashToken(code),
            expiresAt: new Date(Date.now() + CODE_TTL_MS),
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { failedLoginCount: 0, lockedUntil: null },
        }),
      ]);
      await sendVerificationEmail(user.email, code, user.name ?? "");
    } catch (err) {
      console.error("[login:resend-verification]", err?.message ?? err);
    }
    return jsonError("Please verify your email first — we've sent you a fresh code.", 403, {}, {
      code: "EMAIL_NOT_VERIFIED",
      email: user.email,
    });
  }

  // 4. Two-factor: email a one-time code instead of issuing the session.
  if (user.twoFactorEnabled) {
    const code = generateCode();
    const challenge = await prisma.authChallenge.create({
      data: {
        userId: user.id,
        type: "2fa",
        codeHash: hashToken(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
        ip,
      },
    });
    const { sendTwoFactorEmail } = await import("@/lib/mailer");
    await sendTwoFactorEmail(user.email, code);
    await audit({ userId: user.id, email, ip, success: true, reason: "2fa-required" });
    return jsonOk(
      {
        requires2FA: true,
        challengeId: challenge.id,
        email: user.email,
        message: "Enter the sign-in code we just emailed you.",
      },
      202
    );
  }

  // 5. Success — clear counters, issue HTTP-only session, record the attempt.
  resetFailedLogin(email);
  const [fresh] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    }),
    prisma.loginAttempt.create({
      data: { userId: user.id, email, ip, success: true, reason: "password" },
    }),
  ]);

  await issueSession(fresh);
  return jsonOk({ user: publicUser(fresh) });
}

export const POST = withApiGuard(handler, "login");
