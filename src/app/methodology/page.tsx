import type { Metadata } from "next";
import { PageHeader } from "@/components/Shell";
import { site } from "@/lib/site";
import { verdictMeta, VERDICTS } from "@/lib/verdicts";

export const metadata: Metadata = {
  title: "Methodology — how a verdict is assigned",
  description:
    "How Can I Turn It Off? assigns OFF / BURIED / NEVER, how entries are sourced and re-verified, and why sponsors can never touch a verdict.",
};

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-7">
      <PageHeader title="methodology">
        the only asset this site has is that you believe the verdict. so here are the rules, in
        public.
      </PageHeader>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">the one question</h2>
        <p className="mt-2 text-sm">
          a verdict answers exactly one thing: <strong>can a normal user of this product stop this
          AI feature from running, using controls the vendor provides?</strong> not whether the
          feature is good. not whether the vendor is evil. not what they do with your data — that is
          a different site&apos;s job.
        </p>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">the rubric</h2>
        <div className="mt-2 space-y-2">
          {VERDICTS.map((v) => (
            <div key={v} className="panel p-3">
              <span className={`font-semibold ${verdictMeta[v].color}`}>
                {verdictMeta[v].dot} {verdictMeta[v].label}
              </span>
              <p className="mt-1 text-sm text-muted">{verdictMeta[v].blurb}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">
          tie-break rule: when torn between two verdicts, we pick the harsher one and explain why.
          being generous to vendors is how a tracker loses its readers.
        </p>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">flags, not verdicts</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>
            <strong className="text-never">on by default</strong> — you were opted in without asking.
          </li>
          <li>
            <strong className="text-flag">comes back</strong> — sourced reports of the toggle being
            reset by an update.
          </li>
          <li>
            <strong>admin only</strong> — only a tenant admin can act; end users cannot.
          </li>
          <li>
            <strong>stale</strong> — auto-applied when the entry is older than {site.staleAfterDays}{" "}
            days.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">sourcing</h2>
        <p className="mt-2 text-sm text-muted">
          vendor documentation first, then the settings UI described by path and verified by a
          contributor, then reputable press or a reproducible community thread. every entry needs at
          least one source and a <code className="text-acid">lastVerified</code> date.
        </p>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">money never touches a verdict</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>sponsors cannot buy, soften, or delay a verdict. ever.</li>
          <li>a sponsor&apos;s own product can appear on the wall of shame. if that ends the
            sponsorship, it ends.</li>
          <li>
            alternatives are picked on one criterion — &quot;does not force AI on the user&quot; —
            before any affiliate relationship. affiliate links are labelled.
          </li>
          <li>no display ad networks, no paid removal, no sponsored entries.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">right of reply</h2>
        <p className="mt-2 text-sm text-muted">
          contest any entry at{" "}
          <a href={`mailto:${site.contact}`} className="text-acid underline">
            {site.contact}
          </a>{" "}
          or by PR. we re-test within 7 days. if the toggle is real, the verdict flips and the
          changelog records it. if it is not, the contest is published verbatim. corrections are
          never silent.
        </p>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">votes</h2>
        <p className="mt-2 text-sm text-muted">
          &quot;still works&quot; / &quot;it changed&quot; are review signals only. they never
          auto-flip a verdict. 5+ &quot;it changed&quot; votes puts an entry in the review
          queue with a disputed badge. voting is rate-limited and deduplicated by IP and
          browser fingerprint to keep the signal honest.
        </p>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">report an error</h2>
        <p className="mt-2 text-sm text-muted">
          every entry page has a &quot;report an error&quot; link that opens a pre-filled GitHub
          issue. wrong steps, changed settings, or a verdict you disagree with — flag it and we
          re-verify within 7 days.
        </p>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim">open data</h2>
        <p className="mt-2 text-sm text-muted">
          the whole dataset lives in json in a public repo, CC-BY. improve an entry with a pull
          request:{" "}
          <a href={site.repo} className="text-acid underline">
            {site.repo.replace("https://", "")}
          </a>{" "}
          · machine-readable:{" "}
          <a href="/api/entries.json" className="text-acid underline">
            /api/entries.json
          </a>
        </p>
      </section>
    </article>
  );
}
