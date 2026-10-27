export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 64 64"
    >
      <rect width="64" height="64" rx="16" fill="#2338e8" />
      <rect x="17" y="18" width="8" height="28" rx="4" fill="#f3f1ea" />
      <path
        d="M25 28c2.8-5.6 7.4-8.5 12.9-7.8"
        stroke="#f3f1ea"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <circle cx="48" cy="44" r="4.5" fill="#ff5c2b" />
    </svg>
  );
}
