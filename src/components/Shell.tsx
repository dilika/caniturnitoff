import Link from "next/link";
import { categories, site } from "@/lib/site";
import { siteStats } from "@/lib/content";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="navbar sticky top-0 z-20">
      <div className="container-tight flex h-12 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="flex size-6 items-center justify-center rounded-md bg-acid text-[13px] font-bold text-[#06210f]"
            aria-hidden
          >
            ⏻
          </span>
          <span className="text-[13px] font-semibold tracking-tight group-hover:text-acid">
            {site.shortName}
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-[11px] text-muted">
          <Link href="/never" className="hidden hover:text-never sm:inline">
            wall of shame
          </Link>
          <Link href="/comes-back" className="hidden hover:text-flag sm:inline">
            comes back
          </Link>
          <Link href="/stats" className="hidden hover:text-fg sm:inline">
            stats
          </Link>
          <Link href="/methodology" className="hover:text-fg">
            methodology
          </Link>
          {/* sponsor link — paused until traffic justifies it
          <Link href="/sponsor" className="chip hover:border-acid/60 hover:text-acid">
            sponsor
          </Link>
          */}
          <ThemeToggle />
          <a
            href={site.repo}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1 rounded-sm border border-line-2 px-2 py-1 text-[10px] uppercase tracking-wider transition-colors hover:border-acid/60 hover:text-acid"
          >
            github ↗
          </a>
        </nav>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  tone,
  children,
}: {
  title: string;
  tone?: "never" | "flag" | "acid";
  children?: React.ReactNode;
}) {
  const toneClass =
    tone === "never" ? "text-never" : tone === "flag" ? "text-flag" : tone === "acid" ? "text-acid" : "";
  return (
    <header className="border-b border-line pb-5 pt-2 text-center">
      <h1 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${toneClass}`}>{title}</h1>
      {children && (
        <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-muted">{children}</p>
      )}
    </header>
  );
}

export async function StatStrip() {
  const s = await siteStats();
  const items = [
    { k: "features tracked", v: s.total },
    { k: "can't be turned off", v: `${s.neverShare}%` },
    { k: "on by default", v: s.onByDefault },
    { k: "comes back", v: s.comesBack },
    { k: "vendors", v: s.vendors },
    { k: "votes", v: s.votes },
  ];
  return (
    <div className="grid grid-cols-2 divide-y divide-line rounded-sm border border-line sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-6 lg:divide-x">
      {items.map((i) => (
        <div key={i.k} className="px-3 py-2.5 text-center">
          <div className="text-xl font-semibold tabular-nums text-acid">{i.v}</div>
          <div className="mt-0.5 text-[9.5px] uppercase tracking-[0.1em] text-dim">{i.k}</div>
        </div>
      ))}
    </div>
  );
}

export function CategoryNav({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <Link href="/" className={`pill ${!active ? "pill-on" : "hover:border-acid/50 hover:text-fg"}`}>
        ⚡ all
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className={`pill ${
            active === c.slug ? "pill-on" : "hover:border-acid/50 hover:text-fg"
          }`}
        >
          {c.emoji} {c.label}
        </Link>
      ))}
    </div>
  );
}

export function Newsletter() {
  return (
    <section className="panel scanline mt-12 p-6 text-center">
      <h2 className="text-lg font-semibold tracking-tight">
        Every week, another toggle disappears.
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted">
        new verdicts, settings that moved, and the toggles that got re-enabled by an update. one
        email. unsubscribe in one click.
      </p>
      <form
        className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2"
        action="https://buttondown.email/api/emails/embed-subscribe/caniturnitoff"
        method="post"
        target="_blank"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@wherever.com"
          className="min-w-52 flex-1 rounded-sm border border-line-2 bg-ink px-3 py-2 text-sm outline-none placeholder:text-dim focus:border-acid/60"
        />
        <button
          type="submit"
          className="rounded-sm bg-acid px-4 py-2 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-85"
        >
          keep me opted out
        </button>
      </form>
      <p className="mt-2.5 text-[10px] text-dim">
        free · no spam · the settings keep moving, so this list keeps mattering
      </p>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-14 border-t border-line py-7">
      <div className="container-tight flex flex-col items-center gap-3 text-center text-[11px] text-dim">
        <span>
          {site.name} — {site.hnLine}
        </span>
        <span className="flex flex-wrap justify-center gap-3">
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
          {/* sponsor link — paused until traffic justifies it
          <Link href="/sponsor" className="hover:text-acid">
            sponsor
          </Link>
          */}
        </span>
      </div>
    </footer>
  );
}
