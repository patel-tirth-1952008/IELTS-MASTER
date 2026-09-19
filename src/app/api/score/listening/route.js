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
  if (!exam || exam.type !== "listening") return jsonError("Unknown listening exam.", 404);

  const questions = exam.questionsList ?? [];
  let correct = 0;
  const detail = questions.map((q) => {
    const userAnswer = answers[q.id] ?? "";
    const isCorrect = normaliseAnswer(userAnswer) === normaliseAnswer(q.answer);
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      question: q.text,
      userAnswer: String(userAnswer),
      correctAnswer: q.answer,
      isCorrect,
      explanation: q.explanation ?? "",
    };
  });

  const bandScore = bandFromRaw(correct, questions.length || 1);
  const feedback = JSON.stringify({ correct, total: questions.length, bandScore });

  // One batched transaction (insert + stats upsert); guests get scores without saving.
  const stats = await persistAttempt({
    examType: "listening",
    examId,
    score: correct,
    bandScore,
    feedback,
    answers,
    timeTaken: typeof timeTaken === "number" ? timeTaken : null,
  });

  return jsonOk({ correct, total: questions.length, bandScore, detail, stats });
}

export const POST = withApiGuard(handler, "score-listening");
