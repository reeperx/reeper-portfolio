import { testimonial } from "@/content/site";

export function TestimonialSection() {
  return (
    <section
      aria-labelledby="testimonial-heading"
      className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-12 lg:pb-32"
    >
      <div className="border-l-2 border-blue pl-6 md:pl-10">
        <h2 id="testimonial-heading" className="sr-only">
          What a client said
        </h2>
        <blockquote>
          <p className="max-w-[26ch] font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.2] tracking-[-0.025em] text-ink">
            “{testimonial.quote}”
          </p>
          <footer className="mt-6 text-sm text-ink/65">
            <span className="font-medium text-ink">{testimonial.name}</span>,{" "}
            {testimonial.role}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
