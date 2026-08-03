# Editorial rules

The only asset this site has is that people believe the verdict. These rules are public and binding.

## 1. What a verdict measures

A verdict answers exactly one question: **can a normal user of this product stop this AI feature
from running, using controls the vendor provides?**

It does NOT measure:

- whether the AI feature is good, useful, or accurate
- whether the vendor is evil
- whether data is used for training (that is a different site's job — we link out)

## 2. Verdict rubric

| Verdict | Test |
|---|---|
| 🟢 `OFF` | A user-facing setting exists in the product UI, reachable in ≤ 3 screens, and disabling it removes the AI feature without removing unrelated functionality. |
| 🟡 `BURIED` | Any of: requires `about:config` / `chrome://flags` / registry / plist / CLI / config file; admin-, owner- or enterprise-only; region-gated; kills non-AI features as collateral; requires uninstalling a system component. |
| 🔴 `NEVER` | No documented control for an individual user. "Use the product less" is not a control. |

Ambiguity rule: **when torn between two verdicts, pick the harsher one and explain why in
`collateral` or `steps`.** Being generous to vendors is how a tracker loses its readers.

## 3. Flags (never the verdict itself)

- `ON BY DEFAULT` — the feature was enabled without an explicit user action.
- `COMES BACK` — at least one sourced report of the setting being reset by an update.
- `ENTERPRISE ONLY` — only a tenant admin can act; end users cannot.
- `STALE` — auto-applied by the UI when `lastVerified` is older than 90 days.

## 4. Sourcing

Order of preference:

1. Vendor documentation / release notes / support article (link the canonical URL).
2. Vendor's own settings UI, described by path, verified by a contributor on that version.
3. Reputable press or a high-signal community thread (HN/Reddit) with reproducible steps.

Every entry needs **at least one source**. `NEVER` verdicts need a source showing the absence is
deliberate (vendor statement, support answer, or a doc that documents every other toggle but not this one).

## 5. Money never touches a verdict

- Sponsors cannot buy, influence, soften, or delay a verdict. Ever.
- A sponsor's own product can appear on `/never`. If that ends the sponsorship, it ends.
- `alternatives[]` entries are chosen on the criterion "does not force AI on the user", **before**
  any affiliate relationship is considered. Affiliate status is disclosed per link.
- No paid removal, no paid re-review, no embargo.

## 6. Right of reply

Any vendor or user can contest an entry (issue, PR, or email). Process:

1. We re-test within 7 days.
2. If the toggle exists and works → verdict flipped, changelog entry added, correction credited.
3. If it does not → the contest itself is published in the changelog, verbatim.

Corrections are never silent. The changelog is the product.

## 7. Votes

Two buttons per entry: **`still works`** / **`it changed`**.

- Votes are a *review signal*, not a verdict. They never auto-flip anything.
- 5+ `it changed` votes within 30 days → entry enters the review queue and shows a `disputed` badge.
- One vote per entry per browser/IP window. No accounts, no tracking beyond that.

## 8. Tone

Short, lowercase, factual, no outrage-farming adjectives in the data. The facts are already damning;
the site does not need to shout. Save the attitude for the headings and the empty states.
