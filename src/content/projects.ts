/**
 * Snapshot of the Vercel `reeperxs-projects` scope, synced 2026-10-27.
 *
 * Source: `vercel project ls --limit 100 --json`, followed by the Vercel REST
 * API (`/v9/projects/:id`) for production aliases and deployment state.
 *
 * 37 projects were found. The 19 public, visually complete productions are
 * published below; the other 18 are recorded so nothing silently disappears.
 * Screenshots are real viewport captures of the production URLs, not mockups.
 */

export type WorkProject = {
  vercelProject: string;
  name: string;
  href: string;
  image: string;
  imageAlt: string;
  summary: string;
  tags: string[];
  year: string;
  createdAt: string;
  framework: string;
};

export type SkippedProjectStatus =
  | "private"
  | "offline"
  | "api"
  | "placeholder"
  | "incomplete"
  | "duplicate";

export type SkippedProject = {
  vercelProject: string;
  name: string;
  href: string;
  status: SkippedProjectStatus;
  note: string;
  createdAt: string;
  framework: string | null;
};

export const publishedProjects: WorkProject[] = [
  {
    vercelProject: "ngobz-mobile",
    name: "NGOBZ Mobile",
    href: "https://ngobz-mobile.vercel.app",
    image: "/projects/ngobz-mobile.jpg",
    imageAlt:
      "NGOBZ Mobile homepage showing mobile cooler and warmer rentals.",
    summary:
      "Mobile cold rooms, food warmers, and VIP portable restrooms for events across Pretoria and Gauteng. A fast quote flow, a live fleet showcase, and a site built to convert urgent enquiries.",
    tags: ["Next.js", "Booking"],
    year: "2026",
    createdAt: "2026-08-28",
    framework: "Next.js",
  },
  {
    vercelProject: "abelamtours",
    name: "Maepa Maepa Tours",
    href: "https://abelamtours.vercel.app",
    image: "/projects/abelamtours.jpg",
    imageAlt:
      "Maepa Maepa Tours homepage with safari and shuttle booking search.",
    summary:
      "A booking-led site for a South African tour operator: curated packages, modern passenger shuttles, and a searchable trip planner with ZAR pricing.",
    tags: ["Next.js", "Travel"],
    year: "2026",
    createdAt: "2026-08-25",
    framework: "Next.js",
  },
  {
    vercelProject: "shammah2",
    name: "Shammah Funeral Home",
    href: "https://shammah2.vercel.app",
    image: "/projects/shammah2.jpg",
    imageAlt:
      "Shammah Funeral Home homepage with funeral cover and support options.",
    summary:
      "A dignified, 24/7 funeral services site for families across Hammanskraal, Pretoria, and Gauteng, covering funeral cover, catering, tombstones, and support.",
    tags: ["Next.js", "Funeral services"],
    year: "2026",
    createdAt: "2026-08-18",
    framework: "Next.js",
  },
  {
    vercelProject: "idea-one",
    name: "IdeaOne",
    href: "https://idea-one-mu.vercel.app",
    image: "/projects/idea-one.jpg",
    imageAlt:
      "IdeaOne landing page for an AI-powered social media scheduler.",
    summary:
      "An AI social media scheduler for planning and publishing across Twitter, Instagram, LinkedIn, Facebook, and TikTok from one Kanban board.",
    tags: ["Next.js", "AI"],
    year: "2026",
    createdAt: "2026-08-07",
    framework: "Next.js",
  },
  {
    vercelProject: "agency",
    name: "TOGB Agency",
    href: "https://agency-peach-eight.vercel.app",
    image: "/projects/agency.jpg",
    imageAlt:
      "TOGB agency homepage with a dark hero and a call to discuss a project.",
    summary:
      "The studio site for TOGB, a South African web development agency: services, selected projects, and a direct enquiry path.",
    tags: ["Next.js", "Agency"],
    year: "2025",
    createdAt: "2025-03-06",
    framework: "Next.js",
  },
  {
    vercelProject: "the-chronicle",
    name: "The Chronicle",
    href: "https://the-chronicle-ten.vercel.app",
    image: "/projects/the-chronicle.jpg",
    imageAlt:
      "The Chronicle homepage with a featured technology article and trending stories.",
    summary:
      "A full editorial and commerce front end for Thabo Bester: long-form articles, curated products, live search, and account flows.",
    tags: ["React", "Vite", "Editorial"],
    year: "2025",
    createdAt: "2025-06-07",
    framework: "Vite",
  },
  {
    vercelProject: "mathonsi",
    name: "Mathonsi Funeral Services",
    href: "https://mathonsi-gamma.vercel.app",
    image: "/projects/mathonsi.jpg",
    imageAlt:
      "Mathonsi Funeral Services homepage with a dark reception area and service links.",
    summary:
      "A calm, respectful funeral services site for families in Gauteng, with services, packages, and a clear path to speak to a consultant.",
    tags: ["React", "Vite"],
    year: "2025",
    createdAt: "2025-05-22",
    framework: "Vite",
  },
  {
    vercelProject: "elanga",
    name: "Elanga East Lodge",
    href: "https://elanga-seven.vercel.app",
    image: "/projects/elanga.jpg",
    imageAlt:
      "Elanga East Lodge homepage with safari lodge photography and booking search.",
    summary:
      "A luxury safari lodge site with room discovery, date-based booking search, and a visual introduction to the lodge and its surroundings.",
    tags: ["Next.js", "Hospitality"],
    year: "2025",
    createdAt: "2025-01-29",
    framework: "Next.js",
  },
  {
    vercelProject: "ibsolutions",
    name: "IB Solutions",
    href: "https://ibsolutions.vercel.app",
    image: "/projects/ibsolutions.jpg",
    imageAlt:
      "IB Solutions homepage with a strategic marketing and communications hero.",
    summary:
      "A brand and marketing site for Immaculate Business Solutions, focused on strategic communications, content, and business growth.",
    tags: ["Next.js", "Marketing"],
    year: "2025",
    createdAt: "2025-01-16",
    framework: "Next.js",
  },
  {
    vercelProject: "security",
    name: "Integraserve",
    href: "https://security-five-gamma.vercel.app",
    image: "/projects/security.jpg",
    imageAlt:
      "Integraserve security training welcome screen with sign-in and sign-up.",
    summary:
      "A security-training platform landing page with a quiz-led learning experience and clear sign-in and sign-up entry points.",
    tags: ["Next.js", "Security"],
    year: "2025",
    createdAt: "2025-01-27",
    framework: "Next.js",
  },
  {
    vercelProject: "carwash",
    name: "Keletso's Sound System",
    href: "https://carwash-olive.vercel.app",
    image: "/projects/carwash.jpg",
    imageAlt:
      "Keletso's Sound System homepage with event audio packages and a reservation call to action.",
    summary:
      "A booking site for a premium sound and event audio business, with packages, availability, and a direct reservation path.",
    tags: ["Next.js", "Events"],
    year: "2025",
    createdAt: "2025-04-28",
    framework: "Next.js",
  },
  {
    vercelProject: "tales",
    name: "Tales",
    href: "https://tales-silk.vercel.app",
    image: "/projects/tales.jpg",
    imageAlt:
      "Tales homepage for an AI-powered children's story generator.",
    summary:
      "An AI story generator that turns a simple prompt into a personalised, illustrated children's story in minutes.",
    tags: ["Next.js", "AI"],
    year: "2024",
    createdAt: "2024-11-17",
    framework: "Next.js",
  },
  {
    vercelProject: "v0-whop-website",
    name: "Whop Builder AI",
    href: "https://v0-whop-website.vercel.app",
    image: "/projects/v0-whop-website.jpg",
    imageAlt:
      "Whop Builder AI landing page with an AI business setup prompt.",
    summary:
      "A v0-built landing page for an AI tool that helps creators turn a business idea into a Whop setup plan and launch strategy.",
    tags: ["Next.js", "v0", "AI"],
    year: "2025",
    createdAt: "2025-04-16",
    framework: "Next.js",
  },
  {
    vercelProject: "ai-togb",
    name: "TOGB AI",
    href: "https://ai-togb.vercel.app",
    image: "/projects/ai-togb.jpg",
    imageAlt:
      "TOGB AI homepage with a yellow and black hero for AI video production.",
    summary:
      "A conversion-focused landing page for an AI video studio producing long- and short-form content for brands.",
    tags: ["Next.js", "AI"],
    year: "2025",
    createdAt: "2025-03-03",
    framework: "Next.js",
  },
  {
    vercelProject: "full-stack-doctor-website",
    name: "Full Stack Doctor",
    href: "https://full-stack-doctor-website.vercel.app",
    image: "/projects/full-stack-doctor-website.jpg",
    imageAlt:
      "Full Stack Doctor homepage with a therapist booking call to action.",
    summary:
      "A doctor and patient portal for booking appointments, managing prescriptions, and connecting patients with the right specialist.",
    tags: ["Next.js", "Healthcare"],
    year: "2024",
    createdAt: "2024-11-05",
    framework: "Next.js",
  },
  {
    vercelProject: "patient-appointment-app",
    name: "DocPulse",
    href: "https://patient-appointment-app.vercel.app",
    image: "/projects/patient-appointment-app.jpg",
    imageAlt:
      "DocPulse appointment form with a doctor photograph and booking fields.",
    summary:
      "A patient appointment system that captures the details once and gives clinics a clean, simple booking flow.",
    tags: ["Next.js", "Healthcare"],
    year: "2024",
    createdAt: "2024-07-09",
    framework: "Next.js",
  },
  {
    vercelProject: "naksnew",
    name: "Naks Funeral Services",
    href: "https://naksnew.vercel.app",
    image: "/projects/naksnew.jpg",
    imageAlt:
      "Naks Funeral Services homepage with funeral planning imagery and service navigation.",
    summary:
      "A complete funeral services site for Naks: packages, claims, gallery, and a family-first enquiry flow.",
    tags: ["Next.js", "Funeral services"],
    year: "2024",
    createdAt: "2024-09-02",
    framework: "Next.js",
  },
  {
    vercelProject: "doctor-app",
    name: "Doctor Portal",
    href: "https://doctor-app-henna.vercel.app",
    image: "/projects/doctor-app.jpg",
    imageAlt:
      "Doctor Portal homepage with therapist booking search and specialty links.",
    summary:
      "A clean healthcare portal for booking therapist sessions, searching specialists, and refilling prescriptions.",
    tags: ["Next.js", "Healthcare"],
    year: "2024",
    createdAt: "2024-11-04",
    framework: "Next.js",
  },
  {
    vercelProject: "planner",
    name: "Less Planner",
    href: "https://planner-pi-nine.vercel.app",
    image: "/projects/planner.jpg",
    imageAlt:
      "Less Planner homepage with an AI lesson plan call to action.",
    summary:
      "An AI lesson-planning workspace that helps teachers generate curriculum-aligned plans, templates, and classroom-ready material in seconds.",
    tags: ["Next.js", "AI", "Education"],
    year: "2024",
    createdAt: "2024-11-03",
    framework: "Next.js",
  },
];

