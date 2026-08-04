import Link from "next/link";
import { loadSponsors } from "@/lib/content";
import { site } from "@/lib/site";

function utm(url: string, placement: string) {
  const u = new URL(url);
  u.searchParams.set("utm_source", site.shortName);
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", placement);
  return u.toString();
}

export function SponsorCard({
  sponsor,
  placement,
}: {
  sponsor: { name: string; url: string; pitch: string; emoji?: string };
  placement: string;
}) {
  return (
    <a
      href={utm(sponsor.url, placement)}
      rel="sponsored noopener"
      target="_blank"
      className="panel block px-3 py-2.5 hover:border-acid/50"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span aria-hidden>{sponsor.emoji ?? "◆"}</span>
        <span className="truncate">{sponsor.name}</span>
        <span className="chip ml-auto shrink-0 border-line text-[12px] text-dim">sponsor</span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-muted">{sponsor.pitch}</p>
    </a>
  );
}

export function SponsorStrip({ placement = "inline" }: { placement?: string }) {
  const sponsors = loadSponsors().slice(0, 2);
  if (!sponsors.length) return null;
  return (
    <div className="grid gap-2 border-y border-line bg-panel/40 px-3 py-3 sm:grid-cols-2">
      {sponsors.map((s) => (
        <SponsorCard key={s.name} sponsor={s} placement={`${placement}_card`} />
      ))}
    </div>
  );
}

export function SponsorGrid() {
  const sponsors = loadSponsors();
  const open = Math.max(0, site.sponsorSlots - sponsors.length);
  return (
    <section className="mt-10">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xs uppercase tracking-widest text-dim">sponsors</h2>
        <Link href="/sponsor" className="text-sm text-muted hover:text-acid">
          {open > 0
            ? `${open}/${site.sponsorSlots} slots open at $${site.sponsorPricePerSlot}/mo →`
            : `${site.sponsorSlots}/${site.sponsorSlots} slots taken — get notified →`}
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((s) => (
          <SponsorCard key={s.name} sponsor={s} placement="footer_grid" />
        ))}
        {open > 0 && (
          <Link
            href="/sponsor"
            className="panel flex items-center justify-center border-dashed px-3 py-4 text-xs text-dim hover:border-acid/50 hover:text-acid"
          >
            your product here — ${site.sponsorPricePerSlot}/mo
          </Link>
        )}
      </div>
      <p className="mt-2 text-[12px] text-dim">
        sponsors can never buy, soften or delay a verdict. they can appear on /never. see{" "}
        <Link href="/methodology" className="underline">
          methodology
        </Link>
        .
      </p>
    </section>
  );
}
