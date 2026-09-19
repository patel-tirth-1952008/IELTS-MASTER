import { analyticsSummary } from "@/lib/analytics";
import { withApiGuard, jsonOk, jsonError } from "@/lib/apiGuard";

// Admin-only reporting. Authorisation runs HERE, on the server, against the
// database row (role + token version) — never from a client-side flag.
async function handler(req, ctx) {
  const days = Math.min(90, Math.max(1, Number(new URL(req.url).searchParams.get("days") ?? 7)));
  try {
    const summary = await analyticsSummary({ days });
    return jsonOk({
      ...summary,
      requestedBy: ctx.user.email,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[admin:analytics]", err?.message ?? err);
    return jsonError("Could not build the analytics summary.", 503);
  }
}

export const GET = withApiGuard(handler, {
  name: "analytics",
  requireAdmin: true, // 403 for non-admins, checked server-side
  rateLimitBy: "user",
});
