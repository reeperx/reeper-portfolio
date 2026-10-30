"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

const buttonClass =
  "inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-foreground/30 hover:bg-muted";

const subscribeToNothing = () => () => {};

function canShareSnapshot() {
  return typeof navigator !== "undefined" && "share" in navigator;
}

function canShareServerSnapshot() {
  return false;
}

export function BlogShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    subscribeToNothing,
    canShareSnapshot,
    canShareServerSnapshot,
  );
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = encodeURIComponent(`${title} ${url}`);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (!canShare) {
      return;
    }

    try {
      await navigator.share({ title, url });
    } catch {
      // The share sheet was dismissed or is unavailable. Nothing to do.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Share
      </span>
      <a
        href={`https://wa.me/?text=${shareText}`}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        X
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        Facebook
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        LinkedIn
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <button type="button" onClick={copyLink} className={buttonClass}>
        {copied ? (
          <Check aria-hidden="true" className="size-3.5" />
        ) : (
          <Link2 aria-hidden="true" className="size-3.5" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
      {canShare ? (
        <button type="button" onClick={nativeShare} className={buttonClass}>
          <Share2 aria-hidden="true" className="size-3.5" />
          Share…
        </button>
      ) : null}
    </div>
  );
}
