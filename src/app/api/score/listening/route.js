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

  // Safely extract questions whether they are structured in sections or a flat list
  let questions = [];
  if (Array.isArray(exam.sections)) {
    questions = exam.sections.flatMap((s) => s.questions ?? []);
  } else {
    questions = exam.questionsList ?? [];
  }

  let correct = 0;
  const detail = questions.map((q) => {
    const userAnswer = answers[q.id] ?? "";
    const isCorrect = checkAnswer(userAnswer, q.answer);
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      question: q.text,
      userAnswer: String(userAnswer),
      correctAnswer: Array.isArray(q.answer) ? q.answer.join(" / ") : q.answer,
      isCorrect,
      explanation: q.explanation ?? "",
    };
  });

  const bandScore = bandFromRaw(correct, questions.length || 1);
  const feedback = JSON.stringify({ correct, total: questions.length, bandScore });

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

function checkAnswer(userAnswer, correctAnswer) {
  const user = normaliseAnswer(userAnswer);
  if (!user) return false;
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some((a) => normaliseAnswer(a) === user);
  }
  return normaliseAnswer(correctAnswer) === user;
}

export const POST = withApiGuard(handler, "score-listening");