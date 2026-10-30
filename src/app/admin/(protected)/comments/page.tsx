import type { Metadata } from "next";
import Link from "next/link";

import { moderateCommentAction } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getAdminComments, type AdminComment } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Comments",
};

const actionButton =
  "rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-foreground/30 hover:bg-muted";

export default async function AdminCommentsPage() {
  const comments = await getAdminComments();
  const pending = comments.filter((comment) => comment.status === "pending");
  const reviewed = comments.filter((comment) => comment.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Discussion
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em]">
          Comments
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Approve useful discussion. Reject spam, abuse, private information,
          and anything unlawful. Criticism is allowed.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Waiting for a decision
          </h2>
          <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold text-signal">
            {pending.length} pending
          </span>
        </div>

        {pending.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            Nothing waiting. New comments will appear here before they are
            public.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((comment) => (
              <article
                key={comment.id}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <CommentHeader comment={comment} />
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {comment.body}
                </p>
                <ModerationActions comment={comment} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
          Already reviewed
        </h2>

        {reviewed.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            No approved, rejected, or spam comments yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviewed.map((comment) => (
              <article
                key={comment.id}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <CommentHeader comment={comment} />
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {comment.body}
                </p>
                <ModerationActions comment={comment} />
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CommentHeader({ comment }: { comment: AdminComment }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{comment.authorName}</span>
          <span
            className={
              comment.status === "approved"
                ? "rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary dark:text-sage"
                : comment.status === "pending"
                  ? "rounded-full bg-signal/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-signal"
                  : "rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
            }
          >
            {comment.status}
          </span>
          {comment.depth > 0 ? (
            <span className="text-xs text-muted-foreground">
              reply · level {comment.depth}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          <a
            href={`mailto:${comment.authorEmail}`}
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            {comment.authorEmail}
          </a>
          {comment.authorWebsite ? (
            <>
              {" · "}
              <a
                href={comment.authorWebsite}
                target="_blank"
                rel="noreferrer nofollow"
                className="underline decoration-border underline-offset-4 hover:text-foreground"
              >
                website
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          ) : null}
          {" · "}
          {formatDate(comment.createdAt)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          On{" "}
          <Link
            href={`/blog/${comment.postSlug}`}
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            {comment.postTitle}
          </Link>
        </p>
      </div>
    </div>
  );
}

function ModerationActions({ comment }: { comment: AdminComment }) {
  return (
    <form
      action={moderateCommentAction}
      className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4"
    >
      <input type="hidden" name="id" value={comment.id} />
      {comment.status !== "approved" ? (
        <button
          type="submit"
          name="action"
          value="approve"
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          Approve
        </button>
      ) : null}
      {comment.status !== "rejected" ? (
        <button
          type="submit"
          name="action"
          value="reject"
          className={actionButton}
        >
          Reject
        </button>
      ) : null}
      {comment.status !== "spam" ? (
        <button
          type="submit"
          name="action"
          value="spam"
          className={actionButton}
        >
          Mark spam
        </button>
      ) : null}
      <ConfirmSubmitButton
        name="action"
        value="delete"
        message="Delete this comment permanently?"
        className="rounded-full px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5"
      >
        Delete
      </ConfirmSubmitButton>
    </form>
  );
}
