import type { ReactNode } from "react";

export function SectionHeading({
  id,
  title,
  aside,
}: {
  id: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink/15 pb-6 xl:flex-row xl:items-end xl:justify-between xl:gap-12">
      <h2
        id={id}
        className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
      >
        {title}
      </h2>
      {aside ? (
        <div className="max-w-[40ch] text-sm leading-relaxed text-ink/65 xl:text-right">
          {aside}
        </div>
      ) : null}
    </div>
  );
}
