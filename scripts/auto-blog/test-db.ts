import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT 1 as test`;
  console.log('DB connection:', rows);
}

main();