import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "IELTS listening practice test",
  description:
    "Timed IELTS listening sections with instant scoring, transcripts and band conversion.",
  path: "/practice/listening",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}
