import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { getApprovedReviews } from "@/lib/community-data";
import { formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function TestimonialSection() {
  const reviews = await getApprovedReviews();

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonial-heading"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 pb-24 lg:px-12 lg:pb-32"
    >
      <SectionHeading
        id="testimonial-heading"
        title="What clients say"
        aside="Approved client reviews, published only with permission. No incentives, no invented quotes."
      />

      <div
        className={cn(
          "mt-10 grid gap-6",
          reviews.length > 1 ? "md:grid-cols-2" : "max-w-3xl",
        )}
      >
        {reviews.slice(0, 4).map((review) => (
          <figure
            key={review.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {typeof review.rating === "number" ? (
                  <StarRating rating={review.rating} />
                ) : null}
                {review.verified ? (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary dark:text-sage">
                    Verified client
                  </span>
                ) : null}
              </div>
              <blockquote
                className={cn(
                  "font-display text-[clamp(1.35rem,2.3vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.02em]",
                  typeof review.rating === "number" && "mt-5",
                )}
              >
                “{review.quote}”
              </blockquote>
            </div>

            <figcaption className="mt-8 flex items-center gap-3 border-t border-border pt-5">
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold text-secondary-foreground"
              >
                {initials(review.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {review.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {[review.role, review.company].filter(Boolean).join(", ")}
                </p>
                {review.approvedAt ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(review.approvedAt)}
                  </p>
                ) : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/reviews"
          className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-foreground/30 hover:bg-muted"
        >
          Read all client reviews
        </Link>
        <Link
          href="/reviews#leave-a-review"
          className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          Worked together? Leave a review
        </Link>
      </div>
    </section>
  );
}
