import fs from "node:fs";
import path from "node:path";

/**
 * Vote store — deliberately swappable.
 *
 * v0: a JSON file on disk. Works locally and on any single-node host (VPS, Fly, Render).
 * v1: swap the two functions below for Turso/libSQL or Upstash Redis when the site goes
 *     on a serverless host. Nothing else in the codebase touches the storage.
 */

export type VoteKind = "works" | "changed";
export type VoteCounts = Record<string, { works: number; changed: number }>;

const DATA_DIR = path.join(process.cwd(), "data");
const VOTES_FILE = path.join(DATA_DIR, "votes.json");

function read(): VoteCounts {
  try {
    return JSON.parse(fs.readFileSync(VOTES_FILE, "utf8")) as VoteCounts;
  } catch {
    return {};
  }
}

function write(counts: VoteCounts): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(VOTES_FILE, JSON.stringify(counts, null, 2));
}

export function getVoteCounts(): VoteCounts {
  return read();
}

export function getVotes(slug: string): { works: number; changed: number } {
  return read()[slug] ?? { works: 0, changed: 0 };
}

export function castVote(slug: string, kind: VoteKind): { works: number; changed: number } {
  const counts = read();
  const current = counts[slug] ?? { works: 0, changed: 0 };
  current[kind] += 1;
  counts[slug] = current;
  write(counts);
  return current;
}

/** 5+ "it changed" in the last cycle puts an entry in the review queue (see docs/EDITORIAL.md). */
export function isDisputed(votes: { works: number; changed: number }): boolean {
  return votes.changed >= 5 && votes.changed > votes.works;
}
