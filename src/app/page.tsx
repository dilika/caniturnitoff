import { Explorer } from "@/components/Explorer";
import { ForcedOnMeter } from "@/components/ForcedOnMeter";
import { Newsletter } from "@/components/Shell";
// import { SponsorGrid } from "@/components/Sponsors"; // sponsors paused until traffic justifies it
import { rankedEntries, siteStats } from "@/lib/content";
import { toExplorerEntry } from "@/lib/entry-view";

export default async function HomePage() {
  const ranked = await rankedEntries();
  const stats = await siteStats();

  const entries = ranked.map(toExplorerEntry);

  const tickerNames = ranked
    .filter((e) => e.onByDefault)
    .slice(0, 12)
    .map((e) => `${e.app} ${e.feature}`);

  return (
    <>
      <section className="pt-10 text-center sm:pt-14">
        <h1 className="text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-[4.25rem]">
          Can I turn <span className="text-acid">___</span> off?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-muted sm:text-sm">
          {stats.total} AI features shipped into software you already paid for. one question each:
          can you actually turn it off, or is it the product now?
        </p>
      </section>

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
