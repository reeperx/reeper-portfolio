import type { NextConfig } from "next";

if (
  process.env.VERCEL_ENV === "production" &&
  (!process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    !process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim())
) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_CONTACT_EMAIL are required for production deployments.",
  );
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep the fixed sidebar and CTAs clear while developing.
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    // Keep Turbopack scoped to this project: a stray lockfile lives in $HOME.
    root: __dirname,
  },
};

export default nextConfig;
