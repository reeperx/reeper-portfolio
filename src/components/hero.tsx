import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-between overflow-hidden bg-primary grain-bg pb-10 pt-10 text-primary-foreground lg:min-h-svh lg:pb-14 lg:pt-12"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-6 lg:px-12">
        <div className="fade flex items-center justify-between gap-6 text-sm text-primary-foreground/85">
          <p>{site.role}</p>
          <p className="text-right">{site.location}</p>
        </div>

        <div className="py-16 sm:py-20">
          <h1
            id="hero-title"
            className="rise max-w-[14ch] font-display text-[clamp(2.75rem,9vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]"
          >
            Your next website should earn its keep.
          </h1>
        </div>

        <div className="grid gap-8 border-t border-primary-foreground/25 pt-7 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm text-primary-foreground/85 lg:hidden">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-[#8fe0b0]"
              />
              {site.availability}
            </p>
            <p
              className="fade max-w-[48ch] text-base leading-relaxed text-primary-foreground/85 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              I’m {site.name}, an independent developer. I design and build fast,
              considered websites and web apps for small teams, from first sketch
              to live on Vercel.
            </p>
          </div>

          <div
            className="fade flex flex-wrap gap-3 md:justify-end"
            style={{ animationDelay: "260ms" }}
          >
            <a
              href="#work"
              className="rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal"
            >
              See selected work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-primary-foreground/45 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:border-primary-foreground hover:bg-primary-foreground/10"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
