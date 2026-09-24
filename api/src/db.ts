import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";
import { readSecret } from "./secrets";

async function buildPool(): Promise<Pool> {
  const creds = await readSecret("postgres");
  return new Pool({
    host: creds.host,
    port: Number(creds.port),
    database: creds.database,
    user: creds.user,
    password: creds.password,
  });
}

export const pgPool = await buildPool();

const MIGRATIONS_DIR = join(import.meta.dir, "db/migrations");

// Migrations SQL numérotées appliquées au boot, verrouillées par
// pg_advisory_lock pour rester sûres si plusieurs instances démarrent
// en même temps (convention canonique CCOE-RULES §5.5).
export async function migrate(): Promise<void> {
  const client = await pgPool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(1)");
    await client.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
         name text PRIMARY KEY,
         applied_at timestamptz NOT NULL DEFAULT now()
       )`,
    );
    const { rows } = await client.query<{ name: string }>(
      "SELECT name FROM schema_migrations",
    );
    const applied = new Set(rows.map((r) => r.name));

    const files = readdirSync(MIGRATIONS_DIR).sort();
    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`[db] migration appliquée: ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(1)");
    client.release();
  }
}
