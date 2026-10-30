import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogShare } from "@/components/blog-share";
import { CommentSection } from "@/components/comment-section";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import {
  getCommentsForPost,
  getPostBySlug,
} from "@/lib/community-data";
import { formatDate, readingTime } from "@/lib/format";
import { absoluteUrl, openGraphImage } from "@/lib/seo";
import {
  buildBlogPostSchema,
  buildBreadcrumbSchema,
} from "@/lib/structured-data";
import { getPageViewerHash } from "@/lib/visitor";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
      robots: { index: false, follow: false },
    };
  }

  const image = post.coverImageUrl
    ? [{ url: post.coverImageUrl, alt: post.coverImageAlt ?? post.title }]
    : [openGraphImage];

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${post.slug}`,
      types: {
        "application/rss+xml": "/blog/rss.xml",
      },
    },
    openGraph: {
      type: "article",
      locale: "en_ZA",
      url: `/blog/${post.slug}`,
      siteName: site.name,
      title: `${post.title} — ${site.name}`,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [site.name],
      tags: post.tags,
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — ${site.name}`,
      description: post.excerpt,
      images: image,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const viewerHash = await getPageViewerHash();
  const comments = await getCommentsForPost(post.id, viewerHash);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const minutes = readingTime(post.content);

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostSchema(post),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-4xl px-6 py-20 lg:px-10 lg:py-28"
      >
        <Link
          href="/blog"
          className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          ← All notes
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>{minutes} min read</span>
            {post.tags.length > 0 ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.tags.join(" · ")}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
            {post.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-7">
            <BlogShare url={url} title={post.title} />
          </div>
        </header>

        {post.coverImageUrl ? (
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card">
            {/* The cover URL is authored in the admin editor. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt ?? ""}
              className="aspect-[16/9] w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        ) : null}

        <article className="mt-12">
          <Markdown content={post.content} />
        </article>

        <div className="mt-12 border-t border-border pt-6">
          <BlogShare url={url} title={post.title} />
        </div>

        <aside className="mt-12 rounded-3xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Written by
          </p>
          <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em]">
            {site.name} — {site.role}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            I build fast, considered websites and web apps for small teams in{" "}
            {site.location}. If you want to talk through a project,{" "}
            <Link
              href="/#contact"
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              start a conversation
            </Link>
            .
          </p>
        </aside>

        <CommentSection postSlug={post.slug} comments={comments} />
      </main>
      <SiteFooter />
    </>
  );
}
