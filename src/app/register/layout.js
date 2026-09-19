import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "Create your free account",
  description:
    "Create a free IELTS Master account: AI band scores, full practice tests, vocabulary and a personalised study plan. No credit card needed.",
  path: "/register",
  noindex: false,
});

export default function Layout({ children }) {
  return children;
}
