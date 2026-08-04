import Link from "next/link";

export function ForcedOnMeter({
  count,
  total,
  names,
}: {
  count: number;
  total: number;
  names: string[];
}) {
  const digits = String(count).split("");

  return (
    <div className="mt-7 rounded-sm border border-acid/35 bg-acid/[0.04] px-4 pb-3 pt-2">
      <div className="overflow-hidden">
        <p className="truncate text-[10px] uppercase tracking-[0.08em] text-acid/45">
          {names.map((n, i) => (
            <span key={n}>
              {i > 0 && <span className="mx-1.5 text-acid/25">·</span>}
              <s className="decoration-acid/40">{n}</s>
            </span>
          ))}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <p className="text-right text-[11px] leading-tight text-muted">
          AI features switched on
          <br />
          <span className="text-dim">without asking you</span>
        </p>

        <div className="flex items-center gap-1" aria-label={`${count} features on by default`}>
          {digits.map((d, i) => (
            <span key={`${d}-${i}`} className="odo">
              {d}
            </span>
          ))}
        </div>

        <p className="text-[11px] leading-tight text-muted">
          out of {total}
          <br />
          <span className="text-dim">tracked</span>
        </p>

        <Link
          href="/methodology"
          aria-label="how we count this"
          title="how we count this"
          className="flex size-5 items-center justify-center rounded-full border border-line-2 text-[10px] text-dim transition-colors hover:border-acid/60 hover:text-acid"
        >
          ?
        </Link>
      </div>
    </div>
  );
}
