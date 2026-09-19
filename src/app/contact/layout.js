import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "Contact IELTS Master",
  description:
    "Questions, bug reports or feature requests? Send us a message and we'll reply within a couple of days.",
  path: "/contact",
  noindex: false,
});

export default function Layout({ children }) {
  return children;
}
