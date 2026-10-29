import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { WorkGrid } from "@/components/work-grid";
import { publishedProjects, vercelProjectCount } from "@/content/projects";
import { site } from "@/content/site";
import { openGraphImage, twitterImage } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildWorkCollectionSchema,
} from "@/lib/structured-data";

const description =
  "A complete index of websites and web apps built by Reeper, an independent web developer in Johannesburg.";

export const metadata: Metadata = {
  title: "Selected work",
  description,
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/work",
    siteName: site.name,
    title: `Selected work — ${site.name}`,
    description,
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Selected work — ${site.name}`,
    description,
    images: [twitterImage],
  },
};

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWorkCollectionSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Selected work", path: "/work" },
          ]),
        ]}
      />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-12 lg:py-32"
      >
        <SectionHeading
          as="h1"
          id="work-heading"
          title="All work"
          aside={`${publishedProjects.length} public builds from ${vercelProjectCount} Vercel projects. Every row links to the live deployment.`}
        />

        <p className="mt-6 max-w-[56ch] text-[0.95rem] leading-relaxed text-muted-foreground">
          The complete public index: websites, booking flows, editorial fronts,
          and web apps built end to end. Private, API-only, incomplete, and
          offline deployments are excluded.
        </p>

        <h2 className="mt-10 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Project index
        </h2>

        <div className="mt-4">
          <WorkGrid
            projects={publishedProjects}
            totalVercelProjects={vercelProjectCount}
            pageSize={publishedProjects.length}
            showPagination={false}
          />
        </div>

        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
          Looking for the short version?{" "}
          <Link
            href="/#work"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Return to selected work
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
