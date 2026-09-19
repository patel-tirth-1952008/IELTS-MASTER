import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExamListFilter from "@/components/ExamListFilter";
import { getExamsByType } from "@/data/sampleExams";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "IELTS Speaking Practice — Cue Cards & AI Feedback",
  description:
    "Practise IELTS speaking cue cards by voice or typing and get instant AI feedback on fluency, lexical resource and grammar. Free, no booking required.",
  path: "/speaking",
  keywords: ["ielts speaking practice", "ielts speaking test", "free ielts speaking"],
});

// Static content: prerendered at build time and refreshed hourly, so the
// CDN serves the HTML without rebuilding for every visitor.
export const revalidate = 3600;

export default function SpeakingPage() {
  const exams = getExamsByType("speaking");
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/speaking" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Speaking" }]} />
          <h1 className="type-h1">Speaking practice</h1>
          <p className="type-lead mt-1">Cue cards · record or type · AI fluency feedback.</p>
          <div className="mt-6">
            <ExamListFilter exams={exams} practicePath="/practice/speaking" />
          </div>
        </div>
      </main>
    </div>
  );
}
