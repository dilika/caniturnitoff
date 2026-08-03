export const site = {
  name: "Can I Turn It Off?",
  shortName: "caniturnitoff",
  domain: "caniturnitoff.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://caniturnitoff.com",
  tagline:
    "Which AI features you can actually turn off — and which ones are now part of the product you already paid for.",
  hnLine: "caniuse.com, but for the off switch.",
  repo: "https://github.com/caniturnitoff/caniturnitoff",
  x: "https://x.com/caniturnitoff",
  contact: "hello@caniturnitoff.com",
  sponsorPricePerSlot: 400,
  sponsorSlots: 5,
  staleAfterDays: 90,
} as const;

export const categories = [
  { slug: "os", label: "operating systems", emoji: "🖥️" },
  { slug: "browsers", label: "browsers", emoji: "🌐" },
  { slug: "email-docs", label: "email & docs", emoji: "📧" },
  { slug: "social", label: "social", emoji: "🐦" },
  { slug: "work-suite", label: "work suite", emoji: "🏢" },
  { slug: "phones", label: "phones", emoji: "📱" },
  { slug: "creative", label: "creative", emoji: "🎨" },
  { slug: "dev-tools", label: "dev tools", emoji: "🛠️" },
  { slug: "search", label: "search", emoji: "🔍" },
  { slug: "media", label: "media", emoji: "🎵" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function categoryMeta(slug: string) {
  return categories.find((c) => c.slug === slug);
}
