import { NextResponse } from "next/server";

import {
  HONEYPOT_FIELD,
  commentSubmissionSchema,
} from "@/lib/community-schema";
import { getDb } from "@/lib/db";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  isSameOrigin,
  readBodyWithLimit,
  requestHashes,
} from "@/lib/request-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Requests must come from the portfolio site." },
      { status: 403 },
    );
  }

  const rawBody = await readBodyWithLimit(request);

  if (rawBody === null) {
    return NextResponse.json(
      { error: "That comment is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Send a JSON object." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const honeypot = body[HONEYPOT_FIELD];

  if (
    honeypot !== undefined &&
    honeypot !== null &&
    String(honeypot).trim() !== ""
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = commentSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0] ?? "form"),
            issue.message,
          ]),
        ),
      },
      { status: 422 },
    );
  }

  const sql = getDb();

  if (!sql) {
    return NextResponse.json(
      {
        error:
          "Comments are not connected yet. Please email me directly in the meantime.",
      },
      { status: 503 },
    );
  }

  const comment = parsed.data;
  const posts = (await sql`
    SELECT id
    FROM blog_posts
    WHERE slug = ${comment.postSlug}
      AND status = 'published'
      AND published_at IS NOT NULL
      AND published_at <= now()
    LIMIT 1
  `) as Array<{ id: string }>;

  const post = posts[0];

  if (!post) {
    return NextResponse.json({ error: "That post was not found." }, { status: 404 });
  }

  let parentId: string | null = null;
  let depth = 0;

  if (comment.parentId) {
    const parents = (await sql`
      SELECT id, depth
      FROM comments
      WHERE id = ${comment.parentId}
        AND post_id = ${post.id}
        AND status = 'approved'
      LIMIT 1
    `) as Array<{ id: string; depth: number }>;

    const parent = parents[0];

    if (!parent) {
      return NextResponse.json(
        { error: "That comment is no longer available to reply to." },
        { status: 422 },
      );
    }

    parentId = parent.id;
    depth = parent.depth + 1;

    if (depth > 3) {
      return NextResponse.json(
        { error: "This thread is too deep. Reply to the main comment instead." },
        { status: 422 },
      );
    }
  }

  const hashes = requestHashes(request);
  const rate = await consumeRateLimit(
    `comment:${hashes.ipHash}`,
    5,
    15 * 60,
  );

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many comments from this connection. Try again later." },
      { status: 429 },
    );
  }

  try {
    await sql`
      INSERT INTO comments (
        post_id, parent_id, depth, author_name, author_email, author_website,
        body, ip_hash, user_agent_hash
      )
      VALUES (
        ${post.id},
        ${parentId},
        ${depth},
        ${comment.name},
        ${comment.email},
        ${comment.website || null},
        ${comment.body},
        ${hashes.ipHash},
        ${hashes.userAgentHash}
      )
    `;
  } catch (error) {
    console.error("[comments] Could not save comment:", error);

    return NextResponse.json(
      {
        error:
          "The comment could not be saved. Please try again or email me directly.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Thanks. Your comment is awaiting moderation and will appear once it has been checked.",
  });
}
