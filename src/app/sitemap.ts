import type { MetadataRoute } from "next";

import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectImages = publishedProjects.map((project) =>
    absoluteUrl(project.image),
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified: site.contentUpdated,
      changeFrequency: "monthly",
      priority: 1,
      images: projectImages.slice(0, 4),
    },
    {
      url: absoluteUrl("/work"),
      lastModified: site.contentUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
      images: projectImages,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: site.contentUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: site.contentUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
