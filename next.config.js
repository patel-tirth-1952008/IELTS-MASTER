/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy: no external script origins except optional GA,
// no framing, no object embeds, mic allowed for the speaking test only.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
  reactStrictMode: true,

  // ── SPEED ────────────────────────────────────────────────
  // Gzip/Brotli every response instead of shipping raw JSON/HTML.
  compress: true,
  // Strip the X-Powered-By header (tiny payload win + less fingerprinting).
  poweredByHeader: false,
  // Don't ship source maps to the browser in production.
  productionBrowserSourceMaps: false,

  experimental: {
    // Tree-shake barrel-file packages: only the Lucide icons actually used
    // get bundled (big win — lucide-react has ~1000 exports).
    optimizePackageImports: ["lucide-react", "chart.js", "react-chartjs-2"],
    // Client-side router cache: revisiting a page inside this window is
    // instant with no server round-trip (no blink, no refetch).
    staleTimes: { dynamic: 30, static: 300 },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        // Security headers on every document + API response.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            // Microphone is required by the speaking test (Web Speech API).
            value: "camera=(), geolocation=(), microphone=(self), payment=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      {
        // Hashed build assets never change → cache them forever at the edge.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Static public files: cache for a week, revalidate in background.
        source: "/:all(icon.svg|apple-icon.svg|manifest.webmanifest|favicon.ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      // Note: /api/* Cache-Control is set per-route by withApiGuard
      // (no-store by default, s-maxage for public catalogue endpoints), so
      // there is deliberately no blanket rule here — two rules would send
      // two conflicting Cache-Control headers.
    ];
  },

  async redirects() {
    return [
      { source: "/practice", destination: "/practice/reading", permanent: false },
      { source: "/signup", destination: "/register", permanent: true },
      { source: "/signin", destination: "/login", permanent: true },
    ];
  },
};

module.exports = nextConfig;
