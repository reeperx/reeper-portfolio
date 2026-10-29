import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { WorkGrid } from "@/components/work-grid";
import { publishedProjects, vercelProjectCount } from "@/content/projects";

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-12 lg:py-32"
    >
      <SectionHeading
        id="work-heading"
        title="Selected work"
        aside={`${publishedProjects.length} live builds from ${vercelProjectCount} Vercel projects. Public, complete deployments only.`}
      />

      <WorkGrid
        projects={publishedProjects}
        totalVercelProjects={vercelProjectCount}
      />

      <div className="mt-8">
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full border-border px-5 text-sm font-medium"
        >
          <Link href="/work">
            View all {publishedProjects.length} projects
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
