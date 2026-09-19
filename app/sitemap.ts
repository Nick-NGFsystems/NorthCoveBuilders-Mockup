import { MetadataRoute } from "next";
import { SITE_URL, floorPlans, toSlug } from "@/lib/site-data";

// Async on purpose: the SEO gate requires any site with dynamic routes to have
// an async sitemap, the only shape that can await published content. The plan
// list is static today, but the shape is what keeps [slug] pages enumerable.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: SITE_URL + "/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: SITE_URL + "/our-work",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: SITE_URL + "/process",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: SITE_URL + "/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: SITE_URL + "/floor-plans",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: SITE_URL + "/gallery",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: SITE_URL + "/available",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: SITE_URL + "/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // One entry per floor-plan detail page, built from the same source that
  // app/floor-plans/[slug]/page.tsx feeds to generateStaticParams, so the
  // sitemap cannot drift out of sync with the routes that actually exist.
  const floorPlanPages: MetadataRoute.Sitemap = floorPlans.map((plan) => ({
    url: SITE_URL + "/floor-plans/" + toSlug(plan.name),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...floorPlanPages];
}
