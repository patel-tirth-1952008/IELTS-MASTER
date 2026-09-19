import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "IELTS grammar gym",
  description:
    "Fix the grammar mistakes that cost IELTS writing marks: 8 topic quizzes plus instant AI sentence checking.",
  path: "/grammar",
  noindex: false,
});

export default function Layout({ children }) {
  return children;
}
