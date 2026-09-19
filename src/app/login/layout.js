import { pageMetadata } from "@/lib/site";

// Segment-level metadata: this route's page is a client component, so the
// unique title/description/canonical live here (still server-rendered).
export const metadata = pageMetadata({
  title: "Sign in to your account",
  description:
    "Sign in to IELTS Master to continue your IELTS practice, see your band scores and track your study streak.",
  path: "/login",
  noindex: false,
});

export default function Layout({ children }) {
  return children;
}
