import type { Metadata } from "next";
import "./globals.css";
import { Footer, Nav } from "@/components/Shell";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — the off switch database`,
    template: `%s · ${site.shortName}`,
  },
  description: site.tagline,
  openGraph: {
    title: site.name,
    description: site.tagline,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.tagline },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container-tight py-6">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
