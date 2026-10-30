import type { Metadata } from "next";
import Link from "next/link";

import { getAdminStats } from "@/lib/admin-data";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Overview",
};

const cards = [
  {
    key: "pendingComments",
    label: "Comments to check",
    href: "/admin/comments",
    tone: "signal",
  },
  {
    key: "pendingReviews",
    label: "Reviews to check",
    href: "/admin/reviews",
    tone: "brass",
  },
  {
    key: "publishedPosts",
    label: "Published posts",
    href: "/admin/posts",
    tone: "forest",
  },
  {
    key: "draftPosts",
    label: "Drafts",
    href: "/admin/posts",
    tone: "muted",
  },
] as const;

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Studio overview
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Keep the good stuff.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Everything here is private until you approve it. Check the person,
          the exact words, and the permission before publishing.
        </p>
      </div>

      {!isDatabaseConfigured() ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          The database is not connected. Add{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            DATABASE_URL
          </code>{" "}
          to the environment before using posts, comments, or reviews.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-3xl border border-border bg-card p-5 transition-transform hover:-translate-y-0.5"
          >
            <span
              className={
                card.tone === "signal"
                  ? "block size-2.5 rounded-full bg-signal"
                  : card.tone === "brass"
                    ? "block size-2.5 rounded-full bg-brass"
                    : card.tone === "forest"
                      ? "block size-2.5 rounded-full bg-primary"
                      : "block size-2.5 rounded-full bg-muted-foreground/40"
              }
              aria-hidden="true"
            />
            <p className="mt-5 text-3xl font-semibold tabular-nums">
              {stats[card.key]}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
            <span className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Open
              <span className="ml-2 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Publishing rules
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Reviews:</strong> publish
              only real clients, with their consent. Mark someone as verified
              only after checking them against your project records.
            </li>
            <li>
              <strong className="text-foreground">Comments:</strong> approve
              useful discussion. Remove spam, abuse, private information, and
              anything unlawful. Do not remove a comment just because it is
              critical.
            </li>
            <li>
              <strong className="text-foreground">Posts:</strong> write in
              Markdown, keep the excerpt short, and publish when it is ready.
              The RSS feed and sitemap update with the post.
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-brand-muted">
            Quick actions
          </p>
          <div className="mt-4 space-y-2">
            <Link
              href="/admin/posts/new"
              className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/15"
            >
              Write a new post <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/admin/comments"
              className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/15"
            >
              Moderate comments <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/admin/reviews"
              className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/15"
            >
              Moderate reviews <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
