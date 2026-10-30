import "server-only";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";

import {
  clientIpFromHeaders,
  hashValue,
} from "@/lib/request-security";

export const VISITOR_COOKIE = "togb_visitor";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;

const visitorCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: VISITOR_MAX_AGE,
  path: "/",
};

export async function getVisitorId() {
  return (await cookies()).get(VISITOR_COOKIE)?.value ?? null;
}

/**
 * Only call this from a Route Handler or Server Action. Server Components
 * cannot set cookies.
 */
export async function ensureVisitorId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VISITOR_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const visitorId = randomUUID();
  cookieStore.set(VISITOR_COOKIE, visitorId, visitorCookieOptions);
  return visitorId;
}

export function viewerHash(
  visitorId: string,
  ipHash: string,
  userAgentHash: string,
) {
  return hashValue(`viewer|${visitorId}|${ipHash}|${userAgentHash}`);
}

export async function getPageViewerHash() {
  const visitorId = await getVisitorId();

  if (!visitorId) {
    return null;
  }

  const requestHeaders = await headers();
  const ipHash = hashValue(
    `ip|${clientIpFromHeaders(requestHeaders)}`,
  );
  const userAgentHash = hashValue(
    `ua|${requestHeaders.get("user-agent")?.trim() || "unknown"}`,
  );

  return viewerHash(visitorId, ipHash, userAgentHash);
}
