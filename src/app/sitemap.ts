import type { MetadataRoute } from "next";

import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import { getApprovedReviews, getPublishedPosts } from "@/lib/community-data";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectImages = publishedProjects.map((project) =>
    absoluteUrl(project.image),
  );
  const posts = await getPublishedPosts();
  const reviews = await getApprovedReviews();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
    ...(post.coverImageUrl
      ? { images: [absoluteUrl(post.coverImageUrl)] }
      : {}),
  }));

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
      url: absoluteUrl("/blog"),
      lastModified: posts[0]?.updatedAt ?? site.contentUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
    {
      url: absoluteUrl("/reviews"),
      lastModified:
        reviews[0]?.approvedAt ?? reviews[0]?.createdAt ?? site.contentUpdated,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: site.legalUpdatedIso,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: site.legalUpdatedIso,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
