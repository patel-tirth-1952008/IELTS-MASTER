import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "Weekly IELTS band leaderboard",
  description:
    "See this week's top IELTS Master learners by average band score, and compare your own progress.",
  path: "/leaderboard",
  noindex: false,
});

export default function Layout({ children }) {
  return children;
}
