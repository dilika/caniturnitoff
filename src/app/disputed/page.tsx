import type { Metadata } from "next";
import { EntryTable } from "@/components/EntryTable";
import { PageHeader } from "@/components/Shell";
import { getDisputedEntries } from "@/lib/changes";
import { toExplorerEntry } from "@/lib/entry-view";

export const metadata: Metadata = {
  title: "Disputed — community says it changed",
  description:
    "Entries where enough people voted 'it changed' that the toggle may no longer work as documented. Re-verification queued.",
};

export default async function DisputedPage() {
  const disputed = await getDisputedEntries();

  return (
    <>
      <PageHeader title="disputed" tone="never">
        the community says these toggles may no longer work as documented.{" "}
        {disputed.length > 0
          ? `${disputed.length} entries flagged for re-verification.`
          : "no disputes right now — everything checks out."}
      </PageHeader>

      <div className="mt-6">
        <EntryTable
          entries={disputed.map(toExplorerEntry)}
          emptyLabel="no disputes. the community confirms everything still works."
        />
      </div>
    </>
  );
}
