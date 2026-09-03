import { MetadataRoute } from "next";

const routes = [
  "",
  "about",
  "sub-churches",
  "ministries",
  "sermons",
  "events",
  "gallery",
  "prayer",
  "contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com"; // TODO: replace with your real domain
  return routes.map((route) => ({
    url: `${base}/${route}`,
    lastModified: new Date(),
  }));
}
