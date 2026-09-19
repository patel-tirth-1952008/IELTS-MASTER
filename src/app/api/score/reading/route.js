import { bandFromRaw, normaliseAnswer, persistAttempt } from "@/lib/scoring";
import { getExamById } from "@/data/sampleExams";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

async function handler(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  const { examId, answers = {}, timeTaken = null } = body;
  const exam = getExamById(examId);
  if (!exam || exam.type !== "reading") return jsonError("Unknown reading exam.", 404);

  const allQuestions = (exam.passages ?? []).flatMap((p) =>
    (p.questions ?? []).map((q) => ({ ...q, passage: p.title }))
  );
  let correct = 0;
  const detail = allQuestions.map((q) => {
    const userAnswer = answers[q.id] ?? "";
    const isCorrect = checkAnswer(userAnswer, q.answer);
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      passage: q.passage,
      question: q.text,
      userAnswer: String(userAnswer),
      correctAnswer: Array.isArray(q.answer) ? q.answer.join(" / ") : q.answer,
      isCorrect,
      explanation: q.explanation ?? "",
    };
  });

  const bandScore = bandFromRaw(correct, allQuestions.length || 1);
  const feedback = JSON.stringify({ correct, total: allQuestions.length, bandScore });

  const stats = await persistAttempt({
    examType: "reading",
    examId,
    score: correct,
    bandScore,
    feedback,
    answers,
    timeTaken: typeof timeTaken === "number" ? timeTaken : null,
  });

  return jsonOk({ correct, total: allQuestions.length, bandScore, detail, stats });
}

/**
 * Accepts either a single string answer OR an array of acceptable answers
 * (e.g. ["cost", "time"] where any single match counts as correct).
 * This lets test authors provide synonyms without changing scoring logic.
 */
function checkAnswer(userAnswer, correctAnswer) {
  const user = normaliseAnswer(userAnswer);
  if (!user) return false;
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some((a) => normaliseAnswer(a) === user);
  }
  return normaliseAnswer(correctAnswer) === user;
}

export const POST = withApiGuard(handler, "score-reading");