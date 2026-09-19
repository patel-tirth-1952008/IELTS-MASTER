// Seed / demo exam catalogue. Used by exam list pages and the
// /api/exams route so the app is useful even before a database is wired.
import { allExams } from "./exams/index";
export const EXAM_TYPES = ["reading", "writing", "listening", "speaking"];

export const BAND_LABELS = {
  reading: "Reading",
  writing: "Writing",
  listening: "Listening",
  speaking: "Speaking",
};

export const sampleExams = [
  {
    id: "reading-academic-1",
    type: "reading",
    title: "Academic Reading — Test 1",
    description: "3 passages · 40 questions · 60 minutes. True/False/NG, matching & gap-fill.",
    durationMin: 60,
    questions: 40,
    difficulty: "Medium",
    passages: [
      {
        id: "p1",
        title: "The History of Tea",
        text: "Tea was first discovered in China nearly 5,000 years ago. According to legend, Emperor Shen Nung was boiling water when leaves from a nearby tree blew into his pot. The resulting drink was refreshing, and tea cultivation slowly spread across Asia. By the 17th century, European traders had carried tea to London, where it quickly became fashionable. Today, tea is the second most consumed beverage in the world after water.",
        questions: [
          { id: "r1q1", kind: "tfng", text: "Tea was discovered by accident.", answer: "True", options: ["True", "False", "Not Given"], explanation: "The legend describes leaves blowing into boiling water — an accident." },
          { id: "r1q2", kind: "tfng", text: "Tea reached London in the 16th century.", answer: "False", options: ["True", "False", "Not Given"], explanation: "The passage says the 17th century." },
          { id: "r1q3", kind: "tfng", text: "Coffee is more popular than tea worldwide.", answer: "False", options: ["True", "False", "Not Given"], explanation: "Tea is second only to water." },
          { id: "r1q4", kind: "mcq", text: "Where was tea first discovered?", answer: "China", options: ["India", "China", "England", "Japan"], explanation: "The passage states China." },
        ],
      },
      {
        id: "p2",
        title: "Urban Green Spaces",
        text: "City parks do more than beautify neighbourhoods. Recent studies show that people living within 300 metres of green space report significantly lower stress levels. Trees also cool the air: a single mature tree can transpire over 400 litres of water per day. Urban planners now treat parks as essential infrastructure rather than decoration.",
        questions: [
          { id: "r1q5", kind: "gap", text: "People living within ___ metres of green space report lower stress. (number)", answer: "300", explanation: "Stated directly in the passage." },
          { id: "r1q6", kind: "mcq", text: "A mature tree can transpire over ___ litres of water per day.", answer: "400", options: ["100", "200", "400", "800"], explanation: "Stated directly in the passage." },
        ],
      },
    ],
  },
  {
    id: "writing-task-2-1",
    type: "writing",
    title: "Writing Task 2 — Opinion Essay",
    description: "250+ words · 40 minutes. AI band-score feedback on all 4 criteria.",
    durationMin: 40,
    questions: 1,
    difficulty: "Medium",
    prompt:
      "Some people believe that unpaid community service should be a compulsory part of high school programmes (for example, working for a charity, improving the neighbourhood, or teaching sports to younger children). To what extent do you agree or disagree?",
    minWords: 250,
  },
  {
    id: "writing-task-1-1",
    type: "writing",
    title: "Writing Task 1 — Bar Chart Report",
    description: "150+ words · 20 minutes. Describe trends, compare data, overview paragraph.",
    durationMin: 20,
    questions: 1,
    difficulty: "Easy",
    prompt:
      "The chart below shows the percentage of households in three countries that owned a computer from 2000 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    minWords: 150,
  },
  // OLD listening-test-1 demo REMOVED — replaced by full 40-question test in allExams
  {
    id: "speaking-part-1-1",
    type: "speaking",
    title: "Speaking Part 1 — Hometown & Study",
    description: "8 questions · record or type answers · AI fluency feedback.",
    durationMin: 12,
    questions: 8,
    difficulty: "Easy",
    cueCards: [
      "Where is your hometown?",
      "What do you like most about your hometown?",
      "Are you a student or do you work?",
      "What subject are you studying / what is your job?",
      "Do you enjoy your studies / work? Why?",
      "How do you usually spend your evenings?",
      "Do you prefer mornings or evenings? Why?",
      "Have you ever lived in another city?",
    ],
  },
  {
    id: "speaking-part-2-1",
    type: "speaking",
    title: "Speaking Part 2 — Cue Card",
    description: "1 minute prep · 2 minute talk · AI coherence & lexical feedback.",
    durationMin: 10,
    questions: 1,
    difficulty: "Medium",
    cueCards: [
      "Describe a book you recently read. You should say: what the book was, who wrote it, what it was about — and explain why you enjoyed it.",
    ],
  },
  ...allExams,
];

export function getExamById(id) {
  return sampleExams.find((e) => e.id === id) ?? null;
}

export function getExamsByType(type) {
  return sampleExams.filter((e) => e.type === type);
}