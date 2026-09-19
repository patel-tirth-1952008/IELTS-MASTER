import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExamListFilter from "@/components/ExamListFilter";
import { getExamsByType } from "@/data/sampleExams";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "IELTS Writing Practice with AI Feedback (Task 1 & 2)",
  description:
    "Practise IELTS Writing Task 1 and Task 2 free. Submit your essay and get AI band feedback on all four official criteria plus model answer suggestions.",
  path: "/writing",
  keywords: ["ielts writing practice", "ielts writing test", "free ielts writing"],
});

// Static content: prerendered at build time and refreshed hourly, so the
// CDN serves the HTML without rebuilding for every visitor.
export const revalidate = 3600;

export default function WritingPage() {
  const exams = getExamsByType("writing");
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/writing" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Writing" }]} />
          <h1 className="type-h1">Writing practice</h1>
          <p className="type-lead mt-1">Task 1 & 2 · AI examiner marks all 4 criteria.</p>
          <div className="mt-6">
            <ExamListFilter exams={exams} practicePath="/practice/writing" />
          </div>
        </div>
      </main>
    </div>
  );
}
