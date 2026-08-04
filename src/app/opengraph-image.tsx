import { ImageResponse } from "next/og";
import { siteStats } from "@/lib/content";
import { site } from "@/lib/site";

export const alt = "Can I Turn It Off? — the off switch database";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const stats = await siteStats();

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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em" }}>
            can i turn <span style={{ color: "#c6ff3d" }}>___</span> off?
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#8b948a", maxWidth: 900 }}>
            {stats.total} AI features added to software you already use.
            one question each: can you actually turn it off, or is it part of the product?
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 700, color: "#22d3ee" }}>
              {stats.byVerdict.off}
            </span>
            <span style={{ fontSize: 18, color: "#5f665e" }}>can turn off</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 700, color: "#fbbf24" }}>
              {stats.byVerdict.buried}
            </span>
            <span style={{ fontSize: 18, color: "#5f665e" }}>buried</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 700, color: "#f8717a" }}>
              {stats.byVerdict.never}
            </span>
            <span style={{ fontSize: 18, color: "#5f665e" }}>never</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 700, color: "#c6ff3d" }}>
              {stats.vendors}
            </span>
            <span style={{ fontSize: 18, color: "#5f665e" }}>vendors</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 4,
            background: "#c6ff3d",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
