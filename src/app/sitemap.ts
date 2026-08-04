import type { MetadataRoute } from "next";
import { loadEntries, vendorSlug } from "@/lib/content";
import { categories, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = loadEntries();
  const vendors = [...new Set(entries.map((e) => vendorSlug(e.vendor)))];

  // "/sponsor" is intentionally excluded — sponsorships are paused and the page is noindex.
  const staticRoutes = ["", "/never", "/comes-back", "/methodology", "/stats"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
      priority: path === "" ? 1 : 0.6,
    })),
    ...categories.map((c) => ({
      url: `${site.url}/category/${c.slug}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
    ...vendors.map((v) => ({
      url: `${site.url}/vendor/${v}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
    ...entries.map((e) => ({
      url: `${site.url}/${e.slug}`,
      lastModified: new Date(e.lastVerified),
      priority: 0.9,
    })),
  ];
}
