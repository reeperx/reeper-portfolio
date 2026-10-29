import Image from "next/image";

import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-between overflow-hidden bg-[#09110c] pb-10 pt-10 text-paper lg:min-h-svh lg:pb-14 lg:pt-12"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Image
          src={site.hero.image}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) calc(100vw - 17rem), 100vw"
          className="hero-media object-cover object-[64%_center] sm:object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,14,10,0.94)_0%,rgba(7,14,10,0.78)_34%,rgba(7,14,10,0.36)_66%,rgba(7,14,10,0.58)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,14,10,0.5)_0%,transparent_28%,transparent_62%,rgba(7,14,10,0.82)_100%)]"
      />
      <div
        aria-hidden="true"
        className="grain-bg absolute inset-0 -z-10 opacity-40 mix-blend-soft-light"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-6 lg:px-12">
        <div className="fade flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-paper/80">
          <p className="flex items-center gap-2">
            <span className="font-medium text-paper">{site.name}</span>
            <span aria-hidden="true" className="h-3 w-px bg-paper/30" />
            <span>{site.brandLine}</span>
          </p>
          <p className="text-right">{site.location}</p>
        </div>

        <div className="py-16 sm:py-20">
          <h1
            id="hero-title"
            className="rise max-w-[14ch] font-display text-[clamp(2.75rem,9vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-paper"
          >
            Your next website should earn its keep.
          </h1>
        </div>

        <div className="grid gap-8 border-t border-paper/25 pt-7 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm text-paper/80 lg:hidden">
              <span aria-hidden="true" className="size-2 rounded-full bg-sage" />
              {site.availability}
            </p>
            <p
              className="fade max-w-[48ch] text-base leading-relaxed text-paper/80 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              I’m the developer behind {site.name}. I design and build fast,
              considered websites and web apps for small teams, from first sketch
              to live on your domain.
            </p>
          </div>

          <div
            className="fade flex flex-wrap gap-3 md:justify-end"
            style={{ animationDelay: "260ms" }}
          >
            <a
              href="#work"
              className="rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal hover:text-ink"
            >
              See selected work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-paper/45 px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-paper hover:bg-paper/10"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
