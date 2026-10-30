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
      "NEXT_PUBLIC_SITE_URL must be an absolute URL, for example https://your-domain.com.",
    );
  }
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || fallbackEmail;

export const site = {
  name: "TOGB",
  wordmark: "TOGB",
  brandLine: "The Original Brand",
  legalName: "TOGB (The Original Brand)",
  role: "Independent web developer",
  tagline: "Websites built to earn their keep.",
  location: "Gauteng, South Africa",
  shortLocation: "Gauteng",
  timeZone: "Africa/Johannesburg",
  established: "2018",
  email,
  url: siteUrl,
  whatsapp: {
    label: "WhatsApp",
    e164: "+27717884230",
    href: "https://wa.me/27717884230",
  },
  description:
    "TOGB builds fast, considered websites and web apps for small teams in Gauteng, South Africa. Independent design, Next.js development, and deployment.",
  hero: {
    image: "/images/togb-hero.webp",
  },
  portrait: {
    image: "/images/togb-portrait-anime.webp",
    alt: "Anime-style portrait of the developer behind TOGB.",
  },
  contentUpdated: "2026-10-29",
  legalUpdated: "29 October 2026",
  legalUpdatedIso: "2026-10-29",
  availability: "Available for Q4 2026",
  availabilityNote: "Taking on two new projects this quarter.",
  socials: [
    { label: "GitHub", href: "https://github.com/reeperx" },
    { label: "Email", href: `mailto:${email}` },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Blog", href: "/blog" },
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

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "What does TOGB build?",
    answer:
      "TOGB builds launch sites, focused web apps, and rescues for small teams. Most projects use Next.js, React, and Tailwind CSS, with a CMS, payments, or integrations where they earn their place.",
  },
  {
    question: "Where is TOGB based?",
    answer:
      "TOGB is based in Gauteng, South Africa, and works remotely with clients across South Africa and beyond. You work directly with the developer doing the work.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A launch site usually takes two to four weeks, a focused web app four to eight weeks, and a rescue one to two weeks. The exact timeline is fixed in the proposal after a short brief.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Every project is scoped individually. After a short brief I send a fixed quote with the scope, timeline, and deliverables, so there are no hourly surprises. The quote is based on the work, not a template price.",
  },
  {
    question: "Do you work with clients outside Gauteng?",
    answer:
      "Yes. The studio is based in Gauteng and works remotely with teams across South Africa and internationally. Most communication happens over email, WhatsApp, or short video calls.",
  },
  {
    question: "What happens after launch?",
    answer:
      "You get a handover with the code, accounts, and notes you need to run the site. If you need ongoing support or improvements, we can agree on a separate arrangement.",
  },
  {
    question: "How do we start?",
    answer:
      "Send a short brief through the contact form or message me on WhatsApp. I reply within one business day with a plan, a timeline, and a price.",
  },
];
