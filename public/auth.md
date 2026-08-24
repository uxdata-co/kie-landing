# auth.md — how agents authenticate with kie

This document follows the [Auth.md](https://auth-md.org/) convention for
describing how an automated client obtains and uses credentials. It is
self-contained: **kiecli.com hosts no API and issues no tokens**, so there is
no OAuth Authorization Server and no Protected Resource Metadata to fetch. If
you are looking for `/.well-known/oauth-authorization-server` or
`/.well-known/oauth-protected-resource` on this host, they do not exist by
design, and they should return `404`.

## Audience

Agents that want to generate images or video through the `kie` CLI
(`@uxdata-co/kie`) or its stdio MCP server. Full operating guide:
<https://kiecli.com/skill.md>.

## The model: the agent never holds a credential

`kie` is a local command-line tool, not a hosted service. The trust boundary is
deliberately drawn so that **the credential never enters the agent's context**:

| Party | Holds | Sees |
|---|---|---|
| Human operator | The KIE.ai API key | Everything |
| Operating system keystore | The key at rest | — |
| `kie` process | The key in memory, for one request | Redacts it from all output |
| **Agent** | **Nothing** | Only exit codes, JSON, and local file paths |

There is no token to request, no scope to negotiate, and no header to set. An
agent authenticates by *invoking a binary that is already authenticated*.

## Provisioning (performed by the human, not the agent)

1. The operator creates a **dedicated API key for agent use** at
   <https://kie.ai/api-key>, and sets hourly/daily spend caps and an IP
   allow-list there. KIE enforces those server-side even if this CLI is
   bypassed.
2. The operator runs `kie key set` in their own terminal. Input is hidden.
3. The key is written to the OS keystore: macOS Keychain (service `kie-cli`),
   Windows DPAPI (user scope), or Linux Secret Service via `secret-tool`. If
   none is available, it falls back to `~/.config/kie/key` with `0600`
   permissions.

Resolution order at run time: `KIE_API_KEY` (only when `KIE_ALLOW_ENV_KEY=1`)
→ OS keystore → `~/.config/kie/key`. `KIE_DISABLE_KEYCHAIN=1` forces the file.

## Supported methods

| Method | Status | Notes |
|---|---|---|
| OS keystore (Keychain / DPAPI / Secret Service) | **Default** | Recommended. Set by `kie key set`. |
| `0600` file at `~/.config/kie/key` | Fallback | Used when no keystore is present. |
| `KIE_API_KEY` environment variable | Opt-in only | Requires `KIE_ALLOW_ENV_KEY=1`. Not recommended when an agent shares the environment. |
| Dynamic client registration | **Not supported** | No registration endpoint exists. |
| OAuth 2.0 / OIDC | **Not supported** | No authorization server. |

## What an agent should do

```bash
kie key check        # is a key present and valid? prints a masked key + balance
```

- **Success** — proceed. Read <https://kiecli.com/skill.md> for the command
  surface and the spend guard.
- **Exit code 5** — the key is missing or rejected. Tell the human to run
  `kie key set` themselves. Do **not** ask them to paste the key into the
  conversation, do not echo it, and do not set `KIE_API_KEY` on their behalf.
- **`kie` not on PATH and `api.kie.ai` unreachable** — you are in a sandbox
  without access to the operator's machine. Do not attempt to install or
  provision anything. Ask the human to run the request from a terminal agent,
  or to install the stdio MCP server with `kie mcp install`.

## Credential use and hygiene

- Keystore tools are invoked by absolute path; the secret is never placed on a
  command line or in an argv array.
- Every byte the CLI writes to stdout and stderr passes through a redactor. The
  key never appears in output, in `~/.config/kie/ledger.jsonl`, or in
  `~/.config/kie/config.json`.
- Outbound traffic is limited to `api.kie.ai`, KIE's upload host
  (`kieai.redpandaai.co`) and the result URLs KIE returns. No `callBackUrl` is
  ever sent; attempts to set one are rejected.
- Revocation is performed at <https://kie.ai/api-key>. Locally,
  `kie key delete` removes the credential from the keystore.

## Contact

Vulnerabilities: report privately through GitHub Security Advisories on
<https://github.com/julio-daza/kie-cli> (see `SECURITY.md`). This is an
independent MIT-licensed project, not affiliated with KIE.ai.
