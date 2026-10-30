import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  HONEYPOT_FIELD,
  reviewSubmissionSchema,
} from "@/lib/community-schema";
import { getDb } from "@/lib/db";
import {
  renderReviewNotificationEmail,
  renderReviewNotificationText,
} from "@/lib/email/review-notification";
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
      { error: "That review is too large." },
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

  const parsed = reviewSubmissionSchema.safeParse(body);

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
          "Reviews are not connected yet. Please email me directly in the meantime.",
      },
      { status: 503 },
    );
  }

  const hashes = requestHashes(request);
  const rate = await consumeRateLimit(
    `review:${hashes.ipHash}`,
    3,
    60 * 60,
  );

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many reviews from this connection. Try again later." },
      { status: 429 },
    );
  }

  const review = parsed.data;

  try {
    await sql`
      INSERT INTO reviews (
        name, email, company, role, quote, rating, consent,
        ip_hash, user_agent_hash
      )
      VALUES (
        ${review.name},
        ${review.email},
        ${review.company || null},
        ${review.role || null},
        ${review.quote},
        ${review.rating},
        ${review.consent},
        ${hashes.ipHash},
        ${hashes.userAgentHash}
      )
    `;
  } catch (error) {
    console.error("[reviews] Could not save review:", error);

    return NextResponse.json(
      {
        error:
          "The review could not be saved. Please try again or email me directly.",
      },
      { status: 500 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (apiKey && to && from) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: review.email,
        subject: `New review awaiting moderation — ${review.name}`,
        text: renderReviewNotificationText(review),
        html: renderReviewNotificationEmail(review),
      });

      if (error) {
        console.error("[reviews] Resend rejected the notification:", error);
      }
    } catch (error) {
      console.error("[reviews] Could not send the notification:", error);
    }
  }

  return NextResponse.json({
    ok: true,
    message:
      "Thanks. Your review is with me for moderation and will appear only after I check it.",
  });
}
