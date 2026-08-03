import { NextResponse } from "next/server";
import { loadEntries } from "@/lib/content";
import { castVote, hasVoted } from "@/lib/votes";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const { slug, kind, voterId } = (body ?? {}) as { slug?: string; kind?: string; voterId?: string };

  if (!slug || (kind !== "works" && kind !== "changed")) {
    return NextResponse.json({ error: "slug and kind (works|changed) required" }, { status: 400 });
  }

  const exists = loadEntries().some((e) => e.slug === slug);
  if (!exists) {
    return NextResponse.json({ error: "unknown slug" }, { status: 404 });
  }

  const ip = getIp(request);
  const vid = voterId ?? "";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  if (await hasVoted(slug, ip, vid)) {
    return NextResponse.json({ error: "already voted" }, { status: 409 });
  }

  const counts = await castVote(slug, kind, { ip, voterId: vid });
  return NextResponse.json(counts);
}
