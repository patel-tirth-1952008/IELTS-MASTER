import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "IELTS reading practice test",
  description:
    "Timed IELTS reading passages with instant answer review, band conversion and explanations.",
  path: "/practice/reading",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}
