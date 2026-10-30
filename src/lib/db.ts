import "server-only";

import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDb() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    return null;
  }

  if (!client) {
    client = neon(url);
  }

  return client;
}

export function requireDb() {
  const sql = getDb();

  if (!sql) {
    throw new Error(
      "DATABASE_URL is not set. Add the Neon connection string before using the community features.",
    );
  }

  return sql;
}
