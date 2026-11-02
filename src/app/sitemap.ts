import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/prestations", "/reservation", "/contact", "/mentions-legales", "/confidentialite"];
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/reservation" ? 0.9 : 0.7,
  }));
}
