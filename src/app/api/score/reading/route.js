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
    const isCorrect = normaliseAnswer(userAnswer) === normaliseAnswer(q.answer);
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      passage: q.passage,
      question: q.text,
      userAnswer: String(userAnswer),
      correctAnswer: q.answer,
      isCorrect,
      explanation: q.explanation ?? "",
    };
  });

  const bandScore = bandFromRaw(correct, allQuestions.length || 1);
  const feedback = JSON.stringify({ correct, total: allQuestions.length, bandScore });

  // One batched transaction (insert + stats upsert); guests get scores without saving.
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

export const POST = withApiGuard(handler, "score-reading");
