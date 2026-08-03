export const VERDICTS = ["off", "buried", "never"] as const;
export type Verdict = (typeof VERDICTS)[number];

type VerdictMeta = {
  label: string;
  dot: string;
  color: string;
  border: string;
  bg: string;
  blurb: string;
  weight: number;
};

export const verdictMeta: Record<Verdict, VerdictMeta> = {
  off: {
    label: "OFF",
    dot: "🟢",
    color: "text-off",
    border: "border-off/40",
    bg: "bg-off/10",
    blurb: "a real toggle, under 30 seconds, no collateral damage",
    weight: 0,
  },
  buried: {
    label: "BURIED",
    dot: "🟡",
    color: "text-buried",
    border: "border-buried/40",
    bg: "bg-buried/10",
    blurb: "possible, but they hid it — flags, registry, admin, or you lose other features",
    weight: 1,
  },
  never: {
    label: "NEVER",
    dot: "🔴",
    color: "text-never",
    border: "border-never/40",
    bg: "bg-never/10",
    blurb: "no opt-out for a normal user. it is the product now",
    weight: 2,
  },
};

export function isStale(lastVerified: string, staleAfterDays: number): boolean {
  const then = new Date(lastVerified).getTime();
  if (Number.isNaN(then)) return true;
  const days = (Date.now() - then) / 86_400_000;
  return days > staleAfterDays;
}

export function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return Infinity;
  return Math.floor((Date.now() - then) / 86_400_000);
}
