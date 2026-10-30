import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { getDb } from "@/lib/db";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostSummary = Omit<BlogPost, "content">;

export type PublicReview = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  rating: number | null;
  verified: boolean;
  createdAt: string;
  approvedAt: string | null;
};

export type PublicComment = {
  id: string;
  parentId: string | null;
  depth: number;
  authorName: string;
  authorWebsite: string | null;
  body: string;
  createdAt: string;
  likeCount: number;
  likedByViewer: boolean;
};

export type CommentNode = PublicComment & {
  replies: CommentNode[];
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  tags: unknown;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type ReviewRow = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  rating: number | null;
  verified: boolean;
  created_at: string;
  approved_at: string | null;
};

type CommentRow = {
  id: string;
  parent_id: string | null;
  depth: number;
  author_name: string;
  author_website: string | null;
  body: string;
  created_at: string;
  like_count: number;
  liked_by_viewer: boolean;
};

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((tag): tag is string => typeof tag === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

function toPost(row: PostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content ?? "",
    coverImageUrl: row.cover_image_url,
    coverImageAlt: row.cover_image_alt,
    tags: parseTags(row.tags),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toReview(row: ReviewRow): PublicReview {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company,
    quote: row.quote,
    rating: row.rating,
    verified: row.verified,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
  };
}

function toSummary(row: PostRow): BlogPostSummary {
  const post = toPost(row);

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImageUrl: post.coverImageUrl,
    coverImageAlt: post.coverImageAlt,
    tags: post.tags,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

async function loadPublishedPosts(): Promise<BlogPostSummary[]> {
  const sql = getDb();

  if (!sql) {
    return [];
  }

  try {
    const rows = (await sql`
      SELECT
        id, slug, title, excerpt, cover_image_url, cover_image_alt, tags,
        published_at, created_at, updated_at
      FROM blog_posts
      WHERE status = 'published'
        AND published_at IS NOT NULL
        AND published_at <= now()
      ORDER BY published_at DESC
    `) as PostRow[];

    return rows.map(toSummary);
  } catch (error) {
    console.error("[community] Could not load published posts:", error);
    return [];
  }
}

async function loadApprovedReviews(): Promise<PublicReview[]> {
  const sql = getDb();

  if (!sql) {
    return [];
  }

  try {
    const rows = (await sql`
      SELECT
        id, name, role, company, quote, rating, verified, created_at, approved_at
      FROM reviews
      WHERE status = 'approved'
      ORDER BY approved_at DESC NULLS LAST, created_at DESC
    `) as ReviewRow[];

    return rows.map(toReview);
  } catch (error) {
    console.error("[community] Could not load approved reviews:", error);
    return [];
  }
}

export const getPublishedPosts = unstable_cache(
  loadPublishedPosts,
  ["togb-published-posts"],
  { tags: ["blog-posts"], revalidate: 300 },
);

export const getApprovedReviews = unstable_cache(
  loadApprovedReviews,
  ["togb-approved-reviews"],
  { tags: ["reviews"], revalidate: 300 },
);

export const getPostBySlug = cache(async (slug: string) => {
  const sql = getDb();

  if (!sql) {
    return null;
  }

  try {
    const rows = (await sql`
      SELECT
        id, slug, title, excerpt, content, cover_image_url, cover_image_alt,
        tags, published_at, created_at, updated_at
      FROM blog_posts
      WHERE slug = ${slug}
        AND status = 'published'
        AND published_at IS NOT NULL
        AND published_at <= now()
      LIMIT 1
    `) as PostRow[];

    return rows[0] ? toPost(rows[0]) : null;
  } catch (error) {
    console.error(`[community] Could not load post ${slug}:`, error);
    return null;
  }
});

export async function getCommentsForPost(
  postId: string,
  viewerHash: string | null,
): Promise<CommentNode[]> {
  const sql = getDb();

  if (!sql) {
    return [];
  }

  try {
    const rows = (await sql`
      SELECT
        c.id,
        c.parent_id,
        c.depth,
        c.author_name,
        c.author_website,
        c.body,
        c.created_at,
        COUNT(l.comment_id)::int AS like_count,
        COALESCE(BOOL_OR(l.voter_hash = ${viewerHash}), false) AS liked_by_viewer
      FROM comments c
      LEFT JOIN comment_likes l ON l.comment_id = c.id
      WHERE c.post_id = ${postId}
        AND c.status = 'approved'
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `) as CommentRow[];

    const nodes = new Map<string, CommentNode>();

    for (const row of rows) {
      nodes.set(row.id, {
        id: row.id,
        parentId: row.parent_id,
        depth: row.depth,
        authorName: row.author_name,
        authorWebsite: row.author_website,
        body: row.body,
        createdAt: row.created_at,
        likeCount: row.like_count,
        likedByViewer: row.liked_by_viewer,
        replies: [],
      });
    }

    const roots: CommentNode[] = [];

    for (const node of nodes.values()) {
      if (node.parentId && nodes.has(node.parentId)) {
        nodes.get(node.parentId)?.replies.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  } catch (error) {
    console.error("[community] Could not load comments:", error);
    return [];
  }
}

export function reviewAverage(reviews: PublicReview[]) {
  const rated = reviews.filter(
    (review): review is PublicReview & { rating: number } =>
      typeof review.rating === "number",
  );

  if (rated.length === 0) {
    return null;
  }

  return {
    count: rated.length,
    average: Number(
      (
        rated.reduce((total, review) => total + review.rating, 0) /
        rated.length
      ).toFixed(1),
    ),
  };
}
