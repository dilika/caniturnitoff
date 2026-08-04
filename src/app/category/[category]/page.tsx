import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryTable } from "@/components/EntryTable";
import { CategoryNav, Newsletter, PageHeader } from "@/components/Shell";
// import { SponsorGrid } from "@/components/Sponsors"; // sponsors paused until traffic justifies it
import { entriesByCategory } from "@/lib/content";
import { toExplorerEntry } from "@/lib/entry-view";
import { categories, categoryMeta } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta(category);
  if (!meta) return {};
  return {
    title: `Turning AI off in ${meta.label}`,
    description: `Which AI features you can turn off in ${meta.label} — verdicts, exact settings paths, and what breaks.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = categoryMeta(category);
  if (!meta) notFound();
  const entries = await entriesByCategory(category);

  return (
    <>
      <PageHeader title={`${meta.emoji} ${meta.label}`}>
        {entries.length} tracked features · {entries.filter((e) => e.verdict === "never").length}{" "}
        with no off switch at all.
      </PageHeader>

      <div className="mt-6">
        <CategoryNav active={category} />
      </div>

      <div className="mt-6">
        <EntryTable entries={entries.map(toExplorerEntry)} />
      </div>

      <Newsletter />
      {/* <SponsorGrid /> — sponsors paused until traffic justifies it */}
    </>
  );
}
