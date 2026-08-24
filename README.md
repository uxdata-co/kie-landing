# kie-landing

Website for [`kie`](https://github.com/julio-daza/kie-cli), the zero-dependency KIE.ai media
generation CLI for agents. Astro 5, static output, English at `/` and Spanish at `/es/`.

**Live**: https://kiecli.com (`/docs`, `/es/`, `/es/docs`)

## Stack

- Astro 5 with the built-in i18n router (`en` default, `es` prefixed).
- One React island: **MaskedHeading** from [React Bits](https://reactbits.dev/text-animations/masked-heading)
  (MIT) for the hero and closing headlines. The media behind the glyphs is `public/mask.svg`,
  an animated SVG gradient — no external assets, no tracking.
- Agent logos in `src/icons/` come from [@lobehub/icons-static-svg](https://github.com/lobehub/lobe-icons) (MIT) and are inlined by `Icon.astro`; the marks remain trademarks of their owners.
- All copy lives in `src/i18n/ui.ts` (landing) and `src/i18n/docs.ts` (docs page). To add a language: extend `Lang`, add an entry to `ui`,
  create `src/pages/<lang>/index.astro`.
- Terminal transcripts are HTML strings in `src/components/terminals.ts` (Astro collapses
  whitespace inside slotted `<pre>`).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321 and /es/
npm run build      # → dist/
npm run preview
```

## Deploy

Cloudflare Pages project **`kie-landing`**, deployed by GitHub Actions
(`.github/workflows/deploy.yml`) with Wrangler — not by the Pages Git integration:

- push to `main` → production (`kie-landing.pages.dev`)
- pull request → preview deployment on the branch alias

Required repository secrets:

| Secret | Value |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | the Cloudflare account id |
| `CLOUDFLARE_API_TOKEN` | API token with **Account → Cloudflare Pages → Edit** |

Manual deploy from a laptop (same token in the environment):

```bash
npm run build
CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… npx wrangler pages deploy dist --project-name=kie-landing
```

If the site moves to a custom domain, update `site` in `astro.config.mjs` (canonical, hreflang
and Open Graph URLs derive from it).

## License

MIT. "KIE" and its logo belong to their owner.

## Agent-readiness surface

The site is built to be consumed by AI agents, not just read by people. Verify
with <https://isitagentready.com/kiecli.com>.

| Resource | Path | Produced by |
|---|---|---|
| Crawl rules, content signals, sitemap + agentmap pointers | `/robots.txt` | `public/robots.txt` |
| Sitemap (all locales, hreflang, agent resources) | `/sitemap.xml` | `src/pages/sitemap.xml.ts` — generated from the route list |
| Agent operating guide (**the entry point**) | `/skill.md` | `public/skill.md` |
| Site overview for LLMs | `/llms.txt` | `public/llms.txt` |
| Full reference, single file | `/llms-full.txt` | `public/llms-full.txt` |
| Authentication model | `/auth.md` | `public/auth.md` |
| Agent Skills discovery index | `/.well-known/agent-skills/index.json` | `scripts/gen-agent-manifests.mjs` |
| The `kie-media` skill | `/.well-known/agent-skills/kie-media/SKILL.md` | synced from `../code/skills/kie-media/` |
| MCP server card (stdio) | `/.well-known/mcp/server-card.json`, `/.well-known/mcp.json` | `scripts/gen-agent-manifests.mjs` |
| ARD capability manifest | `/.well-known/ai-catalog.json` | `scripts/gen-agent-manifests.mjs` |
| `Link:` discovery headers (RFC 8288) | all responses | `public/_headers` |
| `Accept: text/markdown` negotiation | `/`, `/docs` (+ `/es/*`) | `functions/_middleware.js` |
| Real 404s for machine paths | `/.well-known/*`, `*.json|xml|md|txt` | `functions/_middleware.js` |
| WebMCP browser tools | homepage + docs | `src/components/WebMcp.astro` |

Two rules when editing:

- **Never hand-write the digests** in `agent-skills/index.json`. They are SHA-256
  hashes of `skill.md` and the published `SKILL.md`, regenerated on every build
  by `npm run manifests`. A stale digest is worse than none — a verifying agent
  would reject a good skill.
- **Do not publish a manifest for something that does not exist.** There is no
  OAuth server, no A2A agent and no HTTP API here, so those well-known paths
  return a real 404 rather than a fabricated document. An agent that trusts a
  fake manifest fails worse than one that gets an honest "not supported".

### One manual step: DNS-AID

The only agent-readiness check that cannot be fixed from this repo is DNS for AI
Discovery, which needs records on the `kiecli.com` zone. In the Cloudflare
dashboard, add:

```dns
_index._agents.kiecli.com.   3600 IN HTTPS 1 kiecli.com. alpn="h2,http/1.1"
_catalog._agents.kiecli.com. 3600 IN TXT   "url=https://kiecli.com/.well-known/ai-catalog.json"
```

Enable DNSSEC on the zone so validating resolvers return authenticated data.
