const fallbackSiteUrl = "https://example.com";
const fallbackEmail = "hello@example.com";

function normalizeSiteUrl(value: string | undefined) {
  const candidate = value?.trim();

  if (!candidate) {
    return fallbackSiteUrl;
  }

  try {
    return new URL(candidate).origin;
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an absolute URL, for example https://reeper.dev.",
    );
  }
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || fallbackEmail;

export const site = {
  name: "Reeper",
  wordmark: "reeper",
  role: "Independent web developer",
  tagline: "Websites built to earn their keep.",
  location: "Johannesburg, South Africa",
  shortLocation: "Johannesburg",
  timeZone: "Africa/Johannesburg",
  email,
  url: siteUrl,
  description:
    "Independent web developer in Johannesburg, building fast, considered websites and web apps for small teams.",
  contentUpdated: "2026-10-29",
  legalUpdated: "29 October 2026",
  legalUpdatedIso: "2026-10-29",
  availability: "Available for Q4 2026",
  availabilityNote: "Taking on two new projects this quarter.",
  socials: [
    { label: "GitHub", href: "https://github.com/reeperx" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/reeperx" },
    { label: "Email", href: `mailto:${email}` },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export type Service = {
  title: string;
  timeline: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    title: "Launch site",
    timeline: "2–4 weeks",
    description:
      "For a new product, studio, or service that needs a site people trust.",
    deliverables: [
      "Design direction and page design",
      "A Next.js build, with a CMS where it helps",
      "Analytics, SEO, and a Vercel deploy",
    ],
  },
  {
    title: "Web app",
    timeline: "4–8 weeks",
    description:
      "For a focused product surface, internal tool, or client portal.",
    deliverables: [
      "Auth, data model, and API",
      "Payments or billing where needed",
      "Tests and a clean handover",
    ],
  },
  {
    title: "Rescue",
    timeline: "1–2 weeks",
    description:
      "For a site that is slow, hard to update, or quietly broken.",
    deliverables: [
      "Performance and accessibility fixes",
      "Dependency and security cleanup",
      "Notes on what changed and why",
    ],
  },
];

export const tools = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Postgres",
  "Vercel",
  "Figma",
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
  /** Whole-number rating from 1 to 5. Only publish real ratings. */
  rating: number;
  /** Marks fabricated copy and ratings that must be replaced before launch. */
  placeholder?: boolean;
};

// Replace all three sample slides with real client words, photos, and ratings
// (with permission) before launch. Do not ship a testimonial or rating that
// nobody actually gave.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Reeper rebuilt our site in three weeks and it has paid for itself twice over. He asks better questions than the agencies we spoke to, and then he actually ships.",
    name: "Thandi M.",
    role: "Founder, Fieldnote",
    image: "/testimonials/portrait-1.jpg",
    rating: 5,
    placeholder: true,
  },
  {
    quote:
      "A real client quote goes here. This slide is a placeholder so you can see how the carousel works with more than one testimonial.",
    name: "Client name",
    role: "Role, company",
    image: "/testimonials/portrait-2.jpg",
    rating: 5,
    placeholder: true,
  },
  {
    quote:
      "A second client quote goes here. Swap in the words of someone you have worked with, with their permission.",
    name: "Client name",
    role: "Role, company",
    image: "/testimonials/portrait-3.jpg",
    rating: 5,
    placeholder: true,
  },
];
