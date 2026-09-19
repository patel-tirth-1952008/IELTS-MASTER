// Single source of truth for site metadata (used by pages, sitemap, JSON-LD).
const RAW_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const SITE = {
  name: "IELTS Master",
  shortName: "IELTS Master",
  url: RAW_URL.replace(/\/$/, ""),
  tagline: "Free AI-Powered IELTS Preparation",
  description:
    "Practise IELTS reading, writing, listening and speaking free, and get instant AI band scores, model answers and a personalised study plan. No credit card, no paywall.",
  keywords: [
    "IELTS practice test",
    "free IELTS preparation",
    "IELTS reading practice",
    "IELTS writing task 2 feedback",
    "IELTS listening test",
    "IELTS speaking practice",
    "AI IELTS band score",
    "IELTS mock test online",
    "IELTS vocabulary flashcards",
    "band 8 IELTS tips",
  ],
  locale: "en_IN",
  twitter: "@ieltsmaster",
  themeColor: "#F59E0B",
  contactEmail: "hello@ieltsmaster.app",
};

/** Canonical + social metadata for one page. */
export function pageMetadata({
  title,
  description,
  path = "/",
  noindex = false,
  keywords = [],
  type = "website",
}) {
  const url = `${SITE.url}${path === "/" ? "" : path}`;
  const fullTitle = title; // root layout applies the "%s · IELTS Master" template
  return {
    title: fullTitle,
    description: description ?? SITE.description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: path },
    robots: noindex
      ? { index: false, follow: true, nocache: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title: `${fullTitle} · ${SITE.name}`,
      description: description ?? SITE.description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: `${SITE.name} — ${SITE.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullTitle} · ${SITE.name}`,
      description: description ?? SITE.description,
      images: ["/og.jpg"],
    },
  };
}

/** JSON-LD blocks for rich results. */
export function structuredData({ faqs = [], course = true } = {}) {
  const org = {
    "@type": "EducationalOrganization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.contactEmail,
    areaServed: "Worldwide",
    sameAs: [],
  };

  const site = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/leaderboard?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const blocks = [org, site];

  if (course) {
    blocks.push({
      "@type": "Course",
      name: "Free IELTS Preparation with AI Feedback",
      description: SITE.description,
      provider: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", category: "free" },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT20H",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1264",
      },
    });
  }

  if (faqs.length) {
    blocks.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": blocks };
}
