import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Newsletter } from "@/components/Shell";
import { getChanges, formatVerdictTransition } from "@/lib/changes";
import { verdictMeta } from "@/lib/verdicts";
import { daysSince } from "@/lib/verdicts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "What changed — verdict updates & toggle reversals",
  description:
    "Every tracked change: verdicts that flipped, toggles that came back, settings that moved. The reason to check back.",
  alternates: {
    types: { "application/rss+xml": `${site.url}/api/changes.xml` },
  },
};

export default async function ChangedPage() {
  const changes = await getChanges();

  return (
    <>
      <PageHeader title="what changed">
        every verdict flip, every toggle that came back, every setting that moved.{" "}
        {changes.length > 0
          ? `${changes.length} changes logged.`
          : "no changes logged yet — entries are being verified."}
      </PageHeader>

      <div className="mt-6">
        <a
          href="/api/changes.xml"
          className="chip hover:border-acid/60 hover:text-acid"
        >
          rss feed ↗
        </a>
      </div>

      {changes.length > 0 ? (
        <ol className="mt-6 space-y-3">
          {changes.map((c, i) => {
            const transition = formatVerdictTransition(c.verdictBefore, c.verdictAfter);
            const ago = daysSince(c.date);
            return (
              <li key={`${c.slug}-${c.date}-${i}`} className="panel p-4">
                <div className="flex flex-wrap items-baseline gap-2 text-sm">
                  <Link
                    href={`/${c.slug}`}
                    className="font-semibold hover:text-acid"
                  >
                    {c.app} — {c.feature}
                  </Link>
                  <span className="text-dim tabular-nums">{c.date}</span>
                  {ago < 30 && (
                    <span className="chip border-acid/40 text-acid">
                      {ago}d ago
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted">{c.note}</p>
                {transition && (
                  <p className="mt-1 text-xs">
                    <span className={verdictMeta[c.verdictBefore!].color}>
                      {verdictMeta[c.verdictBefore!].label}
                    </span>
                    <span className="text-dim"> → </span>
                    <span className={verdictMeta[c.verdictAfter!].color}>
                      {verdictMeta[c.verdictAfter!].label}
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="mt-6 panel p-6 text-center">
          <p className="text-sm text-muted">
            no changelog entries yet. as vendors update their products and
            toggles move, changes will appear here.
          </p>
          <p className="mt-2 text-xs text-dim">
            subscribe to the{" "}
            <a href="/api/changes.xml" className="text-acid underline">
              rss feed
            </a>{" "}
            or the newsletter to be notified.
          </p>
        </div>
      )}

      <Newsletter />
    </>
  );
}
