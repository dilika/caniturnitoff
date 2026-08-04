import type { Metadata } from "next";
import { EntryTable } from "@/components/EntryTable";
import { PageHeader } from "@/components/Shell";
import { getStaleEntries } from "@/lib/changes";
import { toExplorerEntry } from "@/lib/entry-view";

export const metadata: Metadata = {
  title: "Stale — entries needing re-verification",
  description:
    "Entries whose last verification date is over 90 days old. We're working through them — these are the ones most likely to have moved.",
};

export default async function StalePage() {
  const stale = await getStaleEntries();

  return (
    <>
      <PageHeader title="stale">
        these {stale.length} entries haven&apos;t been re-verified in over 90
        days. they&apos;re the most likely to have moved — the toggle may have
        been buried deeper, removed, or flipped back on.
      </PageHeader>

      <div className="mt-6">
        <EntryTable
          entries={stale.map(toExplorerEntry)}
          emptyLabel="everything is fresh — all entries verified within the last 90 days."
        />
      </div>
    </>
  );
}
