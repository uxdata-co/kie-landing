#!/usr/bin/env node
/**
 * Generates the machine-readable discovery manifests under public/.well-known/.
 *
 * They are generated rather than hand-written because two of them embed SHA-256
 * digests of files that change (skill.md, the kie-media SKILL.md). A stale
 * digest is worse than no digest: an agent that verifies it would reject a
 * perfectly good skill. Run from `npm run build`, before `astro build`.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const WK = join(PUBLIC, ".well-known");
const ORIGIN = "https://kiecli.com";

/** The canonical skill lives in the CLI repo; this landing site republishes it.
 *  When the sibling checkout is absent (CI builds only this repo) the copy
 *  already committed under public/ is used as-is. */
const UPSTREAM_SKILL = join(ROOT, "..", "code", "skills", "kie-media", "SKILL.md");
const PUBLISHED_SKILL = join(WK, "agent-skills", "kie-media", "SKILL.md");

const sha256 = (buf) => `sha256:${createHash("sha256").update(buf).digest("hex")}`;

const write = async (path, data) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n");
  console.log(`  ✓ ${path.slice(PUBLIC.length + 1)}`);
};

console.log("Generating agent discovery manifests…");

// Refresh the republished skill from the CLI repo when it is checked out next door.
try {
  await copyFile(UPSTREAM_SKILL, PUBLISHED_SKILL);
  console.log("  ✓ synced kie-media/SKILL.md from ../code");
} catch {
  console.log("  · ../code not checked out — using the committed SKILL.md");
}

const skillMd = await readFile(join(PUBLIC, "skill.md"));
const kieMediaMd = await readFile(PUBLISHED_SKILL);

// --- Agent Skills Discovery, schemas.agentskills.io/discovery/0.2.0 ---------
await write(join(WK, "agent-skills", "index.json"), {
  $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  skills: [
    {
      name: "kie-media",
      type: "skill-md",
      description:
        "Generate images and videos on KIE.ai (Nano Banana 2, Seedream V4, Kling 3.0, Seedance 2.5, MiniMax H3, Veo 3) with the kie CLI, under hard spend limits, and hand back local file paths. Use when the user asks to generate, create, render or edit an image, illustration, logo draft, mockup, poster, video clip, animation or b-roll, or mentions KIE, Kling, Veo, Seedance or Nano Banana.",
      url: `${ORIGIN}/.well-known/agent-skills/kie-media/SKILL.md`,
      digest: sha256(kieMediaMd),
      license: "MIT",
      homepage: ORIGIN,
      version: "1.4",
    },
    {
      name: "kie-getting-started",
      type: "skill-md",
      description:
        "Install and operate the kie CLI from scratch: preflight checks, storing the KIE.ai API key in the OS keystore, the spend guard, exit codes, the full command surface, and how to install the skill or the stdio MCP server. Use when kie is not yet set up, or when a command exited non-zero and you need to interpret the code.",
      url: `${ORIGIN}/skill.md`,
      digest: sha256(skillMd),
      license: "MIT",
      homepage: ORIGIN,
      version: "1.4",
    },
  ],
});

// --- MCP Server Card, SEP-1649 ---------------------------------------------
// `kie mcp` is deliberately stdio-only: a network server holding a paid API key
// is precisely the thing this project exists to avoid. The card describes how to
// spawn it locally rather than advertising an HTTP endpoint that does not exist.
const serverCard = {
  $schema: "https://modelcontextprotocol.io/schemas/draft/server-card.json",
  serverInfo: {
    name: "kie",
    title: "kie — KIE.ai media generation",
    version: "1.4.0",
    description:
      "Generate images and video on KIE.ai from a desktop AI app. The KIE API key stays in the OS keystore on the user's machine; the app receives only results and local file paths. Per-task cap, daily budget and balance are checked before any request is sent.",
    websiteUrl: ORIGIN,
    documentationUrl: `${ORIGIN}/docs#mcp`,
    repositoryUrl: "https://github.com/julio-daza/kie-cli",
  },
  protocolVersion: "2025-06-18",
  transport: {
    type: "stdio",
    command: "kie",
    args: ["mcp"],
    install: "npm i -g @uxdata-co/kie && kie key set && kie mcp install",
    note: "Local stdio only, by design. There is no remote endpoint: a network server holding a paid media API key is the risk this project removes. `kie mcp install` registers it in Claude Desktop, the Codex app and Cursor.",
  },
  capabilities: {
    tools: { listChanged: false },
    resources: false,
    prompts: false,
    logging: {},
  },
  tools: [
    { name: "kie_credits", description: "Balance and today's spend against the daily budget." },
    { name: "kie_models", description: "Curated image and video models, and the flags each one supports." },
    { name: "kie_generate_image", description: "Generate an image, wait, download it; returns the local path plus the image inline (≤ 1.5 MB)." },
    { name: "kie_generate_video", description: "Generate a video, wait, download it. `max_credits` is required." },
    { name: "kie_task_status", description: "Poll a task once, without downloading." },
    { name: "kie_wait_task", description: "Wait for a task to finish, then download the result." },
    { name: "kie_upload", description: "Upload a local file and return a temporary KIE URL for use as a reference." },
    { name: "kie_ledger", description: "Real credits consumed, per task." },
  ],
  authentication: {
    type: "none",
    note: "The MCP client never handles a credential. The KIE API key is provisioned by the human with `kie key set` and read from the OS keystore by the server process. See /auth.md.",
  },
  license: "MIT",
};
await write(join(WK, "mcp", "server-card.json"), serverCard);
await write(join(WK, "mcp.json"), serverCard); // legacy discovery path

