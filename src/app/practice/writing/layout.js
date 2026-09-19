import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "IELTS writing practice test",
  description:
    "Write IELTS task 1 or task 2 under exam timing and get AI band feedback on all four criteria.",
  path: "/practice/writing",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}
