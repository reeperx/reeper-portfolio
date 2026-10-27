import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  HONEYPOT_FIELD,
  contactInquirySchema,
  getContactFieldErrors,
} from "@/lib/contact-schema";
import {
  renderContactInquiryEmail,
  renderContactInquiryText,
} from "@/lib/email/contact-inquiry";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function requestHost(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");

  return host?.split(",")[0]?.trim() ?? null;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "That message is too large." },
      { status: 413 },
    );
  }

  const origin = request.headers.get("origin");

  if (origin) {
    const host = requestHost(request);

    try {
      if (!host || new URL(origin).host !== host) {
        return NextResponse.json(
          { error: "Requests must come from the portfolio site." },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 },
      );
    }
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Send a JSON body." },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json(
      { error: "Send a JSON object." },
      { status: 400 },
    );
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

  const parsed = contactInquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: getContactFieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL, or RESEND_FROM_EMAIL.",
    );

    return NextResponse.json(
      {
        error:
          "The contact form is not configured yet. Please email me directly.",
      },
      { status: 503 },
    );
  }

  const inquiry = parsed.data;
  const subject = `New project inquiry — ${oneLine(
    inquiry.projectType,
  )} from ${oneLine(inquiry.name)}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: inquiry.email,
      subject,
      html: renderContactInquiryEmail(inquiry),
      text: renderContactInquiryText(inquiry),
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);

      return NextResponse.json(
        {
          error:
            "The message could not be sent. Please try again or email me directly.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Failed to send the message:", error);

    return NextResponse.json(
      {
        error:
          "The message could not be sent. Please try again or email me directly.",
      },
      { status: 502 },
    );
  }
}
