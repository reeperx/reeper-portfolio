import Image from "next/image";

import { ArrowUpRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { testimonials } from "@/content/site";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TestimonialSection() {
  if (testimonials.length === 0) {
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
        aside="Real words from people who have shipped with TOGB."
      />

      <div
        className={cn(
          "mt-10 grid gap-6",
          testimonials.length > 1 ? "md:grid-cols-2" : "max-w-3xl",
        )}
      >
        {testimonials.map((testimonial, index) => (
          <figure
            key={`${testimonial.name}-${index}`}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div>
              {typeof testimonial.rating === "number" ? (
                <StarRating rating={testimonial.rating} />
              ) : null}
              <blockquote
                className={cn(
                  "font-display text-[clamp(1.35rem,2.3vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.02em]",
                  typeof testimonial.rating === "number" && "mt-5",
                )}
              >
                “{testimonial.quote}”
              </blockquote>
            </div>

            <figcaption className="mt-8 flex items-center gap-3 border-t border-border pt-5">
              {testimonial.image ? (
                <Image
                  src={testimonial.image}
                  alt=""
                  width={112}
                  height={112}
                  sizes="56px"
                  className="size-12 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold text-secondary-foreground"
                >
                  {initials(testimonial.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {testimonial.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
                {testimonial.source ? (
                  <a
                    href={testimonial.source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-link underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
                  >
                    {testimonial.source.label}
                    <ArrowUpRight className="size-3.5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
