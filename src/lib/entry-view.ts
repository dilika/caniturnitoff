import type { RankedEntry } from "./content";
import type { Verdict } from "./verdicts";

/**
 * Lean, serializable shape of an entry for list/table rendering.
 * Keeps the client payload small — no steps, sources or alternatives.
 */
export type ExplorerEntry = {
  slug: string;
  app: string;
  feature: string;
  vendor: string;
  category: string;
  verdict: Verdict;
  onByDefault: boolean;
  comesBack: boolean;
  enterpriseOnly: boolean;
  difficulty: number;
  lastVerified: string;
  rank: number;
  votes: number;
};

export function toExplorerEntry(e: RankedEntry): ExplorerEntry {
  return {
    slug: e.slug,
    app: e.app,
    feature: e.feature,
    vendor: e.vendor,
    category: e.category,
    verdict: e.verdict,
    onByDefault: e.onByDefault,
    comesBack: e.comesBack,
    enterpriseOnly: e.enterpriseOnly,
    difficulty: e.difficulty,
    lastVerified: e.lastVerified,
    rank: e.rank,
    votes: e.votes.works + e.votes.changed,
  };
}
