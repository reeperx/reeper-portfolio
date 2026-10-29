import Image from "next/image";

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
        <figure className="lg:sticky lg:top-10 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-forest ring-1 ring-border/80">
            <Image
              src={site.portrait.image}
              alt={site.portrait.alt}
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,10,0.38)_0%,transparent_24%,transparent_62%,rgba(7,14,10,0.82)_100%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-4 rounded-xl border border-paper/20"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-7 text-paper sm:p-8">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-paper/75">
                Original / 01
              </p>
              <div className="flex items-end justify-between gap-4 text-sm text-paper/85">
                <span>{site.shortLocation}</span>
                <span className="tabular">{site.established}—2026</span>
              </div>
            </div>
          </div>
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs leading-relaxed text-muted-foreground">
            <span>
              The developer behind {site.name} in {site.shortLocation}.
            </span>
            <span className="tabular shrink-0">Est. {site.established}</span>
          </figcaption>
        </figure>

        <div>
          <p className="max-w-[52ch] text-xl leading-relaxed tracking-[-0.01em] sm:text-2xl sm:leading-[1.35]">
            I’m the developer behind {site.name}, based in {site.shortLocation}.
            For the past eight years I’ve helped small teams ship websites and
            web apps that are fast, accessible, and easy to keep running.
          </p>

          <div className="mt-6 max-w-[60ch] space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            <p>
              {site.name} is deliberately small. I work end to end: design,
              build, and deploy. No hand-offs, no account manager, no six-week
              discovery phase. You get one person who knows the whole thing, and
              a site you can maintain after I’m gone.
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
