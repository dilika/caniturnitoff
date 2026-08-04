"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ExplorerEntry } from "@/lib/entry-view";
import { categories } from "@/lib/site";
import { VERDICTS, type Verdict } from "@/lib/verdicts";
import { EntryTable } from "./EntryTable";

type SortKey = "worst" | "votes" | "app" | "recent";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "worst", label: "worst" },
  { key: "votes", label: "votes" },
  { key: "app", label: "a–z" },
  { key: "recent", label: "recent" },
];

const FLAGS = [
  { key: "any", label: "any" },
  { key: "default", label: "on by default" },
  { key: "back", label: "comes back" },
] as const;

export function Explorer({
  entries,
  meter,
}: {
  entries: ExplorerEntry[];
  meter?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [verdict, setVerdict] = useState<"all" | Verdict>("all");
  const [flag, setFlag] = useState<(typeof FLAGS)[number]["key"]>("any");
  const [sort, setSort] = useState<SortKey>("worst");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = entries.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (verdict !== "all" && e.verdict !== verdict) return false;
      if (flag === "default" && !e.onByDefault) return false;
      if (flag === "back" && !e.comesBack) return false;
      if (!q) return true;
      return (
        e.app.toLowerCase().includes(q) ||
        e.feature.toLowerCase().includes(q) ||
        e.vendor.toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered];
    if (sort === "worst") sorted.sort((a, b) => a.rank - b.rank);
    if (sort === "votes") sorted.sort((a, b) => b.votes - a.votes || a.rank - b.rank);
    if (sort === "app") sorted.sort((a, b) => a.app.localeCompare(b.app));
    if (sort === "recent")
      sorted.sort((a, b) => b.lastVerified.localeCompare(a.lastVerified) || a.rank - b.rank);
    return sorted;
  }, [entries, query, category, verdict, flag, sort]);

  const neverCount = rows.filter((e) => e.verdict === "never").length;

  return (
    <>
      {/* ---------- search ---------- */}
      <div className="mx-auto mt-7 max-w-3xl">
        <label className="termbox focus-within:border-acid/60">
          <span className="select-none text-acid" aria-hidden>
            &gt;
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="type an app — windows, gmail, whatsapp…"
            aria-label="search AI features"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-dim"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="clear search"
              className="shrink-0 text-[12px] uppercase tracking-wider text-dim hover:text-fg"
            >
              clear
            </button>
          ) : (
            <span className="caret shrink-0" aria-hidden />
          )}
        </label>
      </div>

      {/* ---------- category pills ---------- */}
      <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`pill ${category === "all" ? "pill-on" : "hover:border-acid/50 hover:text-fg"}`}
        >
          ⚡ all
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            className={`pill ${
              category === c.slug ? "pill-on" : "hover:border-acid/50 hover:text-fg"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {meter}

      {/* ---------- list ---------- */}
      <section className="mt-9">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Tracked Features</h2>
          <span className="text-sm text-dim">
            ranked worst-first — verdict, defaults, then votes
          </span>
        </div>

        {/* controls */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm uppercase tracking-[0.11em] text-dim">verdict</span>
            <div className="seg">
              <button
                type="button"
                onClick={() => setVerdict("all")}
                className={`seg-btn ${verdict === "all" ? "seg-btn-on" : ""}`}
              >
                all
              </button>
              {VERDICTS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => { console.log("verdict click", v); setVerdict(v); }}
                  className={`seg-btn ${verdict === v ? "seg-btn-on" : ""}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm uppercase tracking-[0.11em] text-dim">flag</span>
            <div className="seg">
              {FLAGS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFlag(f.key)}
                  className={`seg-btn ${flag === f.key ? "seg-btn-on" : ""}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm uppercase tracking-[0.11em] text-dim">sort</span>
            <div className="seg">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSort(s.key)}
                  className={`seg-btn ${sort === s.key ? "seg-btn-on" : ""}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <span className="ml-auto text-sm tabular-nums text-dim">
            {rows.length} shown · {neverCount} with no off switch
          </span>
        </div>

        <EntryTable
          entries={rows}
          emptyLabel="nothing matches. try a different app or clear the filters."
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-dim">
          <span>
            {entries.filter((e) => e.verdict === "never").length} of {entries.length} have no
            off switch at all
          </span>
          <span className="flex gap-3">
            <Link href="/never" className="hover:text-never">
              no off switch →
            </Link>
            <Link href="/comes-back" className="hover:text-flag">
              toggles that came back →
            </Link>
          </span>
        </div>
      </section>
    </>
  );
}
