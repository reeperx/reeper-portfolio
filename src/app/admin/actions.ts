"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";

import {
  adminLoginSchema,
  adminPostSchema,
  parseTags,
} from "@/lib/community-schema";
import {
  clearAdminSession,
  createAdminSession,
  requireAdmin,
  verifyAdminPassword,
} from "@/lib/auth";
import { getDb, requireDb } from "@/lib/db";
import { slugify } from "@/lib/format";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  clientIpFromHeaders,
  hashValue,
} from "@/lib/request-security";

export type LoginState = {
  error?: string;
};

export type PostFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function fieldErrorsFrom(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");

    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = adminLoginSchema.safeParse({
    password: stringValue(formData, "password"),
  });

  if (!parsed.success) {
    return { error: "Enter the admin password." };
  }

  if (process.env.DATABASE_URL) {
    const requestHeaders = await headers();
    const ipHash = hashValue(
      `ip|${clientIpFromHeaders(requestHeaders)}`,
    );
    const rate = await consumeRateLimit(`admin-login:${ipHash}`, 8, 15 * 60);

    if (!rate.allowed) {
      return {
        error: "Too many attempts from this connection. Try again in 15 minutes.",
      };
    }
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return { error: "That password is not correct." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function savePostAction(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();

  const parsed = adminPostSchema.safeParse({
    id: stringValue(formData, "id"),
    title: stringValue(formData, "title"),
    slug: stringValue(formData, "slug"),
    excerpt: stringValue(formData, "excerpt"),
    content: stringValue(formData, "content"),
    coverImageUrl: stringValue(formData, "coverImageUrl"),
    coverImageAlt: stringValue(formData, "coverImageAlt"),
    tags: stringValue(formData, "tags"),
    status: stringValue(formData, "status"),
    publishedAt: stringValue(formData, "publishedAt"),
  });

  if (!parsed.success) {
    return {
      error: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const data = parsed.data;
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);

  if (!slug) {
    return {
      error: "Please check the highlighted fields.",
      fieldErrors: { slug: "Add a slug using letters, numbers, and dashes." },
    };
  }

  let publishedAt: string | null = null;

  if (data.status === "published") {
    const candidate = data.publishedAt
      ? new Date(data.publishedAt)
      : new Date();

    if (Number.isNaN(candidate.getTime())) {
      return {
        error: "Please check the highlighted fields.",
        fieldErrors: { publishedAt: "Enter a valid publication date." },
      };
    }

    publishedAt = candidate.toISOString();
  }

  const tags = parseTags(data.tags);
  const sql = getDb();

  if (!sql) {
    return {
      error:
        "DATABASE_URL is not configured. Add the Neon connection string before saving posts.",
    };
  }

  try {
    if (data.id) {
      const rows = (await sql`
        UPDATE blog_posts
        SET
          slug = ${slug},
          title = ${data.title},
          excerpt = ${data.excerpt},
          content = ${data.content},
          cover_image_url = ${data.coverImageUrl || null},
          cover_image_alt = ${data.coverImageAlt || null},
          tags = ${JSON.stringify(tags)}::jsonb,
          status = ${data.status},
          published_at = ${publishedAt}
        WHERE id = ${data.id}
        RETURNING id
      `) as Array<{ id: string }>;

      if (!rows[0]) {
        return { error: "That post no longer exists." };
      }

      updateTag("blog-posts");
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/sitemap.xml");
      redirect(`/admin/posts/${data.id}?saved=1`);
    }

    const rows = (await sql`
      INSERT INTO blog_posts (
        slug, title, excerpt, content, cover_image_url, cover_image_alt,
        tags, status, published_at
      )
      VALUES (
        ${slug},
        ${data.title},
        ${data.excerpt},
        ${data.content},
        ${data.coverImageUrl || null},
        ${data.coverImageAlt || null},
        ${JSON.stringify(tags)}::jsonb,
        ${data.status},
        ${publishedAt}
      )
      RETURNING id
    `) as Array<{ id: string }>;

    const created = rows[0];

    if (!created) {
      return { error: "The post could not be created." };
    }

    updateTag("blog-posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
    redirect(`/admin/posts/${created.id}?saved=1`);
  } catch (error) {
    unstable_rethrow(error);

    if (isUniqueViolation(error)) {
      return {
        error: "Please check the highlighted fields.",
        fieldErrors: { slug: "That slug is already used by another post." },
      };
    }

    console.error("[admin] Could not save post:", error);
    return { error: "The post could not be saved. Please try again." };
  }
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = stringValue(formData, "id");

  if (!id) {
    redirect("/admin/posts");
  }

  const sql = requireDb();
  await sql`DELETE FROM blog_posts WHERE id = ${id}`;

  updateTag("blog-posts");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  redirect("/admin/posts");
}

export async function moderateCommentAction(formData: FormData) {
  await requireAdmin();
  const id = stringValue(formData, "id");
  const action = stringValue(formData, "action");

  if (!id) {
    redirect("/admin/comments");
  }

  const sql = requireDb();
  const rows = (await sql`
    SELECT c.id, p.slug
    FROM comments c
    JOIN blog_posts p ON p.id = c.post_id
    WHERE c.id = ${id}
    LIMIT 1
  `) as Array<{ id: string; slug: string }>;

  const comment = rows[0];

  if (!comment) {
    redirect("/admin/comments");
  }

  if (action === "delete") {
    await sql`DELETE FROM comments WHERE id = ${id}`;
  } else if (action === "approve") {
    await sql`
      UPDATE comments
      SET status = 'approved', approved_at = now()
      WHERE id = ${id}
    `;
  } else if (action === "reject") {
    await sql`
      UPDATE comments
      SET status = 'rejected', approved_at = null
      WHERE id = ${id}
    `;
  } else if (action === "spam") {
    await sql`
      UPDATE comments
      SET status = 'spam', approved_at = null
      WHERE id = ${id}
    `;
  }

  revalidatePath(`/blog/${comment.slug}`);
  revalidatePath("/admin/comments");
  redirect("/admin/comments");
}

export async function moderateReviewAction(formData: FormData) {
  await requireAdmin();
  const id = stringValue(formData, "id");
  const action = stringValue(formData, "action");
  const verified = formData.get("verified") === "on";

  if (!id) {
    redirect("/admin/reviews");
  }

  const sql = requireDb();

  if (action === "delete") {
    await sql`DELETE FROM reviews WHERE id = ${id}`;
  } else if (action === "approve") {
    await sql`
      UPDATE reviews
      SET status = 'approved', approved_at = now(), verified = ${verified}
      WHERE id = ${id}
    `;
  } else if (action === "reject") {
    await sql`
      UPDATE reviews
      SET status = 'rejected', approved_at = null
      WHERE id = ${id}
    `;
  }

  updateTag("reviews");
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function toggleReviewVerifiedAction(formData: FormData) {
  await requireAdmin();
  const id = stringValue(formData, "id");

  if (!id) {
    redirect("/admin/reviews");
  }

  const sql = requireDb();
  await sql`
    UPDATE reviews
    SET verified = NOT verified
    WHERE id = ${id} AND status = 'approved'
  `;

  updateTag("reviews");
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}