// --- ARD capability manifest, ai-catalog data model -------------------------
await write(join(WK, "ai-catalog.json"), {
  specVersion: "1.0",
  host: {
    displayName: "kie — KIE.ai media generation CLI",
    identifier: "did:web:kiecli.com",
    description:
      "Zero-dependency CLI that lets AI agents generate images and video on KIE.ai without ever seeing the API key, under hard spend limits.",
    url: ORIGIN,
  },
  entries: [
    {
      identifier: "urn:air:kiecli.com:skill:kie-getting-started",
      displayName: "kie — agent operating guide",
      description:
        "Complete self-contained guide for an agent using the kie CLI: preflight, model choice, spend guard, exit codes and the full command surface.",
      type: "text/markdown",
      url: `${ORIGIN}/skill.md`,
      representativeQueries: [
        "how do I generate an image with the kie CLI",
        "generate a 16:9 hero image without leaking my API key",
        "what does exit code 3 mean in kie",
        "how do I cap how many credits a video generation can cost",
      ],
    },
    {
      identifier: "urn:air:kiecli.com:skill:kie-media",
      displayName: "kie-media agent skill",
      description:
        "Agent Skills–spec skill that teaches Claude Code, Codex, Cursor and Gemini CLI to generate images and video with the kie CLI under strict spend limits.",
      type: "text/markdown",
      url: `${ORIGIN}/.well-known/agent-skills/kie-media/SKILL.md`,
      representativeQueries: [
        "install a skill so my coding agent can generate images",
        "which KIE model should I use for a short video clip with audio",
        "generate a video from a reference image with Kling 3.0",
      ],
    },
    {
      identifier: "urn:air:kiecli.com:server:kie-mcp",
      displayName: "kie MCP server (stdio)",
      description:
        "Local stdio MCP server exposing image and video generation, credits, uploads and the spend ledger to desktop AI apps.",
      type: "application/mcp-server-card+json",
      url: `${ORIGIN}/.well-known/mcp/server-card.json`,
      representativeQueries: [
        "MCP server for generating images in Claude Desktop",
        "add KIE.ai video generation to Cursor",
        "generate media from a desktop app without exposing my API key",
      ],
    },
    {
      identifier: "urn:air:kiecli.com:doc:reference",
      displayName: "kie full documentation",
      description:
        "Every command, flag, model, config key, exit code and security note for the kie CLI, in a single Markdown file.",
      type: "text/markdown",
      url: `${ORIGIN}/llms-full.txt`,
      representativeQueries: [
        "kie CLI command reference",
        "how do I change the kie daily budget",
        "where does kie store the KIE.ai API key",
      ],
    },
    {
      identifier: "urn:air:kiecli.com:doc:auth",
      displayName: "kie authentication model",
      description:
        "How credentials are provisioned and used: the human stores the KIE API key in the OS keystore, the agent never holds one. No OAuth.",
      type: "text/markdown",
      url: `${ORIGIN}/auth.md`,
      representativeQueries: [
        "how does an agent authenticate with kie",
        "does kiecli support OAuth",
        "where is the KIE API key stored",
      ],
    },
  ],
});

console.log("Done.");
