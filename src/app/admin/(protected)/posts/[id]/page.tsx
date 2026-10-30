import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deletePostAction } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PostForm } from "@/components/post-form";
import { getAdminPostById } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Edit post",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const post = await getAdminPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/posts"
            className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            ← Back to posts
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
            Edit post
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Changes go live immediately when the post is published. Comments
            stay attached if you change the slug.
          </p>
        </div>

        <form action={deletePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmSubmitButton
            message={`Delete “${post.title}”? This also deletes its comments.`}
            className="rounded-full border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
          >
            Delete post
          </ConfirmSubmitButton>
        </form>
      </div>

      {saved ? (
        <p
          role="status"
          className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
        >
          Post saved. If it is published, the blog, RSS feed, and sitemap will
          update.
        </p>
      ) : null}

      <PostForm post={post} />
    </div>
  );
}
