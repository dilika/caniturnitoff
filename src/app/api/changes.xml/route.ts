import { getChanges, formatVerdictTransition } from "@/lib/changes";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const changes = await getChanges(50);

  const items = changes
    .map((c) => {
      const transition = formatVerdictTransition(c.verdictBefore, c.verdictAfter);
      const title = `${c.app} — ${c.feature}${transition ? ` [${transition}]` : ""}`;
      const description = transition
        ? `Verdict changed: ${transition}. ${c.note}`
        : c.note;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${site.url}/${c.slug}</link>
      <guid>${site.url}/${c.slug}#${c.date}</guid>
      <pubDate>${new Date(c.date).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)} — What Changed</title>
    <link>${site.url}/changed</link>
    <description>Every verdict flip, every toggle that came back, every setting that moved.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
