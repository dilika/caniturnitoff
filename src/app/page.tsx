import Link from "next/link";
import { EntryRow } from "@/components/EntryRow";
import { CategoryNav, Newsletter, StatStrip } from "@/components/Shell";
import { SponsorGrid, SponsorStrip } from "@/components/Sponsors";
import { rankedEntries, siteStats } from "@/lib/content";
import { site } from "@/lib/site";

export default function HomePage() {
  const entries = rankedEntries();
  const stats = siteStats();

  return (
    <>
      <section className="pb-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Can I turn <span className="text-acid">___</span> off?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {stats.total} AI features shipped into software you already paid for. one question each:
          can you actually turn it off, or is it the product now?
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-dim">
          <span className="chip">🟢 off — a real toggle</span>
          <span className="chip">🟡 buried — they hid it</span>
          <span className="chip">🔴 never — no opt-out</span>
          <a href={site.repo} className="chip hover:border-acid/60 hover:text-acid">
            not listed? submit it as a PR ↗
          </a>
        </div>
      </section>

      <StatStrip />

      <div className="mt-4">
        <CategoryNav />
      </div>

      <section className="panel mt-4">
        <div className="flex items-baseline justify-between border-b border-line px-3 py-2">
          <h2 className="text-xs uppercase tracking-widest text-dim">the offender list</h2>
          <span className="text-[10px] text-dim">worst first · verdict · votes</span>
        </div>

        {entries.slice(0, 8).map((entry) => (
          <EntryRow key={entry.slug} entry={entry} />
        ))}

        <SponsorStrip placement="list" />

        {entries.slice(8).map((entry) => (
          <EntryRow key={entry.slug} entry={entry} />
        ))}

        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-[11px] text-dim">
          <span>
            {stats.byVerdict.never} of {stats.total} cannot be turned off at all
          </span>
          <span className="flex gap-3">
            <Link href="/never" className="hover:text-never">
              wall of shame →
            </Link>
            <Link href="/comes-back" className="hover:text-flag">
              toggles that came back →
            </Link>
          </span>
        </div>
      </section>

      <Newsletter />
      <SponsorGrid />
    </>
  );
}
