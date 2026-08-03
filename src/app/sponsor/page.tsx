import type { Metadata } from "next";
import { loadSponsors, siteStats } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsor — reach people actively turning AI off",
  description: `${site.sponsorSlots} sponsor slots on the off-switch database. Flat monthly price, no impressions games, no ad network.`,
};

export default function SponsorPage() {
  const taken = loadSponsors().length;
  const open = Math.max(0, site.sponsorSlots - taken);
  const stats = siteStats();

  return (
    <article className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">sponsor</h1>
        <p className="mt-1 text-sm text-muted">
          {taken}/{site.sponsorSlots} slots taken · ${site.sponsorPricePerSlot}/mo flat · no ad
          network, no impression games, no tracking pixels.
        </p>
      </header>

      <section className="panel p-4">
        <h2 className="text-xs uppercase tracking-widest text-dim">who reads this</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>people who just discovered they cannot turn an AI feature off — high intent, angry, looking for an alternative</li>
          <li>sysadmins and IT looking for GPO / registry / MDM payloads</li>
          <li>privacy- and local-first-minded devs and power users</li>
        </ul>
        <p className="mt-2 text-xs text-dim">
          currently tracking {stats.total} features across {stats.vendors} vendors.
        </p>
      </section>

      <section className="panel p-4">
        <h2 className="text-xs uppercase tracking-widest text-dim">what you get</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>a card in the footer grid on every page</li>
          <li>rotation into the 2 inline cards inside the offender list</li>
          <li>utm-tagged link, `rel=&quot;sponsored&quot;`, clearly labelled as a sponsor</li>
          <li>one mention in the weekly email while the slot is live</li>
        </ul>
      </section>

      <section className="panel p-4">
        <h2 className="text-xs uppercase tracking-widest text-dim">what you cannot buy</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>a verdict, a softer verdict, or a delayed verdict</li>
          <li>removal from the wall of shame</li>
          <li>an entry about a competitor</li>
        </ul>
        <p className="mt-2 text-xs text-dim">
          if your product forces AI on users, it gets the verdict it deserves — sponsorship or not.
          that rule is why the audience trusts the list, which is the only reason the slot is worth
          anything.
        </p>
      </section>

      <section className="panel p-4">
        <h2 className="text-xs uppercase tracking-widest text-dim">grab a slot</h2>
        <p className="mt-2 text-sm">
          {open > 0 ? (
            <>
              {open} slot{open > 1 ? "s" : ""} open. email{" "}
              <a href={`mailto:${site.contact}`} className="text-acid underline">
                {site.contact}
              </a>{" "}
              with your product, the link, and one line of pitch.
            </>
          ) : (
            <>
              sold out. email{" "}
              <a href={`mailto:${site.contact}`} className="text-acid underline">
                {site.contact}
              </a>{" "}
              to get on the waitlist for the next cycle.
            </>
          )}
        </p>
      </section>
    </article>
  );
}
