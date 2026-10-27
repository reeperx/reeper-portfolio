import { Star } from "@/components/icons";
import { cn } from "@/lib/utils";

const MAX_RATING = 5;

export function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const clampedRating = Math.min(MAX_RATING, Math.max(0, Math.round(rating)));

  return (
    <div
      role="img"
      aria-label={`Rated ${clampedRating} out of ${MAX_RATING}`}
      className={cn("flex items-center gap-1.5", className)}
    >
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {Array.from({ length: MAX_RATING }, (_, index) => (
          <Star
            key={index}
            filled={index < clampedRating}
            className={cn(
              "size-3.5 shrink-0",
              index < clampedRating
                ? "text-signal"
                : "text-muted-foreground/35",
            )}
          />
        ))}
      </span>
      <span
        aria-hidden="true"
        className="tabular text-[0.7rem] font-medium text-muted-foreground"
      >
        {clampedRating.toFixed(1)}
      </span>
    </div>
  );
}
