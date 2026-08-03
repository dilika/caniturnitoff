import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryRow } from "@/components/EntryRow";
import { Newsletter } from "@/components/Shell";
import { SponsorGrid } from "@/components/Sponsors";
import { entriesByVendor, loadEntries, vendorSlug } from "@/lib/content";

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
  const entries = entriesByVendor(vendor);
  if (!entries.length) return {};
  return {
    title: `Every AI feature ${entries[0].vendor} forced on you`,
    description: `${entries.length} tracked AI features from ${entries[0].vendor} — which ones you can turn off, and which ones you cannot.`,
  };
}

export default async function VendorPage({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const entries = entriesByVendor(vendor);
  if (!entries.length) notFound();

  const never = entries.filter((e) => e.verdict === "never").length;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{entries[0].vendor}</h1>
      <p className="mt-1 text-sm text-muted">
        {entries.length} tracked AI features · {never} with no opt-out ·{" "}
        {entries.filter((e) => e.onByDefault).length} on by default
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
