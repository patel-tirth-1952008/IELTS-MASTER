import { prisma } from "@/lib/prisma";
import { isValidEmail, normalizeEmail, generateCode, hashToken } from "@/lib/security";
import { sendVerificationEmail } from "@/lib/mailer";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const TTL_MS = 15 * 60 * 1000;

// Re-issues a verification code. Same generic response either way, and the
// tier limit (6 per 15 min per IP) stops it being used as a mail bomb.
async function handler(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) return jsonError("Please enter a valid email address.", 400);

  const generic = { message: "If that account needs verifying, a new code is on its way." };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.emailVerified) return jsonOk(generic, 202);

    const code = generateCode();
    await prisma.$transaction([
      prisma.emailVerification.updateMany({
        where: { userId: user.id, consumedAt: null },
        data: { consumedAt: new Date() },
      }),
      prisma.emailVerification.create({
        data: {
          userId: user.id,
          codeHash: hashToken(code),
          expiresAt: new Date(Date.now() + TTL_MS),
        },
      }),
    ]);

    const delivery = await sendVerificationEmail(user.email, code, user.name ?? "");
    return jsonOk({ ...generic, delivery: { delivered: delivery.delivered } }, 202);
  } catch (err) {
    console.error("[resend-verification]", err?.message ?? err);
    return jsonOk(generic, 202);
  }
}

export const POST = withApiGuard(handler, "verify-email");
