"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";
import type { WorkProject } from "@/content/projects";

const PAGE_SIZE = 4;

export function WorkGrid({
  projects,
  totalVercelProjects,
  githubHref,
}: {
  projects: WorkProject[];
  totalVercelProjects: number;
  githubHref: string;
}) {
  const [page, setPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);
  const firstProjectRef = useRef<HTMLAnchorElement>(null);
  const previousPage = useRef(1);

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return projects.slice(start, start + PAGE_SIZE);
  }, [currentPage, projects]);

  const firstProjectNumber = (currentPage - 1) * PAGE_SIZE + 1;
  const lastProjectNumber = firstProjectNumber + visibleProjects.length - 1;

  useEffect(() => {
    if (currentPage === previousPage.current) {
      return;
    }

    previousPage.current = currentPage;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    listTopRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    firstProjectRef.current?.focus({ preventScroll: true });
  }, [currentPage]);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return (
    <div>
      <p aria-live="polite" className="sr-only">
        Page {currentPage} of {totalPages}. Showing projects{" "}
        {firstProjectNumber} to {lastProjectNumber} of {projects.length}.
      </p>

      <div
        ref={listTopRef}
        id="work-project-list"
        className="scroll-mt-28"
      >
        {visibleProjects.map((project, index) => {
          const projectNumber = firstProjectNumber + index;

          return (
            <a
              key={project.vercelProject}
              ref={index === 0 ? firstProjectRef : undefined}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group -mx-4 grid gap-6 border-t border-ink/15 px-4 py-8 transition-colors duration-300 hover:border-paper/30 hover:bg-blue hover:text-paper focus-visible:border-paper/30 focus-visible:bg-blue focus-visible:text-paper xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-stretch xl:gap-10 xl:px-6 xl:py-10"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ink/10 xl:aspect-auto xl:min-h-[18rem]">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 480px, 100vw"
                  className="object-cover object-left transition-transform duration-500 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                />
              </div>

              <div className="flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink/65 transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85">
                        Project {String(projectNumber).padStart(2, "0")}
                      </p>
                      <h3 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-none tracking-[-0.035em] transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1">
                        {project.name}
                      </h3>
                    </div>
                    <span className="tabular shrink-0 text-sm text-ink/65 transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85">
                      {project.year}
                    </span>
                  </div>

                  <p className="mt-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-ink/70 transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85">
                    {project.summary}
                  </p>

                  <ul
                    aria-label="Technologies and categories"
                    className="mt-5 flex flex-wrap gap-2"
                  >
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-ink/15 px-2.5 py-1 text-xs text-ink/65 transition-colors group-hover:border-paper/25 group-hover:text-paper/80 group-focus-visible:border-paper/25 group-focus-visible:text-paper/80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink/65 transition-colors group-hover:text-paper/85 group-focus-visible:text-paper/85">
                    Live on Vercel
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-1 underline-offset-4">
                    Visit live site
                    <ArrowUpRight className="size-3.5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <nav
        aria-label="Work pagination"
        className="mt-10 flex flex-col gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="tabular text-sm text-ink/65">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-controls="work-project-list"
            aria-label="Previous page"
            className="inline-flex h-10 items-center gap-2 border border-ink/15 px-3 text-sm text-ink/70 transition-colors hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => goToPage(pageNumber)}
                aria-controls="work-project-list"
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                className={`inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-colors ${
                  pageNumber === currentPage
                    ? "border-blue bg-blue text-paper"
                    : "border-ink/15 text-ink/70 hover:border-ink hover:text-ink"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-controls="work-project-list"
            aria-label="Next page"
            className="inline-flex h-10 items-center gap-2 border border-ink/15 px-3 text-sm text-ink/70 transition-colors hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-35"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </nav>

      <div className="mt-8 flex flex-col gap-3 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {projects.length} public builds from {totalVercelProjects} Vercel
          projects. Private, API-only, empty, incomplete, duplicate, and offline
          deployments are excluded.
        </p>
        <a
          href={githubHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 font-medium text-ink underline decoration-1 underline-offset-4 transition-colors hover:text-blue"
        >
          More experiments on GitHub
          <ArrowUpRight className="size-3.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
