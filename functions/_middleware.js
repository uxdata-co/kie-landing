/**
 * Cloudflare Pages middleware for agent traffic.
 *
 * Two jobs:
 *
 * 1. Markdown content negotiation. An agent that sends `Accept: text/markdown`
 *    gets the Markdown representation of the page instead of an HTML document
 *    it would have to strip tags out of. HTML stays the default for everyone
 *    else. See https://llmstxt.org/ and Cloudflare's "Markdown for Agents".
 *
 * 2. Honest 404s. Pages was answering every unknown path with the HTML shell
 *    and a 200, so `/​.well-known/anything` looked like it existed and returned
 *    a page full of markup. An agent cannot tell "not supported" from
 *    "supported, here is your JSON" that way. Any machine-readable path that
 *    falls through to HTML is turned back into a real 404.
 */

/** Page route -> its Markdown representation. */
const MARKDOWN = new Map([
  ["/", "/llms.txt"],
  ["/es", "/llms.txt"],
  ["/es/", "/llms.txt"],
  ["/docs", "/llms-full.txt"],
  ["/docs/", "/llms-full.txt"],
  ["/es/docs", "/llms-full.txt"],
  ["/es/docs/", "/llms-full.txt"],
]);

/** Extensions and prefixes that must never resolve to an HTML page. */
const MACHINE_EXT = /\.(json|xml|md|txt|yaml|yml|toml)$/i;
const isMachinePath = (pathname) => pathname.startsWith("/.well-known/") || MACHINE_EXT.test(pathname);

/** `Accept: text/markdown` only counts when it is named explicitly — every
 *  browser sends `*​/*` as a fallback and does not want Markdown. */
function wantsMarkdown(request) {
  const accept = request.headers.get("accept") || "";
  return /(^|,)\s*text\/markdown\b/i.test(accept);
}

function notFound(pathname) {
  const body = {
    error: "not_found",
    status: 404,
    path: pathname,
    message: "This host does not publish that resource.",
    hint: "Agents should start at https://kiecli.com/skill.md",
    index: "https://kiecli.com/.well-known/ai-catalog.json",
  };
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
      link: '</skill.md>; rel="describedby"; type="text/markdown"',
    },
  });
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // 1. Markdown negotiation.
  const markdownFor = MARKDOWN.get(url.pathname);
  if (markdownFor && wantsMarkdown(request)) {
    const asset = await env.ASSETS.fetch(new URL(markdownFor, url));
    if (asset.ok) {
      const body = await asset.text();
      return new Response(body, {
        status: 200,
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          "content-location": markdownFor,
          // Rough token estimate; agents use it to budget context before reading.
          "x-markdown-tokens": String(Math.ceil(body.length / 4)),
          vary: "Accept",
          "access-control-allow-origin": "*",
          "cache-control": "public, max-age=3600",
          link: '</skill.md>; rel="describedby"; type="text/markdown"',
        },
      });
    }
  }

  const response = await next();

  // 2. Soft-404 guard.
  if (isMachinePath(url.pathname) && (response.headers.get("content-type") || "").includes("text/html")) {
    return notFound(url.pathname);
  }

  // Tell caches that HTML pages have a Markdown variant.
  if (MARKDOWN.has(url.pathname)) {
    const out = new Response(response.body, response);
    out.headers.append("Vary", "Accept");
    return out;
  }

  return response;
}
