import { MetadataRoute } from "next";
import { businesses, locations, services } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ayoayo.ph";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    ...locations.flatMap((location) =>
      services.slice(0, 8).map((service) => ({
        url: `${base}/${location.slug}/${service.slug}`,
        lastModified: new Date(),
      })),
    ),
    ...businesses.map((business) => ({
      url: `${base}/business/${business.slug}`,
      lastModified: new Date(business.updatedAt),
    })),
  ];
}
