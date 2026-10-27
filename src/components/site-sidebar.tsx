import Link from "next/link";
import type { ComponentType } from "react";

import { Clock } from "@/components/clock";
import {
  AboutIcon,
  ContactIcon,
  ServicesIcon,
  WorkIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type NavIcon = ComponentType<{ className?: string }>;

const navIcons: Record<string, NavIcon> = {
  Work: WorkIcon,
  Services: ServicesIcon,
  About: AboutIcon,
  Contact: ContactIcon,
};

export function SiteSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col overflow-hidden border-r border-border bg-background px-7 py-8 lg:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary via-signal to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 size-56 rounded-full bg-signal/10 blur-3xl"
      />

      <div className="relative">
        <Link
          href="/#top"
          className="inline-flex w-fit items-baseline font-display text-3xl font-semibold tracking-[-0.045em]"
        >
          {site.wordmark}
          <span className="text-link">.</span>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">{site.role}</p>
      </div>

      <nav aria-label="Primary" className="relative mt-12">
        <ul className="space-y-1.5">
          {site.nav.map((item) => {
            const Icon = navIcons[item.label];
            const isContact = item.label === "Contact";

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:border-primary/30 group-focus-visible:bg-primary group-focus-visible:text-primary-foreground",
                      isContact &&
                        "group-hover:border-signal/40 group-hover:bg-signal group-hover:text-ink group-focus-visible:border-signal/40 group-focus-visible:bg-signal group-focus-visible:text-ink",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px w-0 bg-link transition-all duration-300 group-hover:w-4 group-focus-visible:w-4",
                      isContact && "bg-signal",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative mt-auto">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/15 blur-2xl dark:bg-primary/25"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Studio
              </p>
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
                />
                {site.availability}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {site.availabilityNote}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
              <span className="tabular inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock />
                <span className="sr-only">
                  local time in {site.shortLocation}
                </span>
                SAST
              </span>
              <ThemeToggle className="size-9" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
