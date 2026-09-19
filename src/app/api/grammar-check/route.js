import { groqJson } from "@/lib/scoring";
import { sanitizeText } from "@/lib/security";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const SYSTEM = `You are a friendly English grammar coach. Check the sentence(s) and reply ONLY with JSON:
{"corrected":"<full corrected text>","issues":[{"original":"...","fix":"...","rule":"<short grammar rule name>"}],
"score":<0-100>,"tip":"<one short improvement tip>"}`;

async function handler(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  const text = sanitizeText(body.text, 1500);
  if (text.trim().length < 5) return jsonError("Please enter a sentence to check.", 400);

  const ai = await groqJson({ system: SYSTEM, user: text, maxTokens: 800 });
  if (ai && ai.corrected) {
    return jsonOk({ ...ai, aiUsed: true });
  }

  // Offline fallback: a few common fixes so the tool still feels alive.
  let corrected = text
    .replace(/\bi\b/g, "I")
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/([.!?])\s*([a-z])/g, (_, p, c) => `${p} ${c.toUpperCase()}`);
  corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
  const changed = corrected !== text;
  return jsonOk({
    corrected,
    issues: changed
      ? [{ original: text.slice(0, 80), fix: corrected.slice(0, 80), rule: "Capitalisation & spacing" }]
      : [],
    score: changed ? 82 : 95,
    tip: "AI detail is unavailable — add a GROQ_API_KEY for full grammar explanations.",
    aiUsed: false,
  });
}

export const POST = withApiGuard(handler, "grammar-check");
