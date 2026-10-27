"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, Pause, Play } from "@/components/icons";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/content/site";
import { cn } from "@/lib/utils";

const ROTATION_MS = 6500;

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasExplicitlyStarted, setHasExplicitlyStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const total = testimonials.length;
  const active = testimonials[activeIndex];
  // Focus pauses stay latched after blur. Hover pauses are temporary, but an
  // explicit start overrides both until focus or hover enters again.
  const isRotationPaused =
    isManuallyPaused ||
    (!hasExplicitlyStarted && (isFocusPaused || isHovered));
  const isAutoRotating =
    total > 1 && !isRotationPaused && !prefersReducedMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isAutoRotating) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, ROTATION_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isAutoRotating, total]);

  function showTestimonial(index: number) {
    setActiveIndex((index + total) % total);
  }

  function handleAutoRotationToggle() {
    if (isManuallyPaused) {
      setIsManuallyPaused(false);
      setHasExplicitlyStarted(true);
    } else {
      setIsManuallyPaused(true);
      setHasExplicitlyStarted(false);
    }
  }

  return (
    <section
      aria-labelledby="testimonial-heading"
      aria-roledescription="carousel"
      className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-12 lg:pb-32"
      onFocus={() => {
        setIsFocusPaused(true);
        setHasExplicitlyStarted(false);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setHasExplicitlyStarted(false);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="border-l-2 border-primary pl-6 md:pl-10">
        <h2 id="testimonial-heading" className="sr-only">
          What clients say
        </h2>
        <p
          aria-atomic="true"
          aria-live={isAutoRotating ? "off" : "polite"}
          className="sr-only"
        >
          Testimonial {activeIndex + 1} of {total}: {active.name}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <p className="tabular text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Client note {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>

          <div className="flex items-center gap-1">
            <div
              aria-label="Choose testimonial"
              className="mr-1 flex items-center"
              role="group"
            >
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.image}
                  type="button"
                  aria-current={index === activeIndex ? "true" : undefined}
                  aria-label={`Show testimonial ${index + 1} of ${total}`}
                  className="group grid size-6 place-items-center rounded-full"
                  onClick={() => showTestimonial(index)}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                      index === activeIndex
                        ? "w-5 bg-foreground"
                        : "w-1.5 bg-border group-hover:bg-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Previous testimonial"
              onClick={() => showTestimonial(activeIndex - 1)}
            >
              <ArrowLeft />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Next testimonial"
              onClick={() => showTestimonial(activeIndex + 1)}
            >
              <ArrowRight />
            </Button>
            {total > 1 && !prefersReducedMotion ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={
                  isManuallyPaused
                    ? "Start automatic rotation"
                    : "Pause automatic rotation"
                }
                onClick={handleAutoRotationToggle}
              >
                {isManuallyPaused ? <Play /> : <Pause />}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-7 grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}`}
              aria-hidden={index !== activeIndex}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none",
                index === activeIndex
                  ? "opacity-100"
                  : "pointer-events-none opacity-0",
              )}
            >
              <blockquote>
                <p className="max-w-[26ch] font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.2] tracking-[-0.025em] text-foreground">
                  “{testimonial.quote}”
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <Image
                    src={testimonial.image}
                    alt=""
                    width={112}
                    height={112}
                    sizes="(min-width: 640px) 56px, 48px"
                    className="size-12 shrink-0 rounded-full border border-border object-cover sm:size-14"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {testimonial.name}
                      </span>
                      {testimonial.placeholder ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          Sample
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <StarRating
                      rating={testimonial.rating}
                      className="mt-2"
                    />
                  </div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
