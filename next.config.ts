import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep the fixed sidebar and CTAs clear while developing.
  devIndicators: false,
  turbopack: {
    // Keep Turbopack scoped to this project: a stray lockfile lives in $HOME.
    root: __dirname,
  },
};

export default nextConfig;
