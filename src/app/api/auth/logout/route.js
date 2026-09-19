import { clearAuthCookie, getCurrentUser, revokeAllSessions } from "@/lib/auth";
import { withApiGuard, jsonOk } from "@/lib/apiGuard";

// Clears the HTTP-only session cookie. Pass { all: true } to also revoke
// every session on every device (bumps the user's token version).
async function handler(req, ctx) {
  let all = false;
  try {
    const body = await req.json();
    all = Boolean(body?.all);
  } catch {
    /* no body — plain logout */
  }

  if (all && ctx?.user?.userId) {
    try {
      await revokeAllSessions(ctx.user.userId);
    } catch (err) {
      console.error("[logout:all]", err?.message ?? err);
    }
  }

  clearAuthCookie();
  return jsonOk({ message: "Signed out." });
}

// CSRF-protected only when a session actually exists, so first-time
// visitors can always clear a stale cookie.
export const POST = withApiGuard(handler, { name: "auth-me" });
