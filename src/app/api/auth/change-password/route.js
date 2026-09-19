import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, revokeAllSessions } from "@/lib/auth";
import { validatePasswordStrength } from "@/lib/security";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

// Changing a password requires: an authenticated session, a valid CSRF
// token, and the current password. All other devices are signed out.
async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const current = String(body.currentPassword ?? "");
  const next = String(body.newPassword ?? "");
  const user = ctx.user; // resolved server-side by the guard

  if (!current || !next) return jsonError("Fill in both password fields.", 400);

  const strength = validatePasswordStrength(next, { email: user.email, name: user.name ?? "" });
  if (!strength.ok) {
    return jsonError(strength.problems[0] ?? "Please choose a stronger password.", 400, {}, {
      code: "WEAK_PASSWORD",
      problems: strength.problems,
    });
  }

  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });
  if (!row) return jsonError("Account not found.", 404);

  const ok = await verifyPassword(current, row.password);
  if (!ok) return jsonError("Your current password is incorrect.", 401);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(next), passwordChangedAt: new Date() },
  });

  await revokeAllSessions(user.id);

  return jsonOk({
    message: "Password changed. Other devices have been signed out.",
    reauthRequired: true,
  });
}

export const POST = withApiGuard(handler, {
  name: "change-password",
  requireAuth: true,
  csrf: true,
});
