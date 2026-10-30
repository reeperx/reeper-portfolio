import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 64 64"
    >
      <rect width="64" height="64" rx="15" fill="var(--primary)" />
      <rect
        x="4.5"
        y="4.5"
        width="55"
        height="55"
        rx="11.5"
        stroke="var(--primary-foreground)"
        strokeOpacity="0.22"
      />
      <path
        d="M15 16h34v10H37v24H27V26H15V16Z"
        fill="var(--primary-foreground)"
      />
      <rect
        x="44"
        y="44"
        width="6"
        height="6"
        rx="1.5"
        fill="var(--accent)"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-[-0.045em]",
        className,
      )}
    >
      {site.wordmark}
      <span className="text-signal">.</span>
    </span>
  );
}
