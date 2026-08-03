"use client";

import { useState } from "react";

export function VoteButtons({
  slug,
  initial,
}: {
  slug: string;
  initial: { works: number; changed: number };
}) {
  const [counts, setCounts] = useState(initial);
  const [voted, setVoted] = useState<null | "works" | "changed">(null);
  const [pending, setPending] = useState(false);

  async function vote(kind: "works" | "changed") {
    if (voted || pending) return;
    setPending(true);
    setVoted(kind);
    setCounts((c) => ({ ...c, [kind]: c[kind] + 1 }));
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, kind }),
      });
      if (res.ok) {
        const data = (await res.json()) as { works: number; changed: number };
        setCounts(data);
      }
    } catch {
      /* optimistic count stays; the vote is a signal, not accounting */
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => vote("works")}
        disabled={!!voted}
        className="chip hover:border-off/60 hover:text-off disabled:opacity-60"
      >
        ✅ still works <span className="tabular-nums text-fg">{counts.works}</span>
      </button>
      <button
        type="button"
        onClick={() => vote("changed")}
        disabled={!!voted}
        className="chip hover:border-never/60 hover:text-never disabled:opacity-60"
      >
        ⚠️ it changed <span className="tabular-nums text-fg">{counts.changed}</span>
      </button>
      <span className="text-[11px] text-dim">
        {voted ? "logged. votes flag an entry for review, they never flip a verdict." : "one vote per entry"}
      </span>
    </div>
  );
}
