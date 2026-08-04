import { loadEntries, type RankedEntry } from "./content";
import { rankedEntries } from "./content";
import { verdictMeta, type Verdict } from "./verdicts";

export type ChangeEvent = {
  date: string;
  slug: string;
  app: string;
  feature: string;
  vendor: string;
  verdict: Verdict;
  note: string;
  verdictBefore?: Verdict;
  verdictAfter?: Verdict;
};

export async function getChanges(limit?: number): Promise<ChangeEvent[]> {
  const entries = await rankedEntries();
  const events: ChangeEvent[] = [];

  for (const e of entries) {
    for (const c of e.changelog) {
      events.push({
        date: c.date,
        slug: e.slug,
        app: e.app,
        feature: e.feature,
        vendor: e.vendor,
        verdict: e.verdict,
        note: c.note,
        verdictBefore: c.verdictBefore,
        verdictAfter: c.verdictAfter,
      });
    }
  }

  events.sort((a, b) => b.date.localeCompare(a.date));
  return limit ? events.slice(0, limit) : events;
}

export function isDisputedEntry(
  votes: { works: number; changed: number },
): boolean {
  return votes.changed >= 5 && votes.changed > votes.works;
}

export async function getDisputedEntries(): Promise<RankedEntry[]> {
  const entries = await rankedEntries();
  return entries.filter((e) => isDisputedEntry(e.votes));
}

export async function getStaleEntries(): Promise<RankedEntry[]> {
  const entries = await rankedEntries();
  const now = Date.now();
  return entries
    .filter((e) => {
      const then = new Date(e.lastVerified).getTime();
      if (Number.isNaN(then)) return true;
      return (now - then) / 86_400_000 > 90;
    })
    .sort((a, b) => a.lastVerified.localeCompare(b.lastVerified));
}

export function formatVerdictTransition(
  before?: Verdict,
  after?: Verdict,
): string | null {
  if (!before || !after) return null;
  return `${verdictMeta[before].label} → ${verdictMeta[after].label}`;
}
