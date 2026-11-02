import type { MetadataRoute } from "next";
import { siteContent, siteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  if (!siteContent.publication.isReady) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/confirmation"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
