"use client";

import Link from "next/link";
import { useActionState, useId } from "react";

import {
  savePostAction,
  type PostFormState,
} from "@/app/admin/actions";
import type { AdminPost } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: PostFormState = {};

function localDateTime(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PostForm({ post }: { post?: AdminPost }) {
  const [state, formAction, isPending] = useActionState(
    savePostAction,
    initialState,
  );
  const id = useId();
  const field = (name: string) => `${id}-${name}`;
  const errorFor = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="space-y-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      {state.error ? (
        <p
          role="alert"
          className="rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={field("title")}>Title</Label>
            <Input
              id={field("title")}
              name="title"
              defaultValue={post?.title ?? ""}
              required
              maxLength={140}
              aria-invalid={errorFor("title") ? true : undefined}
              className="h-11 rounded-xl border-border/80 bg-background/80 text-base"
            />
            {errorFor("title") ? (
              <p className="text-xs text-destructive">{errorFor("title")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={field("excerpt")}>Excerpt</Label>
            <Textarea
              id={field("excerpt")}
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              required
              maxLength={320}
              rows={3}
              aria-invalid={errorFor("excerpt") ? true : undefined}
              className="min-h-24 rounded-xl border-border/80 bg-background/80 text-base"
            />
            <p className="text-xs text-muted-foreground">
              One or two sentences for the blog index, search results, and
              social previews.
            </p>
            {errorFor("excerpt") ? (
              <p className="text-xs text-destructive">{errorFor("excerpt")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={field("content")}>Post</Label>
            <Textarea
              id={field("content")}
              name="content"
              defaultValue={post?.content ?? ""}
              required
              rows={24}
              spellCheck
              aria-invalid={errorFor("content") ? true : undefined}
              className="min-h-[32rem] rounded-2xl border-border/80 bg-background/80 font-mono text-sm leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              Markdown is supported: headings, lists, links, tables, quotes,
              and fenced code blocks. Raw HTML is not rendered.
            </p>
            {errorFor("content") ? (
              <p className="text-xs text-destructive">{errorFor("content")}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="space-y-2">
              <Label htmlFor={field("slug")}>Slug</Label>
              <Input
                id={field("slug")}
                name="slug"
                defaultValue={post?.slug ?? ""}
                maxLength={160}
                placeholder="leave-empty-to-generate"
                aria-invalid={errorFor("slug") ? true : undefined}
                className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to generate one from the title.
              </p>
              {errorFor("slug") ? (
                <p className="text-xs text-destructive">{errorFor("slug")}</p>
              ) : null}
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor={field("status")}>Status</Label>
              <select
                id={field("status")}
                name="status"
                defaultValue={post?.status ?? "draft"}
                className="h-11 w-full rounded-xl border border-border/80 bg-background/80 px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor={field("publishedAt")}>Publish date</Label>
              <Input
                id={field("publishedAt")}
                name="publishedAt"
                type="datetime-local"
                defaultValue={localDateTime(post?.publishedAt ?? null)}
                aria-invalid={errorFor("publishedAt") ? true : undefined}
                className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to publish now.
              </p>
              {errorFor("publishedAt") ? (
                <p className="text-xs text-destructive">
                  {errorFor("publishedAt")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="space-y-2">
              <Label htmlFor={field("tags")}>Tags</Label>
              <Input
                id={field("tags")}
                name="tags"
                defaultValue={post?.tags.join(", ") ?? ""}
                placeholder="nextjs, performance, process"
                className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated, up to eight.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor={field("coverImageUrl")}>Cover image URL</Label>
              <Input
                id={field("coverImageUrl")}
                name="coverImageUrl"
                defaultValue={post?.coverImageUrl ?? ""}
                placeholder="/images/blog/example.webp"
                aria-invalid={errorFor("coverImageUrl") ? true : undefined}
                className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
              />
              {errorFor("coverImageUrl") ? (
                <p className="text-xs text-destructive">
                  {errorFor("coverImageUrl")}
                </p>
              ) : null}
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor={field("coverImageAlt")}>Cover image description</Label>
              <Input
                id={field("coverImageAlt")}
                name="coverImageAlt"
                defaultValue={post?.coverImageAlt ?? ""}
                maxLength={180}
                className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 rounded-full px-6"
            >
              {isPending ? "Saving…" : "Save post"}
            </Button>
            {post?.status === "published" ? (
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                View post
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
