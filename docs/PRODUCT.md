# Can I Turn It Off? — Product spec

> **Tagline** — Which AI features you can actually turn off, and which ones are now part of the product you already paid for.
>
> **One-liner HN/X** — caniuse.com, but for the off switch.

Domain: `caniturnitoff.com` (canonical) · alt `canidisableit.com`, `letmeturnitoff.com`, `aioffswitch.com`

---

## 1. The problem (why anyone lands here)

In 2026, AI features are shipped **on by default** into software people already paid for. The user
question is never "is this AI good?", it is:

1. Can I turn this specific thing off?
2. Where exactly is the setting?
3. What do I break if I turn it off?
4. Will it come back after the next update?

Today the answer lives in 40 different blog posts, a Reddit thread, and a support page that was
rewritten last month. Nobody maintains a **single verdict per feature**.

Search demand is already enormous and evergreen: *"how to turn off AI Overviews"*, *"disable
Copilot Windows 11"*, *"turn off Gemini in Gmail"*, *"disable Meta AI WhatsApp"*. Each is a
recurring, high-intent, low-competition long tail query where the best current result is a
listicle from a security vendor's blog.

## 2. What the site is

A **verdict database**, one page per AI feature, not per company.

Unit of content = **`app × feature`** (e.g. `Gmail — Smart Features`, not `Gmail`).
That is what people search, and it lets one product hold three different verdicts.

### The 3 verdicts

| Verdict | Meaning | Rule |
|---|---|---|
| 🟢 `OFF` | A real toggle, reachable by a normal user in under ~30 seconds, no side effects | user-facing setting, survives updates |
| 🟡 `BURIED` | Technically possible, but hostile: flags, registry, config file, admin/owner-only, or you lose non-AI features too | any friction beyond a settings toggle |
| 🔴 `NEVER` | No documented opt-out for individual users | vendor says no, or only "avoid the product" |

Plus two orthogonal flags shown as tags, never as the verdict:

- `ON BY DEFAULT` — you were opted in without asking.
- `COMES BACK` — documented cases of the toggle being re-enabled by an update.

### Data model per entry (see `content/entries/*.json`)

- identity: `slug`, `app`, `feature`, `vendor`, `category`, `platforms`
- verdict: `verdict`, `onByDefault`, `comesBack`, `difficulty` (1–5)
- **the payload users came for**: `steps[]` (exact click path or command), `collateral[]`
  (what else breaks), `regionNotes` (EU/UK defaults differ), `enterpriseOnly`
