import type { Metadata } from "next";
import { EntryRow } from "@/components/EntryRow";
import { Newsletter } from "@/components/Shell";
import { SponsorGrid } from "@/components/Sponsors";
import { rankedEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "The wall of shame — AI features with no off switch",
  description:
    "Every tracked AI feature that a normal user cannot turn off. No setting, no flag, no registry key. It is the product now.",
};

export default async function NeverPage() {
  const allRanked = await rankedEntries();
  const entries = allRanked.filter((e) => e.verdict === "never");
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-never">the wall of shame</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        {entries.length} features with no documented opt-out for an individual user. &quot;use the
        product less&quot; is not a setting.
      </p>
      <section className="panel mt-4">
        {entries.map((e) => (
          <EntryRow key={e.slug} entry={e} />
        ))}
      </section>
      <Newsletter />
      <SponsorGrid />
    </>
  );
}
