import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryRow } from "@/components/EntryRow";
import { CategoryNav, Newsletter } from "@/components/Shell";
import { SponsorGrid } from "@/components/Sponsors";
import { entriesByCategory } from "@/lib/content";
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
      <h1 className="text-2xl font-semibold tracking-tight">
        {meta.emoji} {meta.label}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {entries.length} tracked features · {entries.filter((e) => e.verdict === "never").length}{" "}
        with no opt-out at all.
      </p>

      <div className="mt-4">
        <CategoryNav active={category} />
      </div>

      <section className="panel mt-4">
        {entries.map((e) => (
          <EntryRow key={e.slug} entry={e} />
        ))}
        {!entries.length && (
          <p className="px-3 py-6 text-sm text-dim">nothing here yet. that will not last.</p>
        )}
      </section>

      <Newsletter />
      <SponsorGrid />
    </>
  );
}