- trust: `sources[]` (vendor doc first, then press), `lastVerified`, `changelog[]`
- context: `whyTheyDidIt` (one honest sentence), `alternatives[]` (products that don't do this)
- social: `votes` (still works / it changed), `relatedSlugs`

## 3. Why someone consults it (and comes back)

| Job to be done | What the site gives |
|---|---|
| "Kill this thing now" | The exact path, copy-pasteable command, in 5 seconds, no cookie wall, no 900-word intro |
| "Am I crazy or was I opted in?" | `ON BY DEFAULT` flag + `lastVerified` date + source link |
| "Did it come back?" | `COMES BACK` flag + changelog per entry + weekly "toggles that got re-enabled" |
| "Which tool doesn't do this to me?" | `alternatives[]` → this is the monetizable intent |
| "Am I the only one?" | Vote counts + a leaderboard of the worst offenders |
| Sysadmin / IT | Filter by `enterpriseOnly`, per-OS grouping, GPO/registry/CLI payloads |

**The retention loop**: this is not a one-shot tool. Vendors change these settings constantly, so
every entry decays. The changelog + "re-enabled this week" feed is the reason to subscribe, and the
reason the site is a *tracker* rather than a blog post.

## 4. Structure (routes)

```
/                        The Offender List — ranked, filterable, numbered like CIVI
/[slug]                  One feature, one verdict, the steps                    ← SEO surface
/category/[category]     os · browsers · email & docs · social · work suite · creative · dev tools · phones
/vendor/[vendor]         all of Google's / Microsoft's forced AI, aggregated
/never                   The wall of shame: everything with no opt-out
/comes-back              Toggles that got re-enabled by an update
/methodology             How a verdict is assigned + how to contest it
/stats                   Public analytics + dataset stats (CIVI-style transparency)
/sponsor                 Sponsor kit, slots, prices
/api/vote                POST vote (still-works / changed)
/api/entries.json        Free public JSON API (link-bait + LLM ingestion)
```

## 5. Design language (same imprint as canivibecodeit.com / trustmrr.com)

- Dark near-black canvas, **monospace everywhere**, lowercase microcopy, zero corporate polish.
- Dense numbered rows `01 … 20`, verdict chip on the right, vote pill at the end.
- Big live counters in the header: `features tracked` · `% NEVER` · `on by default` · `votes`.
- Emoji category chips as the primary nav.
- One accent colour (lime) + 3 verdict colours. Nothing else.
- Sponsor cards inline in the list and in a grid in the footer, explicitly labelled.
- Every page ends with the same newsletter block and share-on-X button.

## 6. Monetization (in ship order)

1. **Sponsor slots — the core.** CIVI sells 10 slots at $2,500/mo. Start at **5 slots, $200–400/mo**
   until traffic proves out, then raise per sold-out cycle. Placement: 2 inline cards in the list,
   a footer grid, and 1 slot on entry pages. Always labelled `sponsor`, never disguised as a verdict.
2. **`alternatives[]` affiliate/partner links.** Highest-intent moment on the internet: a user who
   just learned they cannot turn the AI off is one click from switching. Privacy-first tools,
   local-first apps, de-Googled/ad-free products, VPN-free anti-tracking, paid email. Disclosed on
   every page, and **never allowed to change a verdict** (rule written into `docs/EDITORIAL.md`).
3. **Newsletter sponsorship** once the list is >2k subscribers (single ad slot per issue).
4. **`Pro / IT` tier (later, optional)** — $9/mo: bulk export (CSV/JSON), GPO + MDM + registry
   payload bundles, Slack/webhook alert when a tracked feature changes verdict, org watchlist.
   This is the only thing an IT admin will actually pay for; the consumer side stays free forever.
5. **API keys (later)** — free public JSON stays free; paid tier only for high-volume/commercial.

**Explicitly refused**: display ad networks (AdSense/Ezoic), interstitials, cookie-walls, "sponsored
verdicts", paid removal from `/never`. The whole asset is credibility.

## 7. Trust & legal posture

- Verdicts describe **documented product behaviour**, sourced to the vendor's own docs where possible.
- `lastVerified` on every entry; anything older than 90 days is auto-flagged `stale` in the UI.
- **Right of reply**: any vendor can submit a correction; if the toggle is real we flip the verdict
  and log it in the changelog. Corrections are public — that is the content.
- Community votes ("still works" / "it changed") never auto-flip a verdict; they only raise a review flag.
- Open data: `content/entries/*.json` in a public repo, contributions via PR, CC-BY.

## 8. Launch plan

- **v0 (this scaffold)**: 20 entries covering the highest-search-volume offenders, list + entry
  pages + votes + methodology + sponsor page.
- **v1 (launch week)**: 120 entries, `/never` and `/comes-back` feeds, public JSON API, newsletter.
  Launch posts: HN "Show HN: a verdict database for turning AI features off", r/privacy, r/sysadmin
  (angle: GPO payloads), Lobsters, X thread with the `% NEVER` stat as the hook.
- **v2**: OG image per entry, weekly diff bot that watches vendor doc URLs and opens a PR when a
  settings page changes, `/stats` public dashboard, Pro tier.

## 9. Success metrics

- 30 days: 500 entries indexed, 3 sponsor slots sold, 1k newsletter subs.
- Leading indicator that matters: **share of traffic from long-tail search**, not launch spikes.
  This site should still get traffic in 18 months, because the settings keep moving.
