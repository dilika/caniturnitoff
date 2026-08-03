import { NextResponse } from "next/server";
import { rankedEntries, siteStats } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const stats = await siteStats();
  const entries = await rankedEntries();
  return NextResponse.json(
    {
      source: site.url,
      license: "CC-BY-4.0",
      generatedAt: new Date().toISOString(),
      stats,
      entries: entries.map((e) => ({
        ...e,
        url: `${site.url}/${e.slug}`,
      })),
    },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
