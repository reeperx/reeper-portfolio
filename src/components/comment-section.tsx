import Link from "next/link";

import { CommentDialog } from "@/components/comment-dialog";
import { CommentLikeButton } from "@/components/comment-like-button";
import type { CommentNode } from "@/lib/community-data";
import { formatDate, initials } from "@/lib/format";

function countComments(comments: CommentNode[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.replies),
    0,
  );
}

export function CommentSection({
  postSlug,
  comments,
}: {
  postSlug: string;
  comments: CommentNode[];
}) {
  const total = countComments(comments);

  return (
    <section
      id="discussion"
      aria-labelledby="discussion-heading"
      className="mt-16 border-t border-border pt-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Discussion
          </p>
          <h2
            id="discussion-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            {total === 0
              ? "Start the conversation."
              : `${total} ${total === 1 ? "comment" : "comments"}.`}
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          Comments are moderated. Email stays private. Read the{" "}
          <Link
            href="/terms#comments-and-reviews"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            policy
          </Link>
          .
        </p>
      </div>

      <div
        id="join-discussion"
        className="mt-8 flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div>
          <h3 className="font-display text-xl font-semibold tracking-[-0.03em]">
            Join the discussion
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add something useful, ask a question, or disagree well.
          </p>
        </div>
        <CommentDialog
          postSlug={postSlug}
          label="Leave a comment"
          triggerClassName="h-11 shrink-0 rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90"
        />
      </div>

      {comments.length > 0 ? (
        <ol className="mt-10 space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postSlug={postSlug}
            />
          ))}
        </ol>
      ) : (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          No approved comments yet. The first one could be yours.
        </p>
      )}
    </section>
  );
}

function CommentItem({
  comment,
  postSlug,
}: {
  comment: CommentNode;
  postSlug: string;
}) {
  return (
    <li>
      <article
        id={`comment-${comment.id}`}
        className="rounded-3xl border border-border bg-card p-5"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          >
            {initials(comment.authorName) || "?"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-semibold">{comment.authorName}</span>
              {comment.authorWebsite ? (
                <a
                  href={comment.authorWebsite}
                  target="_blank"
                  rel="nofollow ugc noopener noreferrer"
                  className="text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                >
                  website
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              <time
                dateTime={comment.createdAt}
                className="text-xs text-muted-foreground"
              >
                {formatDate(comment.createdAt)}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {comment.body}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <CommentLikeButton
                commentId={comment.id}
                authorName={comment.authorName}
                initialLiked={comment.likedByViewer}
                initialCount={comment.likeCount}
              />
              {comment.depth < 3 ? (
                <CommentDialog
                  postSlug={postSlug}
                  parentId={comment.id}
                  replyToName={comment.authorName}
                  label="Reply"
                  triggerVariant="ghost"
                  triggerClassName="h-auto rounded-none bg-transparent p-0 text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 hover:bg-transparent hover:text-foreground"
                  compact
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Reply limit reached
                </span>
              )}
            </div>
          </div>
        </div>
      </article>

      {comment.replies.length > 0 ? (
        <ol className="mt-4 space-y-4 border-l border-border pl-4 sm:ml-4 sm:pl-6">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postSlug={postSlug} />
          ))}
        </ol>
      ) : null}
    </li>
  );
}
