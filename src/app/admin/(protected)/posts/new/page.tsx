import type { Metadata } from "next";
import Link from "next/link";

import { PostForm } from "@/components/post-form";

export const metadata: Metadata = {
  title: "New post",
};

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/posts"
          className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
        >
          ← Back to posts
        </Link>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
          New post
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Write it as a draft first. Nothing is public until you change the
          status to published.
        </p>
      </div>

      <PostForm />
    </div>
  );
}
