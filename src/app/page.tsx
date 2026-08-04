import { Explorer } from "@/components/Explorer";
import { ForcedOnMeter } from "@/components/ForcedOnMeter";
import { Newsletter } from "@/components/Shell";
// import { SponsorGrid } from "@/components/Sponsors"; // sponsors paused until traffic justifies it
import { rankedEntries, siteStats } from "@/lib/content";
import { toExplorerEntry } from "@/lib/entry-view";
import { getChanges, getDisputedEntries } from "@/lib/changes";
import { daysSince } from "@/lib/verdicts";
import Link from "next/link";

export default async function HomePage() {
  const ranked = await rankedEntries();
  const stats = await siteStats();
  const recentChanges = await getChanges(5);
  const disputed = await getDisputedEntries();

  const entries = ranked.map(toExplorerEntry);

  const tickerNames = ranked
    .filter((e) => e.onByDefault)
    .slice(0, 12)
    .map((e) => `${e.app} ${e.feature}`);

  return (
    <>
      <section className="pt-12 text-center sm:pt-16">
        <h1 className="text-6xl font-semibold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
          Can I turn <span className="text-acid">___</span> off?
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          {stats.total} AI features added to software you already use. one question each:
          can you actually turn it off, or is it part of the product?
        </p>
      </section>

      {(recentChanges.length > 0 || disputed.length > 0) && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {recentChanges.length > 0 && (
            <div className="panel p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-widest text-dim">recent changes</h2>
                <Link href="/changed" className="text-xs text-acid hover:underline">all →</Link>
              </div>
              <ul className="mt-3 space-y-2">
                {recentChanges.map((c, i) => (
                  <li key={`${c.slug}-${c.date}-${i}`} className="text-sm">
                    <Link href={`/${c.slug}`} className="font-medium hover:text-acid">
                      {c.app} — {c.feature}
                    </Link>
                    <span className="ml-2 text-xs text-dim tabular-nums">{daysSince(c.date)}d ago</span>
                    <p className="text-xs text-muted">{c.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {disputed.length > 0 && (
            <div className="panel p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-widest text-dim">community disputes</h2>
                <Link href="/disputed" className="text-xs text-acid hover:underline">all →</Link>
              </div>
              <p className="mt-3 text-sm text-muted">
                {disputed.length} {disputed.length === 1 ? "entry" : "entries"} where people say the toggle no longer works as documented.
              </p>
              <ul className="mt-2 space-y-1">
                {disputed.slice(0, 4).map((e) => (
                  <li key={e.slug} className="text-sm">
                    <Link href={`/${e.slug}`} className="hover:text-acid">
                      {e.app} — {e.feature}
                    </Link>
                    <span className="ml-2 text-xs text-never">{e.votes.changed} changed</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <Explorer
        entries={entries}
        meter={
          <ForcedOnMeter
            count={stats.onByDefault}
            total={stats.total}
            names={tickerNames}
          />
        }
      />

      <Newsletter />
      {/* <SponsorGrid /> — sponsors paused until traffic justifies it */}
    </>
  );
}
