import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/content/site";

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 pb-24 lg:px-12 lg:pb-32"
    >
      <SectionHeading
        id="faq-heading"
        title="Questions, answered"
        aside="Scope, timing, and what it is like to work together."
      />

      <div className="mt-8 divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
              <span className="font-display text-xl font-medium tracking-[-0.02em] sm:text-2xl">
                {faq.question}
              </span>
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-lg leading-none text-muted-foreground transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[70ch] text-[0.95rem] leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
