import { site } from "@/content/site";

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

export function siteHost() {
  return new URL(site.url).host;
}

const imageAlt = `${site.name} — ${site.tagline}`;

export const openGraphImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: imageAlt,
} as const;

export const twitterImage = {
  url: "/twitter-image",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: imageAlt,
} as const;