export const skippedProjects: SkippedProject[] = [
  {
    vercelProject: "pdfy",
    name: "PDFY",
    href: "https://pdfy-delta.vercel.app",
    status: "offline",
    note: "Production deployment returns HTTP 500.",
    createdAt: "2024-07-25",
    framework: "Next.js",
  },
  {
    vercelProject: "kasi-ticker",
    name: "TICKETR",
    href: "https://kasi-ticker.vercel.app",
    status: "incomplete",
    note: "Production shows a Next.js starter with an empty ticketing view.",
    createdAt: "2025-11-28",
    framework: "Next.js",
  },
  {
    vercelProject: "learner",
    name: "Learner",
    href: "https://learner-two-rho.vercel.app",
    status: "private",
    note: "Production is blocked by a Vercel Security Checkpoint (HTTP 429).",
    createdAt: "2025-07-13",
    framework: "Next.js",
  },
  {
    vercelProject: "vidzer",
    name: "Vidzer",
    href: "https://vidzer.vercel.app",
    status: "offline",
    note: "Production returns HTTP 500.",
    createdAt: "2024-09-30",
    framework: "Next.js",
  },
  {
    vercelProject: "ecom",
    name: "gethanked.com",
    href: "https://ecom-nine-coral.vercel.app",
    status: "offline",
    note: "Production returns HTTP 500.",
    createdAt: "2024-11-15",
    framework: "Next.js",
  },
  {
    vercelProject: "tb",
    name: "Thabo Bester",
    href: "https://tb-theta.vercel.app",
    status: "placeholder",
    note: "The SPA shell loads with an empty root and no public content.",
    createdAt: "2025-06-07",
    framework: "Vite",
  },
  {
    vercelProject: "qsl",
    name: "QSL",
    href: "https://qsl-git-main-reeperxs-projects.vercel.app",
    status: "offline",
    note: "Production deployment is in an error state.",
    createdAt: "2024-04-25",
    framework: "Next.js",
  },
  {
    vercelProject: "blog-backend",
    name: "Blog Backend",
    href: "https://blog-backend-rho-lilac.vercel.app",
    status: "api",
    note: "API-only project; no public page (HTTP 404).",
    createdAt: "2024-12-17",
    framework: null,
  },
  {
    vercelProject: "test-blog-server",
    name: "Test Blog Server",
    href: "https://test-blog-server-sepia.vercel.app",
    status: "api",
    note: "API-only test server; no public page (HTTP 404).",
    createdAt: "2024-12-17",
    framework: null,
  },
  {
    vercelProject: "story",
    name: "Story",
    href: "https://story-murex.vercel.app",
    status: "offline",
    note: "Production returns HTTP 500.",
    createdAt: "2024-10-22",
    framework: "Next.js",
  },
  {
    vercelProject: "squi",
    name: "Squi",
    href: "https://squi-five.vercel.app",
    status: "offline",
    note: "Production is paused or returns HTTP 500.",
    createdAt: "2025-02-14",
    framework: "Next.js",
  },
  {
    vercelProject: "v0-next-js-convex-dashboard",
    name: "Convex Dashboard",
    href: "https://v0-next-js-convex-dashboard-reeperxs-projects.vercel.app",
    status: "offline",
    note: "Production deployment is in an error state (HTTP 404).",
    createdAt: "2025-02-28",
    framework: "Next.js",
  },
  {
    vercelProject: "evently",
    name: "Evently",
    href: "https://evently-smoky-theta.vercel.app",
    status: "offline",
    note: "Production returns HTTP 500.",
    createdAt: "2024-10-27",
    framework: "Next.js",
  },
  {
    vercelProject: "sample",
    name: "Thabo Bester (Sample)",
    href: "https://sample-tan.vercel.app",
    status: "offline",
    note: "Custom domain no longer resolves; Vercel aliases return HTTP 500.",
    createdAt: "2024-08-14",
    framework: "Next.js",
  },
  {
    vercelProject: "blog",
    name: "Thabo Bester Blog",
    href: "https://blog-delta-tawny-20.vercel.app",
    status: "placeholder",
    note: "Production shows a placeholder ‘Hello’ page with no content.",
    createdAt: "2024-11-09",
    framework: "Next.js",
  },
  {
    vercelProject: "blog-frontend",
    name: "Justice Unlocked",
    href: "https://blog-frontend-rho-ebon.vercel.app",
    status: "incomplete",
    note: "Front end loads but content is stuck on loading with backend errors.",
    createdAt: "2024-12-17",
    framework: "Vite",
  },
  {
    vercelProject: "togb-portfolio",
    name: "TOGB Portfolio",
    href: "https://togb-portfolio.vercel.app",
    status: "incomplete",
    note: "Landing page loads; scrolling throws a client-side exception.",
    createdAt: "2025-01-29",
    framework: "Next.js",
  },
  {
    vercelProject: "blogger",
    name: "The Chronicle (Vite)",
    href: "https://blogger-kohl-rho.vercel.app",
    status: "duplicate",
    note: "Duplicate Chronicle front end; same content as the-chronicle.",
    createdAt: "2025-06-12",
    framework: "Vite",
  },
];

export const vercelProjectCount =
  publishedProjects.length + skippedProjects.length;
