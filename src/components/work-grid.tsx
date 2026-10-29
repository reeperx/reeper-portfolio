"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkProject } from "@/content/projects";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;

export function WorkGrid({
  projects,
  totalVercelProjects,
  pageSize = PAGE_SIZE,
  showPagination = true,
}: {
  projects: WorkProject[];
  totalVercelProjects: number;
  pageSize?: number;
  showPagination?: boolean;
}) {
  const [page, setPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);
  const firstProjectRef = useRef<HTMLAnchorElement>(null);
  const previousPage = useRef(1);

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return projects.slice(start, start + pageSize);
  }, [currentPage, pageSize, projects]);

  const firstProjectNumber = (currentPage - 1) * pageSize + 1;
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

      <div ref={listTopRef} id="work-project-list" className="scroll-mt-28">
        {visibleProjects.map((project, index) => {
          const projectNumber = firstProjectNumber + index;

          return (
            <a
              key={project.vercelProject}
              ref={index === 0 ? firstProjectRef : undefined}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group -mx-4 grid gap-6 rounded-2xl border-t border-border px-4 py-8 transition-colors duration-300 hover:border-primary-foreground/30 hover:bg-primary hover:text-primary-foreground focus-visible:border-primary-foreground/30 focus-visible:bg-primary focus-visible:text-primary-foreground xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-stretch xl:gap-10 xl:px-6 xl:py-10"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted xl:aspect-auto xl:min-h-[18rem]">
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
                      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-primary-foreground/85 group-focus-visible:text-primary-foreground/85">
                        Project {String(projectNumber).padStart(2, "0")}
                      </p>
                      <h3 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-none tracking-[-0.035em] transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1">
                        {project.name}
                      </h3>
                    </div>
                    <span className="tabular shrink-0 text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground/85 group-focus-visible:text-primary-foreground/85">
                      {project.year}
                    </span>
                  </div>

                  <p className="mt-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-muted-foreground transition-colors group-hover:text-primary-foreground/85 group-focus-visible:text-primary-foreground/85">
                    {project.summary}
                  </p>

                  <ul
                    aria-label="Technologies and categories"
                    className="mt-5 flex flex-wrap gap-2"
                  >
                    {project.tags.map((tag) => (
                      <li key={tag}>
                        <Badge
                          variant="outline"
                          className="h-auto rounded-full border-border px-3 py-1 text-xs text-muted-foreground transition-colors group-hover:border-primary-foreground/25 group-hover:text-primary-foreground/80 group-focus-visible:border-primary-foreground/25 group-focus-visible:text-primary-foreground/80"
                        >
                          {tag}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-primary-foreground/85 group-focus-visible:text-primary-foreground/85">
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

      {showPagination ? (
        <nav
          aria-label="Work pagination"
          className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="tabular text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-controls="work-project-list"
              aria-label="Previous page"
              className="h-10 rounded-full px-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => {
                const isCurrent = pageNumber === currentPage;

                return (
                  <Button
                    key={pageNumber}
                    type="button"
                    variant={isCurrent ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(pageNumber)}
                    aria-controls="work-project-list"
                    aria-label={`Page ${pageNumber}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "size-10 rounded-full",
                      !isCurrent &&
                        "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {pageNumber}
                  </Button>
                );
              },
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-controls="work-project-list"
              aria-label="Next page"
              className="h-10 rounded-full px-4 text-muted-foreground hover:text-foreground"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </nav>
      ) : null}

      <div className="mt-8 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {projects.length} public builds from {totalVercelProjects} Vercel
          projects. Private, API-only, empty, incomplete, duplicate, and offline
          deployments are excluded.
        </p>
        <p className="shrink-0 text-xs uppercase tracking-[0.16em]">
          Vercel snapshot · October 2026
        </p>
      </div>
    </div>
  );
}
