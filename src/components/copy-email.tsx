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
      className="h-auto rounded-full border-on-brand/40 bg-transparent px-4 py-2 text-sm font-medium text-on-brand hover:border-on-brand hover:bg-on-brand hover:text-primary focus-visible:border-on-brand focus-visible:ring-on-brand/60"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </Button>
  );
}
