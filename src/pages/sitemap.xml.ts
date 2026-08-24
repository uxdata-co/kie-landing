import type { APIRoute } from "astro";
import { LANGS, localePath, type Lang } from "../i18n/ui";

export const prerender = true;

/** Locale-less paths of every page on the site, most important first. */
const PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/docs", priority: "0.9", changefreq: "weekly" },
];

/** Machine-readable resources agents look for. Listed so a crawler that only
 *  reads the sitemap still finds the agent entry points. */
const AGENT_RESOURCES = ["/skill.md", "/llms.txt", "/llms-full.txt"];

const LOCALES = Object.keys(LANGS) as Lang[];

const xmlEscape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://kiecli.com");
  const abs = (p: string) => xmlEscape(new URL(p, origin).toString());
  const lastmod = new Date().toISOString().slice(0, 10);

  const entries: string[] = [];

  for (const page of PAGES) {
    for (const lang of LOCALES) {
      // Every localised URL carries the full hreflang set, per Google's spec.
      const alternates = LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(localePath(l, page.path))}"/>`,
      );
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(localePath("en", page.path))}"/>`);
      entries.push(
        [
          "  <url>",
          `    <loc>${abs(localePath(lang, page.path))}</loc>`,
          `    <lastmod>${lastmod}</lastmod>`,
          `    <changefreq>${page.changefreq}</changefreq>`,
          `    <priority>${page.priority}</priority>`,
          ...alternates,
          "  </url>",
        ].join("\n"),
      );
    }
  }

  for (const path of AGENT_RESOURCES) {
    entries.push(
      ["  <url>", `    <loc>${abs(path)}</loc>`, `    <lastmod>${lastmod}</lastmod>`, "    <changefreq>weekly</changefreq>", "    <priority>0.8</priority>", "  </url>"].join("\n"),
    );
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
