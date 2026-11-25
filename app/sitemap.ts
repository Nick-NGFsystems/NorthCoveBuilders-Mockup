import type { MetadataRoute } from "next";
import { floorPlans, toSlug } from "@/lib/site-data";

const BASE = "https://northcovebuilders.com";

// Async so it can emit the dynamic /floor-plans/[slug] pages from the same
// source the route renders from. The portal editor's scraper only walks
// sitemap.xml, so a page missing here is invisible to the editor and to Google.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/our-work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/floor-plans`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/available`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const floorPlanPages: MetadataRoute.Sitemap = floorPlans.map((plan) => ({
    url: `${BASE}/floor-plans/${toSlug(plan.name)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...floorPlanPages];
}
