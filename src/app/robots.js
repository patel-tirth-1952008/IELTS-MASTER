import { SITE } from "@/lib/site";

// Generated as /robots.txt. Private + auth surfaces are kept out of the
// index; everything a learner could land on is open.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/practice/",
          "/login",
          "/register",
          "/thank-you",
          "/_next/",
        ],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
