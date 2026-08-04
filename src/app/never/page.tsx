import type { Metadata } from "next";
import { EntryTable } from "@/components/EntryTable";
import { Newsletter, PageHeader } from "@/components/Shell";
// import { SponsorGrid } from "@/components/Sponsors"; // sponsors paused until traffic justifies it
import { rankedEntries } from "@/lib/content";
import { toExplorerEntry } from "@/lib/entry-view";

export const metadata: Metadata = {
  title: "AI features with no off switch",
  description:
    "Every tracked AI feature that a normal user cannot turn off. No setting, no flag, no registry key. It is part of the product.",
};

export default async function NeverPage() {
  const allRanked = await rankedEntries();
  const entries = allRanked.filter((e) => e.verdict === "never");
  return (
    <>
      <PageHeader title="no off switch" tone="never">
        {entries.length} features with no documented off switch for an individual user. &quot;use it
        less&quot; is not a setting.
      </PageHeader>

      <div className="mt-6">
        <EntryTable
          entries={entries.map(toExplorerEntry)}
          emptyLabel="nothing without an off switch yet. enjoy it while it lasts."
        />
      </div>

      <Newsletter />
      {/* <SponsorGrid /> — sponsors paused until traffic justifies it */}
    </>
  );
}
