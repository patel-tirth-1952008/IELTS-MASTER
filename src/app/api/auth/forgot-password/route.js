import { prisma } from "@/lib/prisma";
import { isValidEmail, normalizeEmail, generateCode, hashToken } from "@/lib/security";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const TTL_MS = 20 * 60 * 1000;

// Issues a single-use, hashed, 20-minute reset code.
// Always answers with the same message so the endpoint can't be used to
// discover which emails have accounts.
async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) return jsonError("Please enter a valid email address.", 400);

  const generic = {
    message: "If an account exists for that email, a reset code is on its way.",
  };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return jsonOk(generic, 202);

    const code = generateCode();
    // Batched: expire old codes + store the new hashed one in one transaction.
    await prisma.$transaction([
      prisma.passwordReset.updateMany({
        where: { userId: user.id, consumedAt: null },
        data: { consumedAt: new Date() },
      }),
      prisma.passwordReset.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(code),
          expiresAt: new Date(Date.now() + TTL_MS),
          ip: ctx?.ip ?? null,
        },
      }),
    ]);

    const delivery = await sendPasswordResetEmail(user.email, code, user.name ?? "");
    return jsonOk({ ...generic, delivery: { delivered: delivery.delivered } }, 202);
  } catch (err) {
    console.error("[forgot-password]", err?.message ?? err);
    // Still generic — never leak internal state.
    return jsonOk(generic, 202);
  }
}

// Tight tier: 3 requests per 15 minutes per IP (RATE_TIERS["forgot-password"]).
export const POST = withApiGuard(handler, "forgot-password");
