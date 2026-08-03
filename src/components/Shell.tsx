import Link from "next/link";
import { categories, site } from "@/lib/site";
import { siteStats } from "@/lib/content";

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
      <div className="container-tight flex h-11 items-center justify-between gap-4">
        <Link href="/" className="text-xs font-semibold tracking-tight hover:text-acid">
          <span className="text-acid">▚</span> {site.shortName}
        </Link>
        <nav className="flex items-center gap-3 text-[11px] text-muted">
          <Link href="/never" className="hover:text-never">
            wall of shame
          </Link>
          <Link href="/comes-back" className="hover:text-flag">
            comes back
          </Link>
          <Link href="/methodology" className="hover:text-fg">
            methodology
          </Link>
          <Link href="/sponsor" className="chip hover:border-acid/60 hover:text-acid">
            sponsor
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function StatStrip() {
  const s = siteStats();
  const items = [
    { k: "features tracked", v: s.total },
    { k: "can't be turned off", v: `${s.neverShare}%` },
    { k: "on by default", v: s.onByDefault },
    { k: "comes back", v: s.comesBack },
    { k: "vendors", v: s.vendors },
    { k: "votes", v: s.votes },
  ];
  return (
    <div className="grid grid-cols-2 divide-line border border-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
      {items.map((i) => (
        <div key={i.k} className="px-3 py-2">
          <div className="text-lg font-semibold tabular-nums text-acid">{i.v}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim">{i.k}</div>
        </div>
      ))}
    </div>
  );
}

export function CategoryNav({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Link href="/" className={`chip ${!active ? "border-acid/60 text-acid" : "hover:text-fg"}`}>
        ⚡ all
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className={`chip ${active === c.slug ? "border-acid/60 text-acid" : "hover:text-fg"}`}
        >
          {c.emoji} {c.label}
        </Link>
      ))}
    </div>
  );
}

export function Newsletter() {
  return (
    <section className="panel scanline mt-10 p-5">
      <h2 className="text-base font-semibold">Every week, another toggle disappears.</h2>
      <p className="mt-1 text-xs text-muted">
        new verdicts, settings that moved, and the toggles that got re-enabled by an update. one
        email. unsubscribe in one click.
      </p>
      <form
        className="mt-3 flex flex-wrap gap-2"
        action="https://buttondown.email/api/emails/embed-subscribe/caniturnitoff"
        method="post"
        target="_blank"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@wherever.com"
          className="min-w-56 flex-1 border border-line-2 bg-ink px-2.5 py-1.5 text-sm outline-none placeholder:text-dim focus:border-acid/60"
        />
        <button
          type="submit"
          className="border border-acid/60 bg-acid/10 px-3 py-1.5 text-sm font-semibold text-acid hover:bg-acid/20"
        >
          keep me opted out
        </button>
      </form>
      <p className="mt-2 text-[10px] text-dim">
        free · no spam · the settings keep moving, so this list keeps mattering
      </p>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line py-6">
      <div className="container-tight flex flex-wrap items-center justify-between gap-3 text-[11px] text-dim">
        <span>
          {site.name} — {site.hnLine}
        </span>
        <span className="flex flex-wrap gap-3">
          <Link href="/methodology" className="hover:text-fg">
            methodology
          </Link>
          <Link href="/stats" className="hover:text-fg">
            stats
          </Link>
          <Link href="/api/entries.json" className="hover:text-fg">
            json api
          </Link>
          <a href={site.repo} className="hover:text-fg">
            data on github
          </a>
          <Link href="/sponsor" className="hover:text-acid">
            sponsor
          </Link>
        </span>
      </div>
    </footer>
  );
}
