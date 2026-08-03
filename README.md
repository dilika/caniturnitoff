# Can I Turn It Off?

> Which AI features you can actually turn off — and which ones are now part of the product you
> already paid for.
>
> caniuse.com, but for the off switch.

A verdict database. One page per `app × AI feature`, one of three verdicts, the exact settings path,
what breaks if you use it, and whether the toggle comes back after an update.

- Product spec and monetization: [`docs/PRODUCT.md`](docs/PRODUCT.md)
- Editorial rules (how verdicts are assigned, right of reply): [`docs/EDITORIAL.md`](docs/EDITORIAL.md)
- Adding or fixing an entry: [`CONTRIBUTING.md`](CONTRIBUTING.md)

## Verdicts

| | meaning |
|---|---|
| 🟢 `OFF` | a real toggle, under 30 seconds, no collateral damage |
| 🟡 `BURIED` | possible, but hidden: flags, registry, config, admin-only, or it kills other features |
| 🔴 `NEVER` | no documented opt-out for a normal user |

Flags shown separately, never as the verdict: `on by default`, `comes back`, `admin only`, `stale`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Content = plain JSON in `content/entries/*.json`, validated with zod at build time
- Votes = swappable store in `src/lib/votes.ts` (JSON file in v0 → Turso/Upstash when it moves to
  a serverless host)
- No client-side analytics SDK, no ad network, no cookies

## Routes

```
/                      the offender list (ranked worst-first)
/[slug]                one feature, one verdict, the steps          ← SEO surface
/category/[category]   os · browsers · email & docs · social · …
/vendor/[vendor]       everything one vendor forced on you
/never                 the wall of shame (no opt-out at all)
/comes-back            toggles re-enabled by updates
/methodology           rubric, sourcing, right of reply
/stats                 public dataset stats
/sponsor               slots and rules
/api/entries.json      free public dataset (CC-BY)
/api/vote              POST { slug, kind: "works" | "changed" }
```

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3210
pnpm validate:content
pnpm build
```

The build fails if any entry does not match the zod schema in `src/lib/schema.ts`, or if a filename
does not match its `slug`. That is deliberate: bad data is worse than no data here.

## Content status

17 seed entries, each sourced to material that was actually read (Consumer Reports, Kaspersky, Tuta,
Gadget Hacks, WordPress.org). Before launch every entry should be re-verified **hands-on on a real
device** and the source list upgraded to the vendor's own documentation where one exists. Entries
carry a `lastVerified` date and are auto-flagged `stale` after 90 days.

## Roadmap

- v1: 120 entries, weekly email, OG image per entry
- v1.5: doc-watcher bot that opens a PR when a vendor settings page changes
- v2: IT tier (GPO / Intune / registry bundles, webhook alerts on verdict changes)
