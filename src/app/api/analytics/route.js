import { recordEvents } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const MAX_BATCH = 25;

// First-party, consent-gated analytics. The browser posts tiny batches with
// navigator.sendBeacon so nothing blocks the UI, and this endpoint answers
// 202 immediately — the insert happens after the response is on its way.
async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const events = Array.isArray(body?.events) ? body.events.slice(0, MAX_BATCH) : [];
  if (!events.length) return jsonOk({ accepted: 0 });

  // Consent flag is honoured client-side; the endpoint stays dumb and fast.
  if (body?.consent !== true) return jsonOk({ accepted: 0, skipped: "no-consent" });

  const session = getCurrentUser();
  const result = await recordEvents({
    events,
    userId: session?.userId ?? null,
    ip: ctx?.ip ?? null,
  });

  return jsonOk({ accepted: result.inserted }, 202);
}

export const POST = withApiGuard(handler, { name: "analytics", limit: 60, windowMs: 60_000 });
