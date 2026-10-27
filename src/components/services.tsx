import { SectionHeading } from "@/components/section-heading";
import { services } from "@/content/site";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-12 lg:pb-32"
    >
      <SectionHeading
        id="services-heading"
        title="Ways to work together"
        aside="Fixed scope, a clear price, and one person accountable from the first call to the deploy."
      />

      <div className="mt-10 grid md:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={service.title}
            className={cn(
              "border-t border-border py-8 md:border-t-0 md:py-0",
              index > 0 && "md:border-l md:border-border md:pl-8",
              index < services.length - 1 && "md:pr-8",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.025em]">
                {service.title}
              </h3>
              <p className="tabular text-sm text-muted-foreground">
                {service.timeline}
              </p>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              {service.description}
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-link">
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        Not sure which one fits?{" "}
        <a
          href="#contact"
          className="font-medium text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-link"
        >
          Tell me what you’re building
        </a>{" "}
        and I’ll point you in the right direction.
      </p>
    </section>
  );
}
