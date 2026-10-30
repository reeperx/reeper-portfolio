"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the mailto link beside this still works.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={copy}
      className="h-8 shrink-0 rounded-full border-on-brand/30 bg-on-brand px-3 text-xs font-semibold text-primary hover:border-on-brand hover:bg-paper hover:text-primary focus-visible:border-on-brand focus-visible:ring-on-brand/60 dark:border-on-brand/30 dark:bg-on-brand dark:text-primary dark:hover:bg-paper dark:hover:text-primary sm:h-9 sm:px-4 sm:text-sm"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </Button>
  );
}
