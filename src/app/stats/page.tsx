import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, StatStrip } from "@/components/Shell";
import { rankedEntries, siteStats } from "@/lib/content";
import { verdictMeta, VERDICTS } from "@/lib/verdicts";

export const metadata: Metadata = {
  title: "Stats — the state of the off switch",
  description:
    "Public dataset stats: how many AI features can be turned off, how many are on by default, and which vendors have the most features without an off switch.",
};

export default async function StatsPage() {
  const stats = await siteStats();
  const entries = await rankedEntries();

  const byVendor = Object.entries(
    entries.reduce<Record<string, { total: number; never: number }>>((acc, e) => {
      acc[e.vendor] ??= { total: 0, never: 0 };
      acc[e.vendor].total += 1;
      if (e.verdict === "never") acc[e.vendor].never += 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1].never - a[1].never || b[1].total - a[1].total);

  return (
    <article className="space-y-7">
      <PageHeader title="stats">
        public, because why not. {stats.total} features, {stats.vendors} vendors, {stats.votes}{" "}
        votes.
      </PageHeader>

      <StatStrip />

      <section>
        <h2 className="mb-2 text-xs uppercase tracking-widest text-dim">verdict split</h2>
        <div className="space-y-1">
          {VERDICTS.map((v) => {
            const n = stats.byVerdict[v];
            const pct = stats.total ? Math.round((n / stats.total) * 100) : 0;
            return (
              <div key={v} className="flex items-center gap-3">
                <span className={`w-24 text-xs font-semibold ${verdictMeta[v].color}`}>
                  {verdictMeta[v].label}
                </span>
                <span className="h-3 flex-1 border border-line">
                  <span
                    className={`block h-full ${verdictMeta[v].bg}`}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-16 text-right text-xs tabular-nums text-muted">
                  {n} · {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs uppercase tracking-widest text-dim">by vendor</h2>
        <div className="panel divide-y divide-line">
          {byVendor.map(([vendor, v]) => (
            <Link
              key={vendor}
              href={`/vendor/${vendor.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center justify-between px-3 py-2 text-sm hover:bg-panel-2"
            >
              <span>{vendor}</span>
              <span className="text-xs text-muted tabular-nums">
                {v.total} tracked · <span className="text-never">{v.never} no off switch</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel p-4 text-sm text-muted">
        <h2 className="text-xs uppercase tracking-widest text-dim">dataset</h2>
        <p className="mt-2">
          {stats.onByDefault} of {stats.total} features are on by default.{" "}
          {stats.comesBack} are documented to come back after an update.
        </p>
        <p className="mt-2">
          raw json:{" "}
          <Link href="/api/entries.json" className="text-acid underline">
            /api/entries.json
          </Link>{" "}
          — free, CC-BY, no key.
        </p>
      </section>
    </article>
  );
}
