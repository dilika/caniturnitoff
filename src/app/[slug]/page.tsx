import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flag, VerdictBadge } from "@/components/VerdictBadge";
import { Newsletter } from "@/components/Shell";
import { SponsorGrid } from "@/components/Sponsors";
import { VoteButtons } from "@/components/VoteButtons";
import { getEntry, loadEntries, rankedEntries, vendorSlug } from "@/lib/content";
import { categoryMeta, site } from "@/lib/site";
import { daysSince, isStale, verdictMeta } from "@/lib/verdicts";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) return {};
  const v = verdictMeta[entry.verdict];
  const title = `Can I turn off ${entry.app} ${entry.feature}? — ${v.label}`;
  const description = `${v.label}: ${entry.summary}`;
  return {
    title,
    description,
    alternates: { canonical: `/${entry.slug}` },
    openGraph: { title, description, url: `${site.url}/${entry.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function EntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) notFound();

  const v = verdictMeta[entry.verdict];
  const cat = categoryMeta(entry.category);
  const stale = isStale(entry.lastVerified, site.staleAfterDays);
  const allRanked = await rankedEntries();
  const related = allRanked.filter(
    (e) => e.slug !== entry.slug && (entry.relatedSlugs.includes(e.slug) || e.vendor === entry.vendor),
  );

  const faq = [
    {
      q: `Can I turn off ${entry.app} ${entry.feature}?`,
      a: `${v.label}. ${entry.summary}`,
    },
    entry.steps.length
      ? {
          q: `Where is the setting to disable ${entry.feature} in ${entry.app}?`,
          a: entry.steps.map((s) => `${s.platform}: ${s.path}`).join(" · "),
        }
      : null,
    entry.collateral.length
      ? {
          q: `What do I lose if I turn ${entry.feature} off?`,
          a: entry.collateral.join("; "),
        }
      : null,
    {
      q: `Is ${entry.feature} on by default in ${entry.app}?`,
      a: entry.onByDefault
        ? "Yes. You were opted in without an explicit action."
        : "No. You have to enable it yourself.",
    },
  ].filter(Boolean) as { q: string; a: string }[];

  return (
    <>
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-dim">
        <Link href="/" className="hover:text-acid">
          all
        </Link>
        <span>/</span>
        <Link href={`/category/${entry.category}`} className="hover:text-acid">
          {cat?.emoji} {cat?.label}
        </Link>
        <span>/</span>
        <Link href={`/vendor/${vendorSlug(entry.vendor)}`} className="hover:text-acid">
          {entry.vendor}
        </Link>
        <span className="ml-auto tabular-nums">#{entry.rank} on the offender list</span>
      </nav>

      <header className="panel scanline p-5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Can I turn off {entry.app} — {entry.feature}?
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <VerdictBadge verdict={entry.verdict} size="lg" />
          {entry.onByDefault && <Flag tone="warn">on by default</Flag>}
          {entry.comesBack && <Flag tone="flag">comes back after updates</Flag>}
          {entry.enterpriseOnly && <Flag>admin only</Flag>}
          <span className="chip">difficulty {entry.difficulty}/5</span>
          <span className="chip">{entry.platforms.join(" · ")}</span>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-fg">{entry.summary}</p>
        <p className="mt-1 text-xs text-dim">
          {v.blurb} · verified {entry.lastVerified} ({daysSince(entry.lastVerified)}d ago)
          {stale && " · ⚠ stale, re-verification queued"}
        </p>
      </header>

      {entry.steps.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-xs uppercase tracking-widest text-dim">the off switch</h2>
          <ol className="space-y-2">
            {entry.steps.map((s, i) => (
              <li key={i} className="panel p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip border-acid/40 text-acid">{s.platform}</span>
                  <span className="chip">{s.kind}</span>
                </div>
                <p className="mt-2 text-sm">{s.path}</p>
                {s.code && (
                  <pre className="mt-2 overflow-x-auto border border-line bg-ink p-2.5 text-xs text-acid">
                    <code>{s.code}</code>
                  </pre>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {entry.collateral.length > 0 && (
          <section className="panel p-4">
            <h2 className="text-xs uppercase tracking-widest text-dim">what you lose</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {entry.collateral.map((c) => (
                <li key={c} className="text-muted">
                  <span className="text-never">×</span> {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="panel p-4">
          <h2 className="text-xs uppercase tracking-widest text-dim">why they did it</h2>
          <p className="mt-2 text-sm text-muted">{entry.whyTheyDidIt}</p>
          {entry.regionNotes && (
            <p className="mt-2 border-t border-line pt-2 text-xs text-muted">
              🌍 {entry.regionNotes}
            </p>
          )}
        </section>
      </div>

      <section className="mt-6 panel p-4">
        <h2 className="text-xs uppercase tracking-widest text-dim">does this still work?</h2>
        <div className="mt-2">
          <VoteButtons slug={entry.slug} initial={entry.votes} />
        </div>
      </section>

      {entry.alternatives.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-xs uppercase tracking-widest text-dim">
            tools that don&apos;t do this to you
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {entry.alternatives.map((a) => (
              <a
                key={a.name}
                href={a.url}
                target="_blank"
                rel={a.affiliate ? "sponsored noopener" : "noopener"}
                className="panel px-3 py-2.5 hover:border-acid/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {a.name}
                  {a.affiliate && <span className="chip text-[9px]">affiliate</span>}
                </div>
                <p className="mt-1 text-xs text-muted">{a.why}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="panel p-4">
          <h2 className="text-xs uppercase tracking-widest text-dim">sources</h2>
          <ul className="mt-2 space-y-1 text-xs">
            {entry.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener" className="hover:text-acid">
                  [{s.type}] {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-4">
          <h2 className="text-xs uppercase tracking-widest text-dim">changelog</h2>
          {entry.changelog.length ? (
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {entry.changelog.map((c, i) => (
                <li key={i}>
                  <span className="text-dim tabular-nums">{c.date}</span> — {c.note}
                  {c.verdictBefore && c.verdictAfter && (
                    <>
                      {" "}
                      <span className="text-dim">
                        ({verdictMeta[c.verdictBefore].label} → {verdictMeta[c.verdictAfter].label})
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-dim">no change since first verification.</p>
          )}
          <p className="mt-3 border-t border-line pt-2 text-[10px] text-dim">
            vendor? contest this entry — corrections are published verbatim.{" "}
            <a href={`mailto:${site.contact}`} className="underline">
              {site.contact}
            </a>
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${entry.app} — ${entry.feature}: ${v.label} → ${site.domain}/${entry.slug}`,
          )}`}
          target="_blank"
          rel="noopener"
          className="chip hover:border-acid/60 hover:text-acid"
        >
          share on X ↗
        </a>
        <a href={site.repo} className="chip hover:border-acid/60 hover:text-acid">
          fix this entry ↗
        </a>
        <a
          href={`${site.repo}/issues/new?title=Error+report:+${entry.slug}&body=What%27s+wrong+with+this+entry%3F%0A%0AEntry:+${entry.app}+-+${entry.feature}%0ASlug:+${entry.slug}%0A%0ADescribe+the+error:`}
          target="_blank"
          rel="noopener"
          className="chip hover:border-never/60 hover:text-never"
        >
          ⚠ report an error ↗
        </a>
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-xs uppercase tracking-widest text-dim">
            more from {entry.vendor}
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.slice(0, 6).map((r) => (
              <Link key={r.slug} href={`/${r.slug}`} className="chip hover:text-fg">
                {verdictMeta[r.verdict].dot} {r.app} — {r.feature}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-2 text-xs uppercase tracking-widest text-dim">faq</h2>
        <dl className="space-y-3">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="text-sm font-semibold">{f.q}</dt>
              <dd className="text-sm text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Newsletter />
      <SponsorGrid />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Can I turn off ${entry.app} ${entry.feature}?`,
            description: entry.summary,
            url: `${site.url}/${entry.slug}`,
            dateModified: entry.lastVerified,
            author: { "@type": "Organization", name: site.name },
            publisher: { "@type": "Organization", name: site.name },
            mainEntityOfPage: `${site.url}/${entry.slug}`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: entry.vendor, item: `${site.url}/vendor/${vendorSlug(entry.vendor)}` },
              { "@type": "ListItem", position: 3, name: `${entry.app} — ${entry.feature}`, item: `${site.url}/${entry.slug}` },
            ],
          }),
        }}
      />
    </>
  );
}
