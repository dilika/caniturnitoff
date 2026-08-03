import Link from "next/link";
import type { RankedEntry } from "@/lib/content";
import { categoryMeta, site } from "@/lib/site";
import { isStale } from "@/lib/verdicts";
import { Flag, VerdictBadge } from "./VerdictBadge";

export function EntryRow({ entry }: { entry: RankedEntry }) {
  const cat = categoryMeta(entry.category);
  const stale = isStale(entry.lastVerified, site.staleAfterDays);
  const votes = entry.votes.works + entry.votes.changed;

  return (
    <Link
      href={`/${entry.slug}`}
      className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-3 border-b border-line px-3 py-2.5 transition-colors hover:bg-panel-2 sm:grid-cols-[2.2rem_1fr_9rem_5.5rem_3rem]"
    >
      <span className="text-dim tabular-nums text-xs">
        {String(entry.rank).padStart(2, "0")}
      </span>

      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="truncate font-semibold text-fg group-hover:text-acid">{entry.app}</span>
          <span className="truncate text-muted">{entry.feature}</span>
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          {entry.onByDefault && <Flag tone="warn">on by default</Flag>}
          {entry.comesBack && <Flag tone="flag">comes back</Flag>}
          {entry.enterpriseOnly && <Flag>admin only</Flag>}
          {stale && <Flag>stale</Flag>}
        </span>
      </span>

      <span className="hidden text-xs text-muted sm:block">
        {cat?.emoji} {cat?.label}
      </span>

      <span className="justify-self-start sm:justify-self-end">
        <VerdictBadge verdict={entry.verdict} />
      </span>

      <span className="hidden justify-self-end text-xs text-dim tabular-nums sm:block">
        {votes || "–"}
      </span>
    </Link>
  );
}
