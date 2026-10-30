import "server-only";

import { createHash } from "node:crypto";

export const MAX_JSON_BODY_BYTES = 24_000;

export function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function requestHost(request: Request) {
  const host = request.headers.get("host")?.trim();

  if (host) {
    return host.toLowerCase();
  }

  try {
    return new URL(request.url).host.toLowerCase();
  } catch {
    return null;
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const host = requestHost(request);

  try {
    return Boolean(host) && new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

export function clientIpFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");

  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();

    if (first) {
      return first;
    }
  }

  return (
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

export function clientIp(request: Request) {
  return clientIpFromHeaders(request.headers);
}

export function clientUserAgent(request: Request) {
  return request.headers.get("user-agent")?.trim() || "unknown";
}

export function hashValue(value: string) {
  const salt = process.env.IP_HASH_SALT?.trim() || "togb-development-salt";
  return createHash("sha256").update(`${salt}|${value}`).digest("hex");
}

export function requestHashes(request: Request) {
  return {
    ipHash: hashValue(`ip|${clientIp(request)}`),
    userAgentHash: hashValue(`ua|${clientUserAgent(request)}`),
  };
}

export async function readBodyWithLimit(
  request: Request,
  limit = MAX_JSON_BODY_BYTES,
): Promise<string | null> {
  if (!request.body) {
    return "";
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      received += value.byteLength;

      if (received > limit) {
        await reader.cancel();
        return null;
      }

      text += decoder.decode(value, { stream: true });
    }

    return text + decoder.decode();
  } catch {
    await reader.cancel().catch(() => {});
    return null;
  }
}

export async function readJsonBody(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const rawBody = await readBodyWithLimit(request);

  if (rawBody === null) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(rawBody);

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return null;
    }

    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}
