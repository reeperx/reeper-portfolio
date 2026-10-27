import { SectionHeading } from "@/components/section-heading";
import { site, tools } from "@/content/site";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-12 lg:pb-32"
    >
      <SectionHeading
        id="about-heading"
        title="The person behind the work"
        aside="One developer, no hand-offs, no account manager."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div
          aria-hidden="true"
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary grain-bg lg:sticky lg:top-10 lg:self-start"
        >
          <div className="absolute inset-4 rounded-xl border border-primary-foreground/20" />
          <div className="absolute inset-0 flex flex-col justify-between p-8 text-primary-foreground">
            <p className="text-sm text-primary-foreground/85">
              {site.shortLocation}
            </p>
            <p className="font-display text-[clamp(9rem,18vw,15rem)] font-semibold leading-[0.65] tracking-[-0.09em]">
              r<span className="text-signal">.</span>
            </p>
            <div className="flex items-end justify-between text-sm text-primary-foreground/85">
              <span>{site.name}</span>
              <span className="tabular">2026</span>
            </div>
          </div>
        </div>

        <div>
          <p className="max-w-[52ch] text-xl leading-relaxed tracking-[-0.01em] sm:text-2xl sm:leading-[1.35]">
            I’m {site.name}, a developer in {site.shortLocation}. For the past
            eight years I’ve helped small teams ship websites and web apps that
            are fast, accessible, and easy to keep running.
          </p>

          <div className="mt-6 max-w-[60ch] space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            <p>
              I work end to end: design, build, and deploy. No hand-offs, no
              account manager, no six-week discovery phase. You get one person
              who knows the whole thing, and a site you can maintain after I’m
              gone.
            </p>
            <p>
              Most of my work is for teams of one to twenty: e-commerce,
              services, SaaS, and the occasional good idea that just needed a
              home.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-medium text-muted-foreground">
              Tools I reach for
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-8">
              {tools.map((tool) => (
                <li
                  key={tool}
                  className="border-t border-border py-2.5 text-sm text-foreground/80"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
