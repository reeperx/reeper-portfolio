import { ArrowUpRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { projects, site } from "@/content/site";

export function Work() {
  const github = site.socials.find((social) => social.label === "GitHub");

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-12 lg:py-32"
    >
      <SectionHeading
        id="work-heading"
        title="Selected work"
        aside="Three recent builds, live on Vercel. Each one is a working product, not a mockup."
      />

      <div>
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group -mx-4 grid gap-6 border-t border-ink/15 px-4 py-8 transition-colors duration-300 hover:border-paper/30 hover:bg-blue hover:text-paper focus-visible:border-paper/30 focus-visible:bg-blue focus-visible:text-paper sm:grid-cols-[1fr_auto] sm:items-start lg:py-10"
          >
            <div>
              <h3 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-none tracking-[-0.035em] transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1">
                {project.name}
              </h3>
              <p className="mt-3 max-w-[58ch] text-[0.95rem] leading-relaxed text-ink/70 transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85">
                {project.summary}
              </p>
              <p className="mt-4 text-sm text-ink/65 transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85">
                {project.tags.join(", ")}
              </p>
            </div>

            <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:pt-1">
              <span className="tabular text-sm text-ink/65 transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85">
                {project.year}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-1 underline-offset-4">
                Visit live site
                <ArrowUpRight className="size-3.5" />
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </div>
          </a>
        ))}

        <div className="border-t border-ink/15 pt-6 text-sm text-ink/65">
          More experiments on{" "}
          <a
            href={github?.href ?? site.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline decoration-1 underline-offset-4 transition-colors hover:text-blue"
          >
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </div>
      </div>
    </section>
  );
}
