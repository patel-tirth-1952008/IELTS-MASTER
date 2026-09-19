import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "IELTS speaking practice test",
  description:
    "Practise IELTS speaking cue cards by voice or typing and get AI feedback on fluency, lexis and grammar.",
  path: "/practice/speaking",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}
