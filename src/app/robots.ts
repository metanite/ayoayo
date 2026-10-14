import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ayoayo.ph";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search?"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
