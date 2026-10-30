import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import { getPublishedPosts } from "@/lib/community-data";
import { formatDate } from "@/lib/format";
import { openGraphImage, twitterImage } from "@/lib/seo";
import {
  buildBlogIndexSchema,
  buildBreadcrumbSchema,
} from "@/lib/structured-data";

const description =
  "Notes on building fast, considered websites and web apps for small teams in South Africa.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/blog",
    siteName: site.name,
    title: `Blog — ${site.name}`,
    description,
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog — ${site.name}`,
    description,
    images: [twitterImage],
  },
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd
        data={[
          buildBlogIndexSchema(posts),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-12 lg:py-32"
      >
        <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              The journal
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Notes from the workshop.
            </h1>
          </div>
          <div className="max-w-sm lg:text-right">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Practical notes on websites, performance, and the work behind
              them. New writing most weeks.
            </p>
            <a
              href="/blog/rss.xml"
              className="mt-3 inline-flex text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              Follow by RSS
            </a>
          </div>
        </div>

        {!featured ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-8 sm:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              First post coming
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              The journal is open. The first note is being written.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              There is nothing published here yet. When a post goes live, it
              will appear on this page, in the RSS feed, and in the sitemap.
            </p>
          </div>
        ) : (
          <>
            <article className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <Link
                href={`/blog/${featured.slug}`}
                className="group block overflow-hidden rounded-3xl border border-border bg-card"
              >
                {featured.coverImageUrl ? (
                  // The cover URL is authored in the admin editor.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImageUrl}
                    alt={featured.coverImageAlt ?? ""}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="flex aspect-[16/10] flex-col justify-between bg-primary p-7 text-primary-foreground">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-on-brand-muted">
                      Latest note
                    </span>
                    <span className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
                      {featured.title}
                    </span>
                  </div>
                )}
              </Link>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {featured.publishedAt
                    ? formatDate(featured.publishedAt)
                    : "Coming soon"}
                </p>
                <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.05em]">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="transition-colors hover:text-link"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
                  >
                    Read the note
                  </Link>
                  {featured.tags.length > 0 ? (
                    <span className="text-xs text-muted-foreground">
                      {featured.tags.join(" · ")}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>

            {rest.length > 0 ? (
              <section aria-labelledby="more-posts" className="mt-16">
                <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                  <h2
                    id="more-posts"
                    className="font-display text-2xl font-semibold tracking-[-0.04em]"
                  >
                    More notes
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {rest.length} more
                  </span>
                </div>
                <ul className="divide-y divide-border">
                  {rest.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group grid gap-3 py-6 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline"
                      >
                        <span className="text-xs text-muted-foreground">
                          {post.publishedAt
                            ? formatDate(post.publishedAt)
                            : "Draft"}
                        </span>
                        <span>
                          <span className="block font-display text-xl font-semibold tracking-[-0.03em] transition-colors group-hover:text-link">
                            {post.title}
                          </span>
                          <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {post.excerpt}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="hidden text-lg text-muted-foreground transition-transform group-hover:translate-x-1 sm:block"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
