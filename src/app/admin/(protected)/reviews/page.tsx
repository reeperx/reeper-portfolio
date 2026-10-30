import type { Metadata } from "next";

import {
  moderateReviewAction,
  toggleReviewVerifiedAction,
} from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { StarRating } from "@/components/star-rating";
import { getAdminReviews, type AdminReview } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Reviews",
};

const secondaryButton =
  "rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-foreground/30 hover:bg-muted";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();
  const pending = reviews.filter((review) => review.status === "pending");
  const reviewed = reviews.filter((review) => review.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Client proof
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em]">
          Reviews
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Publish only reviews from real clients, in their own words, with
          permission. Do not edit the meaning or add a rating they did not
          give.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Waiting for a decision
          </h2>
          <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold text-signal">
            {pending.length} pending
          </span>
        </div>

        {pending.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            Nothing waiting. New reviews will appear here before they are
            public.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <ReviewHeader review={review} />
                <blockquote className="mt-4 border-l-2 border-signal pl-4 text-base leading-relaxed">
                  “{review.quote}”
                </blockquote>
                <div className="mt-5 rounded-2xl bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
                  Consent to publish:{" "}
                  <strong className="text-foreground">
                    {review.consent ? "yes" : "no"}
                  </strong>
                  . Check that the email belongs to a client before approving.
                </div>
                <form
                  action={moderateReviewAction}
                  className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4"
                >
                  <input type="hidden" name="id" value={review.id} />
                  <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <input
                      type="checkbox"
                      name="verified"
                      className="size-4 rounded border-border"
                    />
                    I checked this client
                  </label>
                  <button
                    type="submit"
                    name="action"
                    value="approve"
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Approve
                  </button>
                  <button
                    type="submit"
                    name="action"
                    value="reject"
                    className={secondaryButton}
                  >
                    Reject
                  </button>
                  <ConfirmSubmitButton
                    name="action"
                    value="delete"
                    message="Delete this review permanently?"
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5"
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
          Already reviewed
        </h2>

        {reviewed.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            No approved or rejected reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviewed.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <ReviewHeader review={review} />
                <blockquote className="mt-4 border-l-2 border-border pl-4 text-base leading-relaxed">
                  “{review.quote}”
                </blockquote>
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {review.status === "approved" ? (
                    <form action={toggleReviewVerifiedAction}>
                      <input type="hidden" name="id" value={review.id} />
                      <button
                        type="submit"
                        className={
                          review.verified
                            ? "rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary dark:text-sage"
                            : secondaryButton
                        }
                      >
                        {review.verified
                          ? "Verified client · remove badge"
                          : "Mark as verified client"}
                      </button>
                    </form>
                  ) : null}
                  <form action={moderateReviewAction}>
                    <input type="hidden" name="id" value={review.id} />
                    {review.status !== "rejected" ? (
                      <button
                        type="submit"
                        name="action"
                        value="reject"
                        className={secondaryButton}
                      >
                        Reject
                      </button>
                    ) : null}
                    <ConfirmSubmitButton
                      name="action"
                      value="delete"
                      message="Delete this review permanently?"
                      className="ml-2 rounded-full px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ReviewHeader({ review }: { review: AdminReview }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{review.name}</span>
        <span
          className={
            review.status === "approved"
              ? "rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary dark:text-sage"
              : review.status === "pending"
                ? "rounded-full bg-signal/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-signal"
                : "rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          }
        >
          {review.status}
        </span>
        {review.verified ? (
          <span className="rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            Verified client
          </span>
        ) : null}
        {typeof review.rating === "number" ? (
          <StarRating rating={review.rating} />
        ) : null}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        <a
          href={`mailto:${review.email}`}
          className="underline decoration-border underline-offset-4 hover:text-foreground"
        >
          {review.email}
        </a>
        {review.company ? ` · ${review.company}` : ""}
        {review.role ? ` · ${review.role}` : ""}
        {" · "}
        {formatDate(review.createdAt)}
      </p>
    </div>
  );
}
