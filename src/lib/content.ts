import fs from "node:fs";
import path from "node:path";
import { entrySchema, sponsorSchema, type Entry, type Sponsor } from "./schema";
import { verdictMeta, type Verdict } from "./verdicts";
import { getVoteCounts } from "./votes";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ENTRIES_DIR = path.join(CONTENT_DIR, "entries");

let cache: Entry[] | null = null;

export function loadEntries(): Entry[] {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const files = fs
    .readdirSync(ENTRIES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const entries = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(ENTRIES_DIR, file), "utf8"));
    const parsed = entrySchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `invalid entry ${file}:\n${parsed.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n")}`,
      );
    }
    if (parsed.data.slug !== file.replace(/\.json$/, "")) {
      throw new Error(`slug mismatch in ${file}: slug must equal filename`);
    }
    return parsed.data;
  });

  cache = entries;
  return entries;
}

export type RankedEntry = Entry & {
  rank: number;
  votes: { works: number; changed: number };
  heat: number;
};

/**
 * Ranking = the feature list order.
 * Harshest verdict first, then most disputed, then most annoying to disable.
 */
export async function rankedEntries(): Promise<RankedEntry[]> {
  const votes = await getVoteCounts();
  return loadEntries()
    .map((entry) => {
      const v = votes[entry.slug] ?? { works: 0, changed: 0 };
      const heat =
        verdictMeta[entry.verdict].weight * 100 +
        (entry.onByDefault ? 30 : 0) +
        (entry.comesBack ? 25 : 0) +
        entry.difficulty * 5 +
        v.changed * 3 +
        v.works;
      return { ...entry, votes: v, heat, rank: 0 };
    })
    .sort((a, b) => b.heat - a.heat || a.app.localeCompare(b.app))
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

export async function getEntry(slug: string): Promise<RankedEntry | undefined> {
  const entries = await rankedEntries();
  return entries.find((e) => e.slug === slug);
}

export async function entriesByCategory(category: string): Promise<RankedEntry[]> {
  const entries = await rankedEntries();
  return entries.filter((e) => e.category === category);
}

export async function entriesByVendor(vendor: string): Promise<RankedEntry[]> {
  const entries = await rankedEntries();
  return entries.filter(
    (e) => e.vendor.toLowerCase().replace(/\s+/g, "-") === vendor,
  );
}

export function vendorSlug(vendor: string): string {
  return vendor.toLowerCase().replace(/\s+/g, "-");
}

export type SiteStats = {
  total: number;
  byVerdict: Record<Verdict, number>;
  neverShare: number;
  onByDefault: number;
  comesBack: number;
  votes: number;
  vendors: number;
};

export async function siteStats(): Promise<SiteStats> {
  const entries = await rankedEntries();
  const byVerdict = { off: 0, buried: 0, never: 0 } as Record<Verdict, number>;
  let onByDefault = 0;
  let comesBack = 0;
  let votes = 0;
  const vendors = new Set<string>();

  for (const e of entries) {
    byVerdict[e.verdict] += 1;
    if (e.onByDefault) onByDefault += 1;
    if (e.comesBack) comesBack += 1;
    votes += e.votes.works + e.votes.changed;
    vendors.add(e.vendor);
  }

  return {
    total: entries.length,
    byVerdict,
    neverShare: entries.length ? Math.round((byVerdict.never / entries.length) * 100) : 0,
    onByDefault,
    comesBack,
    votes,
    vendors: vendors.size,
  };
}

export function loadSponsors(): Sponsor[] {
  const file = path.join(CONTENT_DIR, "sponsors.json");
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  return sponsorSchema.array().parse(raw);
}
