import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "togb_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

function sign(expires: string) {
  return createHmac("sha256", sessionSecret())
    .update(`togb-admin:${expires}`)
    .digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function isAdminConfigured() {
  return Boolean(adminPassword() && sessionSecret());
}

export function verifyAdminPassword(value: string) {
  const expected = adminPassword();

  if (!expected) {
    return false;
  }

  return safeEqual(value, expected);
}

export async function isAdminAuthenticated() {
  if (!isAdminConfigured()) {
    return false;
  }

  const token = (await cookies()).get(ADMIN_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const separator = token.indexOf(".");

  if (separator === -1) {
    return false;
  }

  const expires = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expiresAt = Number(expires);

  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  return safeEqual(signature, sign(expires));
}

export async function createAdminSession() {
  const expires = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}
