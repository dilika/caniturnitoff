import { verdictMeta, type Verdict } from "@/lib/verdicts";

export function VerdictBadge({
  verdict,
  size = "sm",
}: {
  verdict: Verdict;
  size?: "sm" | "lg";
}) {
  const m = verdictMeta[verdict];
  const big = size === "lg";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm ${m.solid} ${
        big ? "px-3 py-1 text-sm tracking-widest" : "px-2 py-[0.15rem] text-[12px] tracking-wider"
      } font-bold uppercase`}
    >
      {m.label}
    </span>
  );
}

export function Flag({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "warn" | "flag";
}) {
  const tones = {
    muted: "border-line-2 text-muted",
    warn: "border-never/40 text-never",
    flag: "border-flag/40 text-flag",
  } as const;
  return (
    <span
      className={`inline-flex items-center border px-1.5 py-0.5 text-[12px] uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
