import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExamListFilter from "@/components/ExamListFilter";
import { getExamsByType } from "@/data/sampleExams";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "IELTS Reading Practice Tests — Free & Instantly Scored",
  description:
    "Free IELTS Academic reading practice: timed passages, True/False/Not Given, matching and gap-fill questions with instant band scores and full answer explanations.",
  path: "/reading",
  keywords: ["ielts reading practice", "ielts reading test", "free ielts reading"],
});

// Static content: prerendered at build time and refreshed hourly, so the
// CDN serves the HTML without rebuilding for every visitor.
export const revalidate = 3600;

export default function ReadingPage() {
  const exams = getExamsByType("reading");
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/reading" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Reading" }]} />
          <h1 className="type-h1">Reading practice</h1>
          <p className="type-lead mt-1">Timed passages · instant band conversion · full answer review.</p>
          <div className="mt-6">
            <ExamListFilter exams={exams} practicePath="/practice/reading" />
          </div>
        </div>
      </main>
    </div>
  );
}
