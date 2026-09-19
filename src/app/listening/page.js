import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExamListFilter from "@/components/ExamListFilter";
import { getExamsByType } from "@/data/sampleExams";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "IELTS Listening Practice Tests — Free Online",
  description:
    "Free IELTS listening practice with instant scoring, answer review and band conversion. Train the question types that cost most candidates marks.",
  path: "/listening",
  keywords: ["ielts listening practice", "ielts listening test", "free ielts listening"],
});

// Static content: prerendered at build time and refreshed hourly, so the
// CDN serves the HTML without rebuilding for every visitor.
export const revalidate = 3600;

export default function ListeningPage() {
  const exams = getExamsByType("listening");
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/listening" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Listening" }]} />
          <h1 className="type-h1">Listening practice</h1>
          <p className="type-lead mt-1">Transcript-based demo tests · auto-scored answers.</p>
          <div className="mt-6">
            <ExamListFilter exams={exams} practicePath="/practice/listening" />
          </div>
        </div>
      </main>
    </div>
  );
}
