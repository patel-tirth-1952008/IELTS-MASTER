import { sampleExams, getExamsByType, EXAM_TYPES } from "@/data/sampleExams";
import { withApiGuard, jsonError, jsonCached } from "@/lib/apiGuard";

// GET /api/exams?type=reading — public exam catalogue.
// Static data, so it is served from the CDN edge with stale-while-revalidate:
// repeat visitors get it in a few milliseconds with no origin hit.
async function handler(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  if (type && !EXAM_TYPES.includes(type)) {
    return jsonError("Unknown exam type.", 400);
  }

  const exams = type ? getExamsByType(type) : sampleExams;
  const slim = exams.map((e) => ({
    id: e.id,
    type: e.type,
    title: e.title,
    description: e.description,
    durationMin: e.durationMin,
    questions: e.questions,
    difficulty: e.difficulty,
  }));

  return jsonCached({ exams: slim, count: slim.length }, { sMaxAge: 600, swr: 86400 });
}

export const GET = withApiGuard(handler, {
  name: "exams",
  cache: { sMaxAge: 600, swr: 86400 },
});
