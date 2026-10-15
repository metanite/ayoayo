import { MetadataRoute } from "next";
import { getDirectoryData } from "@/lib/directory";
import { locationPath, shopPath } from "@/lib/urls";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { businesses, locations, services } = await getDirectoryData();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ayoayo.ph";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...locations.map((location) => ({
      url: `${base}${locationPath(location.slug)}`,
      lastModified: new Date(),
    })),
    ...locations.flatMap((location) =>
      services.slice(0, 8).map((service) => ({
        url: `${base}${locationPath(location.slug)}/${service.slug}`,
        lastModified: new Date(),
      })),
    ),
    ...businesses.map((business) => ({
      url: `${base}${shopPath(business.locationSlug, business.slug)}`,
      lastModified: new Date(business.updatedAt),
    })),
  ];
}
