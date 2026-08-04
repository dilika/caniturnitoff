"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ExplorerEntry } from "@/lib/entry-view";
import { categoryMeta, site } from "@/lib/site";
import { isStale } from "@/lib/verdicts";
import { Flag, VerdictBadge } from "./VerdictBadge";

export function EntryTable({
  entries,
  emptyLabel = "nothing here yet. that will not last.",
}: {
  entries: ExplorerEntry[];
  emptyLabel?: string;
}) {
  const router = useRouter();

  if (!entries.length) {
    return <p className="px-1 py-8 text-center text-sm text-dim">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-base">
        <thead>
          <tr className="border-b border-line">
            <th className="thead-cell w-8">#</th>
            <th className="thead-cell">app</th>
            <th className="thead-cell hidden sm:table-cell">category</th>
            <th className="thead-cell hidden w-24 md:table-cell">effort</th>
            <th className="thead-cell w-20">verdict</th>
            <th className="thead-cell hidden w-14 text-right sm:table-cell">votes</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const cat = categoryMeta(e.category);
            const stale = isStale(e.lastVerified, site.staleAfterDays);
            return (
              <tr
                key={e.slug}
                onClick={() => router.push(`/${e.slug}`)}
                className="cursor-pointer border-b border-line transition-colors hover:bg-panel-2"
              >
                <td className="tbody-cell text-sm tabular-nums text-dim">
                  {String(e.rank).padStart(2, "0")}
                </td>

                <td className="tbody-cell">
                  <Link
                    href={`/${e.slug}`}
                    onClick={(ev) => ev.stopPropagation()}
                    className="font-semibold hover:text-acid"
                  >
                    {e.app}
                  </Link>
                  <span className="ml-1.5 text-muted">{e.feature}</span>
                  {(e.onByDefault || e.comesBack || e.enterpriseOnly || stale) && (
                    <span className="mt-1 flex flex-wrap items-center gap-1">
                      {e.onByDefault && <Flag tone="warn">on by default</Flag>}
                      {e.comesBack && <Flag tone="flag">comes back</Flag>}
                      {e.enterpriseOnly && <Flag>admin only</Flag>}
                      {stale && <Flag>stale</Flag>}
                    </span>
                  )}
                </td>

                <td className="tbody-cell hidden text-sm text-muted sm:table-cell">
                  {cat?.emoji} {cat?.label}
                </td>

                <td className="tbody-cell hidden md:table-cell">
                  <Effort level={e.difficulty} />
                </td>

                <td className="tbody-cell">
                  <VerdictBadge verdict={e.verdict} />
                </td>

                <td className="tbody-cell hidden text-right text-sm tabular-nums text-dim sm:table-cell">
                  {e.votes || "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Effort({ level }: { level: number }) {
  const tone = level <= 2 ? "bg-off" : level === 3 ? "bg-buried" : "bg-never";
  return (
    <span className="flex items-center gap-1" title={`difficulty ${level}/5`}>
      <span className="flex gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-3 w-[4px] rounded-[1px] ${i <= level ? tone : "bg-line-2"}`}
          />
        ))}
      </span>
      <span className="text-sm tabular-nums text-dim">{level}/5</span>
    </span>
  );
}

