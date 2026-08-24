---
name: kie-media
description: >
  Generate images and videos on KIE.ai (Nano Banana 2, Seedream V4, Kling 3.0,
  Seedance 2.5, MiniMax H3, Veo 3) with the `kie` CLI, under hard spend limits,
  and hand back local file paths. Use when the user asks to generate, create,
  render or edit an image, illustration, logo draft, mockup, poster, video clip,
  animation or b-roll, or mentions KIE, Kling, Veo, Seedance or Nano Banana.
license: MIT
homepage: https://kiecli.com
repository: https://github.com/julio-daza/kie-cli
package: "@uxdata-co/kie"
metadata:
  author: juliodaza
  version: "1.4"
---

# kie — generate media on KIE.ai without ever seeing the API key

You are reading the agent entry point for **[kie](https://kiecli.com)**, a
zero-dependency CLI that turns a KIE.ai account into image and video generation
you can call from a shell. It exists for exactly your situation: an agent that
needs to make media on someone else's paid account.

Two properties matter to you:

1. **You never handle the API key.** It lives in the operating system keystore
   (macOS Keychain, Windows DPAPI, Linux Secret Service). Every byte the CLI
   prints goes through a redactor. You cannot leak what you cannot read.
2. **You cannot overspend.** A per-task cap, a daily budget backed by a ledger
   of real credits consumed, and a balance check all run *before* the request
   leaves the machine. Blocked means exit code 3 and nothing was sent.

If that is what you need, everything below is the complete contract. You do not
need to read anything else.

---

## 0. Preflight

```bash
kie version        # is it installed?
kie key check      # is a key present and valid? prints a masked key + balance
kie credits --json # {"balance":980,"spentToday":16,"dailyBudget":200,"remainingToday":184}
```

**If `kie` is not on PATH:** `npm i -g @uxdata-co/kie` (needs Node ≥ 20). Then
tell the user to run `kie key set` **themselves** — it prompts with hidden
input. Never ask for the key, never echo it, never set `KIE_API_KEY` yourself.

**If `kie` is missing *and* you cannot reach `api.kie.ai`** (proxy 403, network
allowlist), you are not running on the user's machine — you are in a sandbox.
Do not try to install anything or move the key. Say so, and tell the user to
either run the request from a terminal agent (Claude Code, Codex, Cursor,
Gemini CLI) or install the MCP server for their desktop app with
`kie mcp install`.

---

## 1. The seven rules

| Rule | Why it exists |
|---|---|
| **Run `kie credits` before the first generation of a session.** | Spend is capped per UTC day. Know what is left before you promise a result. |
| **Always pass `--json`.** | With a TTY on stdout the CLI prints human tables; `--json` pins the machine contract and sends chatter to stderr. |
| **Always pass `--max-credits` on video, and on any model without a verified estimate.** Start low — images ≤ 20, video ≤ 80. | Only `nano-banana-2` has a verified price. Everything else refuses to run without an explicit ceiling: you have to state out loud what you accept to spend. |
| **Never retry a blocked call with a bigger number on your own.** Exit 3 means the guard stopped it. Quote the reason and ask. | Raising someone else's spending limit is not your call. |
| **Return the path from the JSON `files` array — never `resultUrls`.** | KIE's result URLs expire in ~24 hours. The file on disk does not. |
| **Draft in images, then move to video.** Generate one image, show it, iterate, and only render a clip once the user approves the look. | Video costs 5–20× more per run. |
| **Upload local references first:** `kie upload <file>` → URL → `--ref`/`--image`. | Models take URLs, not paths. Uploads auto-expire after ~3 days. |

Do **not** use `kie` for diagrams (write SVG or Mermaid), for UI mockups you can
code, or for anything the user did not ask you to spend money on. Every call
costs real credits.

---

## 2. Pick a model

| You need | Command | Cost & notes |
|---|---|---|
| Fast, cheap, good image; edits with references | `kie image nano-banana-2` | 1K ≈ 8 cr · 2K ≈ 12 · 4K ≈ 18. **The default choice.** |
| Posters, text-heavy art, a different style | `kie image seedream-v4` | `--ref` switches it to edit mode. Needs `--max-credits`. |
| Short clip with native audio | `kie video kling-3.0 --sound` | 3–15 s. `--set mode=pro` for quality. |
| Image → video, first/last frame, up to 30 s | `kie video seedance-2.5 --image <url>` | `--resolution 480p` for cheap drafts. |
| A consistent character across shots | `kie video minimax-h3 --ref <url>` | 4–15 s. |
| Highest-quality cinematic | `kie video veo3` | `--fast` is cheaper. Use 16:9 for 1080p. |
| Anything else on the KIE Market | `kie run <vendor>/<model> --input '{…}' --max-credits N` | Check the schema on docs.kie.ai first, then `--dry-run`. |

`kie models --kind image|video --json` prints the live catalog with the flags
each model accepts. Trust it over this table if they disagree.

---

## 3. A complete session

```bash
# 1 — how much can I spend?
kie credits --json
# {"balance":980,"spentToday":16,"dailyBudget":200,"remainingToday":184}

# 2 — draft an image
kie image nano-banana-2 \
  --prompt "flat illustration of a barista handing over a coffee, teal palette" \
  --aspect 16:9 --out ./assets --name hero-barista --json
# {"taskId":"task_…","state":"success","creditsConsumed":8,
#  "files":["assets/hero-barista.png"]}

# 3 — iterate, using the draft as a reference
REF=$(kie upload ./assets/hero-barista.png --json | jq -r .url)
kie image nano-banana-2 \
  --prompt "same illustration, add a plant on the counter" \
  --ref "$REF" --out ./assets --name hero-barista-v2 --json

# 4 — only after the user approves the look: a clip, with an explicit ceiling
IMG=$(kie upload ./assets/hero-barista-v2.png --json | jq -r .url)
kie video kling-3.0 \
  --prompt "the barista slides the cup across the counter, soft dolly-in" \
  --image "$IMG" --duration 5 --sound --max-credits 80 \
  --out ./assets --json
```

Show the user the file path and the credits consumed. That is the whole result.

---

## 4. Exit codes — branch on these

| Code | Meaning | What you should do |
|---|---|---|
| `0` | Success | Report `files[]` and `creditsConsumed`. |
| `1` | KIE failed the task (see `failMsg`) | **Not charged.** Rephrase the prompt or switch model. |
| `2` | Usage error | You built the command wrong. Re-read `kie <cmd> --help`. |
| `3` | **Blocked by the spend guard — nothing was sent** | Quote the reason. Ask before raising `--max-credits` or `dailyBudget`. |
| `4` | Timed out; the task is still running on KIE | `kie wait <taskId> --out <dir> --json` later. |
| `5` | API or auth error | Suggest the user run `kie key check`. |

---

## 5. Full command surface

```bash
kie models   --kind image|video --json
kie image <model> --prompt "…" [--ref <url>]... [--aspect 16:9] [--resolution 1K|2K|4K]
                  [--out <dir>] [--name <base>] [--max-credits N] [--dry-run] --json
kie video <model> --prompt "…" [--image <url>] [--end-image <url>] [--ref <url>]...
                  [--duration <s>] [--sound] --max-credits N [--out <dir>] --json
kie run <model-id> --input '{…}' --max-credits N [--dry-run] --json
kie upload <file> --json          # local file → temporary URL
kie status <taskId> --json        # poll once
kie wait <taskId> --out <dir> --json
kie credits --json                # balance, today's spend, remaining
kie ledger --json                 # real credits consumed, per task
kie config                        # read; `kie config set dailyBudget 300` to change
kie key set | check | delete      # the user runs these, not you
```

`--dry-run` prints the exact payload without sending it, and costs nothing. Use
it whenever you are unsure of a model's input shape or of a `--set` field.

---

## 6. Installing yourself properly

If you are a coding agent that supports Agent Skills, install the real skill
once and it will load automatically in every future session:

```bash
kie skill install                 # Claude Code, Codex, Cursor and Gemini CLI
kie skill install --agent claude  # or: codex | cursor | gemini
kie skill install --project       # into the current repo, for the whole team
```

It lands in `~/.claude/skills/kie-media`, `~/.agents/skills/kie-media`,
`~/.cursor/skills/kie-media` and `~/.gemini/skills/kie-media`. Without the CLI:
`npx skills add julio-daza/kie-cli`.

Desktop apps (Claude Desktop, the Codex app, Cursor) sandbox their shells and
cannot reach the keystore, so they need the stdio MCP server instead:

```bash
kie mcp install                   # registers `kie mcp` in all three
```

It exposes `kie_credits`, `kie_models`, `kie_generate_image`,
`kie_generate_video`, `kie_task_status`, `kie_wait_task`, `kie_upload` and
`kie_ledger`, shares the same catalog, ledger and daily budget, and returns
generated images inline so they render in the chat. It is stdio-only on
purpose: a network server holding a paid key is the thing this project exists
to avoid.

---

## 7. Machine-readable index

| Resource | URL |
|---|---|
| This skill | <https://kiecli.com/skill.md> |
| Site overview for LLMs | <https://kiecli.com/llms.txt> |
| Full documentation, one file | <https://kiecli.com/llms-full.txt> |
| Agent Skills discovery index | <https://kiecli.com/.well-known/agent-skills/index.json> |
| MCP server card | <https://kiecli.com/.well-known/mcp/server-card.json> |
| Capability manifest (ARD) | <https://kiecli.com/.well-known/ai-catalog.json> |
| How authentication works | <https://kiecli.com/auth.md> |
| Source | <https://github.com/julio-daza/kie-cli> |
| Package | <https://www.npmjs.com/package/@uxdata-co/kie> |

Any page on this site is available as Markdown — send `Accept: text/markdown`.

---

*kie is an independent MIT-licensed project. It is not affiliated with,
endorsed by, or supported by KIE.ai.*
