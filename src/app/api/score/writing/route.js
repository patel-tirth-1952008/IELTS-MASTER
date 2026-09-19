import { groqJson, persistAttempt } from "@/lib/scoring";
import { sanitizeText } from "@/lib/security";
import { getExamById } from "@/data/sampleExams";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const SYSTEM = `You are an IELTS Writing examiner. Score the essay on the 4 official criteria
(Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy),
each 0-9 in 0.5 steps, plus an overall band (average). Reply ONLY with JSON:
{"task":7.0,"coherence":6.5,"lexical":7.0,"grammar":6.5,"overall":6.5,
 "strengths":["..."],"improvements":["..."],"corrected":"<rewritten paragraph or key fixes>"}`;

function heuristicScore(text, minWords) {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  const avgLen = words.length / Math.max(1, sentences.length);
  const longWords = words.filter((w) => w.length >= 7).length;
  const lexicalRatio = words.length ? longWords / words.length : 0;
  let band = 5.0;
  if (words.length >= minWords) band += 0.5;
  if (avgLen >= 14 && avgLen <= 24) band += 0.5;
  if (lexicalRatio > 0.12) band += 0.5;
  if (/(however|moreover|furthermore|in contrast|consequently|nevertheless)/i.test(text)) band += 0.5;
  band = Math.min(7.5, band);
  return {
    task: band, coherence: band, lexical: band, grammar: Math.max(4.5, band - 0.5),
    overall: band,
    strengths: ["Clear position on the question."],
    improvements: words.length < minWords
      ? [`Write at least ${minWords} words (you wrote ${words.length}).`]
      : ["Vary sentence structures and add more linking devices."],
    corrected: "",
    heuristic: true,
  };
}

async function handler(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  const examId = String(body.examId ?? "");
  const rawText = String(body.text ?? "");
  const timeTaken = typeof body.timeTaken === "number" ? body.timeTaken : null;
  const exam = getExamById(examId);
  if (!exam || exam.type !== "writing") return jsonError("Unknown writing exam.", 404);

  const text = sanitizeText(rawText, 8000);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 20) return jsonError("Please write at least 20 words for feedback.", 400);

  const minWords = exam.minWords ?? 250;
  let result = await groqJson({
    system: SYSTEM,
    user: `PROMPT: ${exam.prompt}\n\nESSAY (${wordCount} words):\n${text}`,
  });
  let aiUsed = true;
  if (!result || typeof result.overall !== "number") {
    result = heuristicScore(text, minWords);
    aiUsed = false;
  }
  const bandScore = Math.max(0, Math.min(9, Number(result.overall)));

  // One batched transaction (insert + stats upsert); guests get scores without saving.
  const stats = await persistAttempt({
    examType: "writing",
    examId,
    score: wordCount,
    bandScore,
    feedback: JSON.stringify(result),
    answers: { text: text.slice(0, 4000), wordCount },
    timeTaken,
  });

  return jsonOk({ ...result, overall: bandScore, wordCount, minWords, aiUsed, stats });
}

export const POST = withApiGuard(handler, "score-writing");
