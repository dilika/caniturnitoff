import { ImageResponse } from "next/og";
import { getEntry, loadEntries } from "@/lib/content";
import { verdictMeta } from "@/lib/verdicts";
import { site } from "@/lib/site";

export const alt = "Can I Turn It Off? — verdict";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return loadEntries().map((e) => ({ slug: e.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#070807",
            color: "#e8ebe6",
            fontFamily: "monospace",
          }}
        >
          <div style={{ fontSize: 48, color: "#c6ff3d" }}>can i turn it off?</div>
        </div>
      ),
      { ...size }
    );
  }

  const v = verdictMeta[entry.verdict];
  const verdictColors: Record<string, string> = {
    off: "#4ade80",
    buried: "#fbbf24",
    never: "#f8717a",
  };
  const vc = verdictColors[entry.verdict] ?? "#c6ff3d";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#070807",
          color: "#e8ebe6",
          fontFamily: "monospace",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 28, color: "#c6ff3d", fontWeight: 700 }}>
            can i turn it off?
          </span>
          <span style={{ fontSize: 20, color: "#5f665e" }}>— the off switch database</span>
        </div>

        {/* verdict badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#0e100e",
              border: `2px solid ${vc}`,
              borderRadius: 4,
              padding: "8px 20px",
              fontSize: 32,
              fontWeight: 700,
              color: vc,
              letterSpacing: "0.05em",
            }}
          >
            {v.label}
          </div>
          {entry.onByDefault && (
            <div
              style={{
                display: "flex",
                background: "#0e100e",
                border: "1px solid #2a2f2a",
                borderRadius: 4,
                padding: "6px 16px",
                fontSize: 22,
                color: "#f8717a",
              }}
            >
              on by default
            </div>
          )}
          {entry.comesBack && (
            <div
              style={{
                display: "flex",
                background: "#0e100e",
                border: "1px solid #2a2f2a",
                borderRadius: 4,
                padding: "6px 16px",
                fontSize: 22,
                color: "#f0a5ff",
              }}
            >
              comes back
            </div>
          )}
        </div>

        {/* app + feature */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {entry.app} — {entry.feature}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8b948a", maxWidth: 900 }}>
            {entry.summary}
          </div>
        </div>

        {/* footer info */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            alignItems: "center",
            gap: 24,
            fontSize: 20,
            color: "#5f665e",
          }}
        >
          <span>#{entry.rank} on the offender list</span>
          <span>·</span>
          <span>verified {entry.lastVerified}</span>
          <span>·</span>
          <span>{entry.platforms.join(" · ")}</span>
        </div>

        {/* accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 4,
            background: vc,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
