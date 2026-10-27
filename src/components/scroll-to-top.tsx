"use client";

import { useSyncExternalStore } from "react";

import { ArrowUp } from "@/components/icons";
import { Button } from "@/components/ui/button";

const SCROLL_THRESHOLD = 600;

function subscribe(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getSnapshot() {
  return window.scrollY > SCROLL_THRESHOLD;
}

function getServerSnapshot() {
  return false;
}

export function ScrollToTop() {
  const visible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!visible) {
    return null;
  }

  function scrollToTop() {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <Button
      type="button"
      size="icon"
      aria-label="Back to top"
      title="Back to top"
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 z-50 size-12 animate-in rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 fade-in slide-in-from-bottom-2 hover:bg-signal hover:text-ink focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-8 sm:right-8"
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
