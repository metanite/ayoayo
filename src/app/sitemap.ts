import { MetadataRoute } from "next";
import { getDirectoryData } from "@/lib/directory";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { businesses, locations, services } = await getDirectoryData();
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
