import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "IELTS vocabulary flashcards",
  description:
    "Learn high-frequency IELTS academic vocabulary with spaced flashcards, example sentences and audio pronunciation.",
  path: "/vocab",
  noindex: false,
});

export default function Layout({ children }) {
  return children;
}
