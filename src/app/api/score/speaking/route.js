import { groqJson, persistAttempt } from "@/lib/scoring";
import { sanitizeText } from "@/lib/security";
import { getExamById } from "@/data/sampleExams";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

const SYSTEM = `You are an IELTS Speaking examiner. Score the transcript on the 4 official criteria
(Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation-proxy from text),
each 0-9 in 0.5 steps, plus an overall band (average). Note pronunciation from text is approximate.
Reply ONLY with JSON: {"fluency":7.0,"lexical":6.5,"grammar":6.5,"pronunciation":7.0,"overall":6.5,
"strengths":["..."],"improvements":["..."],"sampleAnswer":"<a short band-8 model answer>"}`;

function heuristicScore(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const fillers = (text.match(/\b(um|uh|like|you know|actually|basically)\b/gi) ?? []).length;
  let band = 5.5;
  if (words.length >= 80) band += 0.5;
  if (words.length >= 150) band += 0.5;
  if (fillers / Math.max(1, words.length) < 0.03) band += 0.5;
  if (/(because|although|however|for example|in my opinion)/i.test(text)) band += 0.5;
  band = Math.min(7.5, band);
  return {
    fluency: band, lexical: band, grammar: Math.max(4.5, band - 0.5),
    pronunciation: band, overall: band,
    strengths: ["Answers the question directly."],
    improvements: words.length < 80
      ? ["Extend your answer — aim for 1–2 minutes of speech (120+ words)."]
      : ["Add reasons and examples to stretch each answer."],
    sampleAnswer: "",
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
  const rawText = String(body.transcript ?? body.text ?? "");
  const timeTaken = typeof body.timeTaken === "number" ? body.timeTaken : null;
  const exam = getExamById(examId);
  if (!exam || exam.type !== "speaking") return jsonError("Unknown speaking exam.", 404);

  const text = sanitizeText(rawText, 8000);
  if (text.split(/\s+/).filter(Boolean).length < 10) {
    return jsonError("Please speak or type at least a few sentences.", 400);
  }

  let result = await groqJson({
    system: SYSTEM,
    user: `QUESTIONS: ${(exam.cueCards ?? []).join(" / ")}\n\nCANDIDATE TRANSCRIPT:\n${text}`,
  });
  let aiUsed = true;
  if (!result || typeof result.overall !== "number") {
    result = heuristicScore(text);
    aiUsed = false;
  }
  const bandScore = Math.max(0, Math.min(9, Number(result.overall)));

  // One batched transaction (insert + stats upsert); guests get scores without saving.
  const stats = await persistAttempt({
    examType: "speaking",
    examId,
    score: text.split(/\s+/).filter(Boolean).length,
    bandScore,
    feedback: JSON.stringify(result),
    answers: { transcript: text.slice(0, 4000) },
    timeTaken,
  });

  return jsonOk({ ...result, overall: bandScore, aiUsed, stats });
}

export const POST = withApiGuard(handler, "score-speaking");
