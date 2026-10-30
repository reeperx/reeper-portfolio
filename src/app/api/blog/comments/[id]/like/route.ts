import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  isSameOrigin,
  requestHashes,
} from "@/lib/request-security";
import { ensureVisitorId, viewerHash } from "@/lib/visitor";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Requests must come from the portfolio site." },
      { status: 403 },
    );
  }

  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const sql = getDb();

  if (!sql) {
    return NextResponse.json(
      { error: "Likes are not connected yet." },
      { status: 503 },
    );
  }

  const comments = (await sql`
    SELECT id
    FROM comments
    WHERE id = ${id} AND status = 'approved'
    LIMIT 1
  `) as Array<{ id: string }>;

  if (!comments[0]) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const hashes = requestHashes(request);
  const rate = await consumeRateLimit(`like:${hashes.ipHash}`, 60, 10 * 60);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many likes from this connection. Try again later." },
      { status: 429 },
    );
  }

  const visitorId = await ensureVisitorId();
  const voterHash = viewerHash(
    visitorId,
    hashes.ipHash,
    hashes.userAgentHash,
  );

  const deleted = (await sql`
    DELETE FROM comment_likes
    WHERE comment_id = ${id} AND voter_hash = ${voterHash}
    RETURNING comment_id
  `) as Array<{ comment_id: string }>;

  const liked = deleted.length === 0;

  if (liked) {
    await sql`
      INSERT INTO comment_likes (comment_id, voter_hash)
      VALUES (${id}, ${voterHash})
      ON CONFLICT DO NOTHING
    `;
  }

  const counts = (await sql`
    SELECT count(*)::int AS count
    FROM comment_likes
    WHERE comment_id = ${id}
  `) as Array<{ count: number }>;

  return NextResponse.json({
    ok: true,
    liked,
    count: counts[0]?.count ?? 0,
  });
}
