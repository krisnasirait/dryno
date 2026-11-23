import type { MetadataRoute } from "next";
import defaultContent from "../../content.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dryno.co.id";
  const lastModified = new Date(defaultContent.updatedAt);

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/?lang=en`,
          id: `${baseUrl}/?lang=id`,
        },
      },
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
