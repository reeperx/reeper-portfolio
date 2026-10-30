import "server-only";

import { getDb } from "@/lib/db";

type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
};

/**
 * A small fixed-window limiter stored in Postgres. Serverless instances do not
 * share memory, so the database is the only reliable place for this counter.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const sql = getDb();

  if (!sql) {
    // Rate limiting is defence-in-depth, not the only protection. If the
    // database is not configured, let the caller decide whether the feature
    // can work at all instead of blocking admin login.
    return { allowed: true, count: 0, limit };
  }

  try {
    const rows = (await sql`
      INSERT INTO rate_limits (key, window_start, count)
      VALUES (${key}, now(), 1)
      ON CONFLICT (key) DO UPDATE SET
        count = CASE
          WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSeconds})
            THEN 1
          ELSE rate_limits.count + 1
        END,
        window_start = CASE
          WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSeconds})
            THEN now()
          ELSE rate_limits.window_start
        END
      RETURNING count
    `) as Array<{ count: number }>;

    const count = Number(rows[0]?.count ?? 1);

    return {
      allowed: count <= limit,
      count,
      limit,
    };
  } catch (error) {
    // A transient database failure should not take the whole site down. Log
    // it, fail open for this request, and let the database recover.
    console.error("[rate-limit] Could not update the limiter:", error);
    return { allowed: true, count: 0, limit };
  }
}
