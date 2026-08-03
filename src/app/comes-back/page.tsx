import type { Metadata } from "next";
import { EntryRow } from "@/components/EntryRow";
import { Newsletter } from "@/components/Shell";
import { SponsorGrid } from "@/components/Sponsors";
import { rankedEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Toggles that came back — AI features re-enabled by updates",
  description:
    "You turned it off. The update turned it back on. Every tracked AI feature with documented reports of the setting resetting itself.",
};

export default function ComesBackPage() {
  const entries = rankedEntries().filter((e) => e.comesBack);
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-flag">it came back</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        you turned it off. an update turned it back on. these are the toggles worth re-checking after
        every release — {entries.length} so far.
      </p>
      <section className="panel mt-4">
        {entries.map((e) => (
          <EntryRow key={e.slug} entry={e} />
        ))}
        {!entries.length && (
          <p className="px-3 py-6 text-sm text-dim">nothing flagged yet. give it a patch cycle.</p>
        )}
      </section>
      <Newsletter />
      <SponsorGrid />
    </>
  );
}
