import "server-only";

import { getDb } from "@/lib/db";

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminComment = {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  parentId: string | null;
  depth: number;
  authorName: string;
  authorEmail: string;
  authorWebsite: string | null;
  body: string;
  status: "pending" | "approved" | "rejected" | "spam";
  createdAt: string;
  approvedAt: string | null;
};

export type AdminReview = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  quote: string;
  rating: number | null;
  consent: boolean;
  status: "pending" | "approved" | "rejected";
  verified: boolean;
  createdAt: string;
  approvedAt: string | null;
};

type AdminPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  tags: unknown;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type AdminCommentRow = {
  id: string;
  post_id: string;
  post_title: string;
  post_slug: string;
  parent_id: string | null;
  depth: number;
  author_name: string;
  author_email: string;
  author_website: string | null;
  body: string;
  status: AdminComment["status"];
  created_at: string;
  approved_at: string | null;
};

type AdminReviewRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  quote: string;
  rating: number | null;
  consent: boolean;
  status: AdminReview["status"];
  verified: boolean;
  created_at: string;
  approved_at: string | null;
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

function toAdminPost(row: AdminPostRow): AdminPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    coverImageAlt: row.cover_image_alt,
    tags: parseTags(row.tags),
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAdminPosts(): Promise<AdminPost[]> {
  const sql = getDb();

  if (!sql) {
    return [];
  }

  const rows = (await sql`
    SELECT
      id, slug, title, excerpt, content, cover_image_url, cover_image_alt,
      tags, status, published_at, created_at, updated_at
    FROM blog_posts
    ORDER BY created_at DESC
  `) as AdminPostRow[];

  return rows.map(toAdminPost);
}

export async function getAdminPostById(id: string) {
  const sql = getDb();

  if (!sql) {
    return null;
  }

  const rows = (await sql`
    SELECT
      id, slug, title, excerpt, content, cover_image_url, cover_image_alt,
      tags, status, published_at, created_at, updated_at
    FROM blog_posts
    WHERE id = ${id}
    LIMIT 1
  `) as AdminPostRow[];

  return rows[0] ? toAdminPost(rows[0]) : null;
}

export async function getAdminComments(): Promise<AdminComment[]> {
  const sql = getDb();

  if (!sql) {
    return [];
  }

  const rows = (await sql`
    SELECT
      c.id,
      c.post_id,
      p.title AS post_title,
      p.slug AS post_slug,
      c.parent_id,
      c.depth,
      c.author_name,
      c.author_email,
      c.author_website,
      c.body,
      c.status,
      c.created_at,
      c.approved_at
    FROM comments c
    JOIN blog_posts p ON p.id = c.post_id
    ORDER BY
      CASE c.status WHEN 'pending' THEN 0 ELSE 1 END,
      c.created_at DESC
    LIMIT 250
  `) as AdminCommentRow[];

  return rows.map((row) => ({
    id: row.id,
    postId: row.post_id,
    postTitle: row.post_title,
    postSlug: row.post_slug,
    parentId: row.parent_id,
    depth: row.depth,
    authorName: row.author_name,
    authorEmail: row.author_email,
    authorWebsite: row.author_website,
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
  }));
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  const sql = getDb();

  if (!sql) {
    return [];
  }

  const rows = (await sql`
    SELECT
      id, name, email, company, role, quote, rating, consent, status,
      verified, created_at, approved_at
    FROM reviews
    ORDER BY
      CASE status WHEN 'pending' THEN 0 ELSE 1 END,
      created_at DESC
    LIMIT 250
  `) as AdminReviewRow[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role,
    quote: row.quote,
    rating: row.rating,
    consent: row.consent,
    status: row.status,
    verified: row.verified,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
  }));
}

export async function getAdminStats() {
  const sql = getDb();

  if (!sql) {
    return {
      pendingComments: 0,
      pendingReviews: 0,
      publishedPosts: 0,
      draftPosts: 0,
    };
  }

  const rows = (await sql`
    SELECT
      (SELECT count(*) FROM comments WHERE status = 'pending')::int AS pending_comments,
      (SELECT count(*) FROM reviews WHERE status = 'pending')::int AS pending_reviews,
      (SELECT count(*) FROM blog_posts WHERE status = 'published')::int AS published_posts,
      (SELECT count(*) FROM blog_posts WHERE status = 'draft')::int AS draft_posts
  `) as Array<{
    pending_comments: number;
    pending_reviews: number;
    published_posts: number;
    draft_posts: number;
  }>;

  return {
    pendingComments: rows[0]?.pending_comments ?? 0,
    pendingReviews: rows[0]?.pending_reviews ?? 0,
    publishedPosts: rows[0]?.published_posts ?? 0,
    draftPosts: rows[0]?.draft_posts ?? 0,
  };
}
