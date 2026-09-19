import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "Your progress dashboard",
  description:
    "Your IELTS band averages by skill, study streak, recent attempts and personalised next steps.",
  path: "/dashboard",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}
