import type { Metadata } from "next";
import { EntryTable } from "@/components/EntryTable";
import { Newsletter, PageHeader } from "@/components/Shell";
// import { SponsorGrid } from "@/components/Sponsors"; // sponsors paused until traffic justifies it
import { rankedEntries } from "@/lib/content";
import { toExplorerEntry } from "@/lib/entry-view";

export const metadata: Metadata = {
  title: "Toggles that came back — AI features re-enabled by updates",
  description:
    "You turned it off. The update turned it back on. Every tracked AI feature with documented reports of the setting resetting itself.",
};

export default async function ComesBackPage() {
  const allRanked = await rankedEntries();
  const entries = allRanked.filter((e) => e.comesBack);
  return (
    <>
      <PageHeader title="it came back" tone="flag">
        you turned it off. an update turned it back on. these are the toggles worth re-checking after
        every release — {entries.length} so far.
      </PageHeader>

      <div className="mt-6">
        <EntryTable
          entries={entries.map(toExplorerEntry)}
          emptyLabel="nothing flagged yet. give it a patch cycle."
        />
      </div>

      <Newsletter />
      {/* <SponsorGrid /> — sponsors paused until traffic justifies it */}
    </>
  );
}
