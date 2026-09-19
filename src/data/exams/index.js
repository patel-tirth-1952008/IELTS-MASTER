import readingTest1 from "./reading/reading-test-1";
import readingTest2 from "./reading/reading-test-2";
import readingTest3 from "./reading/reading-test-3";
import readingTest4 from "./reading/reading-test-4";

// Future imports:
// import writingTest1 from "./writing/writing-test-1";
// import listeningTest1 from "./listening/listening-test-1";
// import speakingTest1 from "./speaking/speaking-test-1";

export const allExams = [
  readingTest1,
  readingTest2,
  readingTest3,
  readingTest4,
];

export function getExamById(id) {
  return allExams.find((e) => e.id === id) ?? null;
}

export function getExamsByType(type) {
  return allExams.filter((e) => e.type === type);
}