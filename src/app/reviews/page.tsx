import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { ReviewDialog } from "@/components/review-dialog";
import { SiteFooter } from "@/components/site-footer";
import { StarRating } from "@/components/star-rating";
import { site } from "@/content/site";
import {
  getApprovedReviews,
  reviewAverage,
} from "@/lib/community-data";
import { formatDate, initials } from "@/lib/format";
import { openGraphImage, twitterImage } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildReviewsPageSchema,
} from "@/lib/structured-data";

const description =
  "Client reviews of TOGB, published only with permission and checked against real project work.";

export const metadata: Metadata = {
  title: "Client reviews",
  description,
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/reviews",
    siteName: site.name,
    title: `Client reviews — ${site.name}`,
    description,
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Client reviews — ${site.name}`,
    description,
    images: [twitterImage],
  },
};

export const revalidate = 300;

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const average = reviewAverage(reviews);

  return (
    <>
      <JsonLd
        data={[
          buildReviewsPageSchema(reviews),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Client reviews", path: "/reviews" },
          ]),
        ]}
      />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-12 lg:py-32"
      >
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Client proof
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Proof, with permission.
            </h1>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-relaxed text-muted-foreground">
              These are reviews from people who have actually worked with TOGB.
              Every one is published only after the client confirms it and I
              check it against project records.
            </p>
            {average ? (
              <div className="mt-5 flex items-center gap-3">
                <StarRating rating={average.average} />
                <span className="text-sm text-muted-foreground">
                  {average.average} from {average.count}{" "}
                  {average.count === 1 ? "rating" : "ratings"}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {reviews.length === 0 ? (
          <section className="mt-12 rounded-3xl border border-dashed border-border bg-card p-8 sm:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              No published reviews yet
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              If we have worked together, you can be the first.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              I would rather show nothing than invent a quote. A real review,
              in your own words, with your permission, is worth waiting for.
            </p>
            <ReviewDialog
              label="Leave a review"
              triggerClassName="mt-6 inline-flex h-11 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:bg-foreground/90"
            />
          </section>
        ) : (
          <section aria-labelledby="reviews-heading" className="mt-12">
            <h2 id="reviews-heading" className="sr-only">
              Published client reviews
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <figure
                  key={review.id}
                  className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-8"
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
                    <blockquote className="mt-5 font-display text-[clamp(1.35rem,2.3vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.02em]">
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
                        {[review.role, review.company]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {review.approvedAt ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Published {formatDate(review.approvedAt)}
                        </p>
                      ) : null}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section
          id="leave-a-review"
          aria-labelledby="leave-a-review-heading"
          className="mt-16 scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Worked together?
              </p>
              <h2
                id="leave-a-review-heading"
                className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
              >
                Leave a review.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Tell me what the work was like, what changed, and whether it
                was worth it. Honest criticism is welcome — I will not remove a
                review just because it is negative.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Reviews are checked against client records before publication.
                Your email stays private, and you can ask for a review to be
                corrected or removed later. Read the{" "}
                <Link
                  href="/terms#comments-and-reviews"
                  className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  review policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  privacy policy
                </Link>
                .
              </p>
            </div>

            <div className="lg:justify-self-end lg:text-right">
              <ReviewDialog
                label="Write a review"
                triggerClassName="h-12 rounded-full bg-signal px-6 text-sm font-semibold text-ink transition-colors hover:bg-signal/90"
              />
              <p className="mt-3 max-w-[22ch] text-xs leading-relaxed text-muted-foreground lg:ml-auto">
                Opens a short form. Your email stays private.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
