import { getCurrentUser, getSessionUser, publicUser } from "@/lib/auth";
import { withApiGuard, jsonOk } from "@/lib/apiGuard";

// Session probe used by the client session provider. Strict mode re-checks
// the token version / verification state in the database.
async function handler() {
  const session = getCurrentUser();
  if (!session?.userId) {
    return jsonOk({ authenticated: false, user: null });
  }

  const user = await getSessionUser();
  if (!user) {
    // Revoked, locked, or deleted — tell the client to sign in again.
    return jsonOk({ authenticated: false, user: null, reason: "session-invalid" });
  }

  return jsonOk({
    authenticated: true,
    user: publicUser(user),
    security: { emailVerified: user.emailVerified, twoFactorEnabled: user.twoFactorEnabled },
  });
}

export const GET = withApiGuard(handler, "auth-me");
