import { NextResponse } from "next/server";
import { loadEntries } from "@/lib/content";
import { castVote } from "@/lib/votes";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const { slug, kind } = (body ?? {}) as { slug?: string; kind?: string };

  if (!slug || (kind !== "works" && kind !== "changed")) {
    return NextResponse.json({ error: "slug and kind (works|changed) required" }, { status: 400 });
  }

  const exists = loadEntries().some((e) => e.slug === slug);
  if (!exists) {
    return NextResponse.json({ error: "unknown slug" }, { status: 404 });
  }

  const counts = castVote(slug, kind);
  return NextResponse.json(counts);
}
