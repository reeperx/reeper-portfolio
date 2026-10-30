"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export function CommentLikeButton({
  commentId,
  authorName,
  initialLiked,
  initialCount,
}: {
  commentId: string;
  authorName: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function toggleLike() {
    if (pending) {
      return;
    }

    setPending(true);
    setError(false);

    try {
      const response = await fetch(`/api/blog/comments/${commentId}/like`, {
        method: "POST",
      });
      const result = (await response.json()) as {
        ok?: boolean;
        liked?: boolean;
        count?: number;
      };

      if (!response.ok || !result.ok) {
        setError(true);
        return;
      }

      setLiked(Boolean(result.liked));
      setCount(Number(result.count ?? 0));
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLike}
        disabled={pending}
        aria-pressed={liked}
        aria-label={`${liked ? "Unlike" : "Like"} comment by ${authorName}. ${count} ${count === 1 ? "like" : "likes"}`}
        className={
          liked
            ? "inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-2.5 py-1 text-xs font-semibold text-signal transition-colors disabled:opacity-60"
            : "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:opacity-60"
        }
      >
        <Heart
          aria-hidden="true"
          className={liked ? "size-3.5 fill-current" : "size-3.5"}
        />
        <span className="tabular-nums" aria-live="polite">
          {count}
        </span>
      </button>
      {error ? (
        <span role="status" className="text-xs text-destructive">
          Try again
        </span>
      ) : null}
    </div>
  );
}
