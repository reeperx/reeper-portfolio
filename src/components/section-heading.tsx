import type { ReactNode } from "react";

export function SectionHeading({
  id,
  title,
  aside,
  as: Heading = "h2",
}: {
  id: string;
  title: string;
  aside?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between xl:gap-12">
      <Heading
        id={id}
        className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
      >
        {title}
      </Heading>
      {aside ? (
        <div className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground xl:text-right">
          {aside}
        </div>
      ) : null}
    </div>
  );
}
