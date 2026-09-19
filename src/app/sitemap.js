import { SITE } from "@/lib/site";
import { sampleExams } from "@/data/sampleExams";

// Generated as /sitemap.xml. Static routes plus one entry per practice exam
// so long-tail searches ("IELTS academic reading test 1") can land here.
export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/reading", priority: 0.9, changeFrequency: "weekly" },
    { path: "/writing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/listening", priority: 0.9, changeFrequency: "weekly" },
    { path: "/speaking", priority: 0.9, changeFrequency: "weekly" },
    { path: "/mock-test", priority: 0.9, changeFrequency: "weekly" },
    { path: "/vocab", priority: 0.8, changeFrequency: "monthly" },
    { path: "/grammar", priority: 0.8, changeFrequency: "monthly" },
    { path: "/leaderboard", priority: 0.6, changeFrequency: "daily" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ].map((r) => ({
    url: `${SITE.url}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const examRoutes = sampleExams.flatMap((exam) => [
    {
      url: `${SITE.url}/practice/${exam.type}?exam=${exam.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]);

  return [...staticRoutes, ...examRoutes];
}
