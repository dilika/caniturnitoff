# Contributing an entry

One file per `app × feature` in `content/entries/<slug>.json`. The filename must equal the `slug`.

```bash
cp content/entries/pixel-call-assist.json content/entries/my-new-entry.json
# edit it
pnpm validate:content
```

## Required

- `verdict` — `off` | `buried` | `never`, per the rubric in [`docs/EDITORIAL.md`](docs/EDITORIAL.md).
  When in doubt, pick the harsher one and explain why.
- `steps[]` — the **exact** path a user clicks, or the command/registry key. This is the whole point
  of the site. "Go to settings and turn it off" is not a step.
- `sources[]` — at least one. Vendor documentation beats press beats a community thread.
- `lastVerified` — `YYYY-MM-DD`, the day **you** checked it, on a real device or account.
- `whyTheyDidIt` — one honest sentence. No outrage, no adjectives doing the work.

## Flags

- `onByDefault` — were you opted in without an explicit action?
- `comesBack` — is there a sourced report of the setting resetting after an update?
- `enterpriseOnly` — can only an admin act?

## Not in scope

- whether the AI feature is any good
- what the vendor does with your data for training (link out instead)
- pricing complaints

## Fixing an entry

Settings move constantly. If a path is wrong, open a PR that updates `steps`, bumps
`lastVerified`, and appends a `changelog` line. If the verdict changes, record `verdictBefore` and
`verdictAfter` — the changelog is the most valuable part of the dataset.

## Vendors

If you work for the vendor and the entry is wrong, open a PR or email the address on
`/methodology`. We re-test within 7 days. If the toggle is real, the verdict flips. If it is not,
your message is published in the changelog verbatim.
