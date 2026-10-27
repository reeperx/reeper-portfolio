import { SectionHeading } from "@/components/section-heading";
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
    </section>
  );
}
