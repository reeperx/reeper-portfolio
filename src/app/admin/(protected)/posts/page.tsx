import type { Metadata } from "next";
import Link from "next/link";

import { deletePostAction } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getAdminPosts } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Posts",
};

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Journal
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em]">
            Posts
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Write in Markdown. Published posts appear on the blog, in the RSS
            feed, and in the sitemap.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
            No posts yet.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Start with a draft. You can keep it private until it is ready.
          </p>
          <Link
            href="/admin/posts/new"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Write the first post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={
                        post.status === "published"
                          ? "rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary dark:text-sage"
                          : "rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                      }
                    >
                      {post.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.publishedAt
                        ? formatDate(post.publishedAt)
                        : `Updated ${formatDate(post.updatedAt)}`}
                    </span>
                  </div>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="mt-3 block font-display text-2xl font-semibold tracking-[-0.03em] hover:text-link"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    /blog/{post.slug}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  {post.status === "published" ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                    >
                      View
                    </Link>
                  ) : null}
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    Edit
                  </Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmSubmitButton
                      message={`Delete “${post.title}”? This also deletes its comments.`}
                      className="text-sm font-medium text-destructive underline decoration-destructive/30 underline-offset-4 hover:decoration-destructive"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
