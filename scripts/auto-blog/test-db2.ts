import { neon } from '@neondatabase/serverless';

async function main() {
  const url = 'postgresql://neondb_owner:npg_1S4jsBQfcYwh@ep-wandering-cloud-bavlcn8s-pooler.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require';
  const sql = neon(url);
  const rows = await sql`SELECT 1 as test`;
  console.log('DB connection:', rows);
}

main();