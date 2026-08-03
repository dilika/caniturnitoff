import { createClient, type Client } from "@libsql/client";

export type VoteKind = "works" | "changed";
export type VoteCounts = Record<string, { works: number; changed: number }>;

let _client: Client | null = null;

function client(): Client {
  if (!_client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url) throw new Error("TURSO_DATABASE_URL is not set");
    _client = createClient({ url, authToken });
  }
  return _client;
}

let _initialized = false;

async function ensureSchema(): Promise<void> {
  if (_initialized) return;
  const db = client();
  await db.execute(
    `CREATE TABLE IF NOT EXISTS votes (
      slug TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('works', 'changed')),
      ip TEXT NOT NULL DEFAULT '',
      voter_id TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY (slug, kind, ip, voter_id)
    )`
  );
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_votes_slug ON votes(slug)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_votes_created ON votes(created_at)`);
  _initialized = true;
}

export async function getVoteCounts(): Promise<VoteCounts> {
  await ensureSchema();
  const rs = await client().execute(
    `SELECT slug,
       SUM(CASE WHEN kind = 'works' THEN 1 ELSE 0 END) AS works,
       SUM(CASE WHEN kind = 'changed' THEN 1 ELSE 0 END) AS changed
     FROM votes GROUP BY slug`
  );
  const counts: VoteCounts = {};
  for (const row of rs.rows) {
    counts[row.slug as string] = {
      works: Number(row.works ?? 0),
      changed: Number(row.changed ?? 0),
    };
  }
  return counts;
}

export async function getVotes(slug: string): Promise<{ works: number; changed: number }> {
  await ensureSchema();
  const rs = await client().execute({
    sql: `SELECT
            SUM(CASE WHEN kind = 'works' THEN 1 ELSE 0 END) AS works,
            SUM(CASE WHEN kind = 'changed' THEN 1 ELSE 0 END) AS changed
          FROM votes WHERE slug = ?`,
    args: [slug],
  });
  const row = rs.rows[0];
  return {
    works: Number(row?.works ?? 0),
    changed: Number(row?.changed ?? 0),
  };
}

export async function castVote(
  slug: string,
  kind: VoteKind,
  opts?: { ip?: string; voterId?: string }
): Promise<{ works: number; changed: number }> {
  await ensureSchema();
  const ip = opts?.ip ?? "";
  const voterId = opts?.voterId ?? "";

  await client().execute({
    sql: `INSERT OR IGNORE INTO votes (slug, kind, ip, voter_id) VALUES (?, ?, ?, ?)`,
    args: [slug, kind, ip, voterId],
  });

  return getVotes(slug);
}

export async function hasVoted(
  slug: string,
  ip: string,
  voterId: string
): Promise<boolean> {
  await ensureSchema();
  const rs = await client().execute({
    sql: `SELECT 1 FROM votes WHERE slug = ? AND (ip = ? OR voter_id = ?) LIMIT 1`,
    args: [slug, ip, voterId],
  });
  return rs.rows.length > 0;
}

/** 5+ "it changed" in the last cycle puts an entry in the review queue (see docs/EDITORIAL.md). */
export function isDisputed(votes: { works: number; changed: number }): boolean {
  return votes.changed >= 5 && votes.changed > votes.works;
}
