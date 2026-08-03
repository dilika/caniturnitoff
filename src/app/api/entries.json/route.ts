import { NextResponse } from "next/server";
import { rankedEntries, siteStats } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    {
      source: site.url,
      license: "CC-BY-4.0",
      generatedAt: new Date().toISOString(),
      stats: siteStats(),
      entries: rankedEntries().map((e) => ({
        ...e,
        url: `${site.url}/${e.slug}`,
      })),
    },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
