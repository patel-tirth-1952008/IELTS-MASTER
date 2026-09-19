import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "Full IELTS mock test online",
  description:
    "Sit a free IELTS mock test \u2014 reading, writing, listening and speaking in one timed flow with AI band feedback.",
  path: "/mock-test",
  noindex: false,
});

export default function Layout({ children }) {
  return children;
}
