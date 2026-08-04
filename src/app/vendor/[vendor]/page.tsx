import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryTable } from "@/components/EntryTable";
import { Newsletter, PageHeader } from "@/components/Shell";
// import { SponsorGrid } from "@/components/Sponsors"; // sponsors paused until traffic justifies it
import { entriesByVendor, loadEntries, vendorSlug } from "@/lib/content";
import { toExplorerEntry } from "@/lib/entry-view";

export const dynamicParams = false;

export function generateStaticParams() {
  const vendors = new Set(loadEntries().map((e) => vendorSlug(e.vendor)));
  return [...vendors].map((vendor) => ({ vendor }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendor: string }>;
}): Promise<Metadata> {
  const { vendor } = await params;
  const entries = await entriesByVendor(vendor);
  if (!entries.length) return {};
  return {
    title: `Every AI feature ${entries[0].vendor} forced on you`,
    description: `${entries.length} tracked AI features from ${entries[0].vendor} — which ones you can turn off, and which ones you cannot.`,
  };
}

export default async function VendorPage({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const entries = await entriesByVendor(vendor);
  if (!entries.length) notFound();

  const never = entries.filter((e) => e.verdict === "never").length;

  return (
    <>
      <PageHeader title={entries[0].vendor}>
        {entries.length} tracked AI features · {never} with no opt-out ·{" "}
        {entries.filter((e) => e.onByDefault).length} on by default
      </PageHeader>

      <div className="mt-6">
        <EntryTable entries={entries.map(toExplorerEntry)} />
      </div>

      <Newsletter />
      {/* <SponsorGrid /> — sponsors paused until traffic justifies it */}
    </>
  );
}
