import type { Lang } from "./ui";

/** Copy for the /docs page. Tables (commands, flags, catalog) are reused from ui.ts. */
export interface DocsCopy {
  meta: { title: string; description: string };
  title: string;
  lead: string;
  toc: string;
  backHome: string;
  sections: {
    install: { h: string; p: string; code: string; note: string };
    key: { h: string; p: string; steps: string[]; code: string; keyOrder: string };
    commands: { h: string; p: string };
    flags: { h: string; p: string };
    catalog: { h: string; p: string; escape: string; escapeCode: string };
    guard: { h: string; p: string; checks: string[]; exitH: string; exit: [string, string][] };
    config: { h: string; p: string; rows: [string, string, string][]; code: string };
    skill: { h: string; p: string; code: string; agents: { name: string; icon: string; path: string; invoke: string; note: string }[]; alt: string };
    mcp: { h: string; p: string; code: string; tools: [string, string][]; notes: string[] };
    output: { h: string; p: string; code: string };
    security: { h: string; items: string[] };
    faq: { h: string };
  };
}

const en: DocsCopy = {
  meta: {
    title: "kie docs — commands, flags, spend guard, agent skill",
    description: "Reference for the kie CLI: install, key storage, every command and flag, the model catalog, spend guard and exit codes, config, and the kie-media skill for Claude Code, Codex, Cursor and Gemini CLI.",
  },
  title: "Documentation",
  lead: "Everything the CLI does, in one page. JSON on stdout when piped, tables in a terminal, exit codes you can branch on.",
  toc: "On this page",
  backHome: "← kiecli.com",
  sections: {
    install: {
      h: "Install",
      p: "Node ≥ 20. The package has zero runtime dependencies and is published from GitHub Actions with npm provenance.",
      code: "npm i -g @uxdata-co/kie\nkie version\nnpm audit signatures   # optional: verify the tarball came from the repo",
      note: "From source: clone julio-daza/kie-cli, then `cd kie && npm install && npm run build && npm link`.",
    },
    key: {
      h: "API key",
      p: "Create a dedicated key for agents at kie.ai/api-key and set hourly/daily caps plus an IP allow-list there — KIE enforces those even if this CLI is bypassed. KIE is prepaid: keep a modest balance.",
      steps: ["`kie key set` — paste the key, input is hidden.", "`kie key check` — source, masked key, validity, balance.", "`kie key delete` — remove it from the keystore."],
      code: "kie key set\nkie key check",
      keyOrder: "Resolution order: `KIE_API_KEY` only when `KIE_ALLOW_ENV_KEY=1` → the OS keystore (macOS Keychain service `kie-cli` · Windows DPAPI, user scope · Linux Secret Service via `secret-tool`) → `~/.config/kie/key` (0600). `KIE_DISABLE_KEYCHAIN=1` forces the file. System tools are called by absolute path and the secret never goes on a command line. The key never appears in stdout, stderr, the ledger or the config.",
    },
    commands: { h: "Commands", p: "Generation commands wait for the task, download the result and settle the ledger unless you pass `--no-wait`." },
    flags: { h: "Generation flags", p: "Generic flags are mapped to each model's input fields by the catalog; `--set` passes any raw field through." },
    catalog: {
      h: "Model catalog",
      p: "Aliases you type → KIE model ids. Only `nano-banana-2` has a verified credit estimate; every other model requires `--max-credits`.",
      escape: "Any KIE Market model that is not in the catalog:",
      escapeCode: "kie run <vendor>/<model> --input '{\"prompt\":\"…\"}' --max-credits 30 --dry-run\nkie run <vendor>/<model> --input '{\"prompt\":\"…\"}' --max-credits 30",
    },
    guard: {
      h: "Spend guard & exit codes",
      p: "Evaluated before any request leaves the machine. If it blocks, exit code is 3 and nothing was sent.",
      checks: [
        "Per-task cap — models with a verified estimate are checked against `maxCreditsPerTask`; everything else needs an explicit `--max-credits <n>`.",
        "Daily budget — `~/.config/kie/ledger.jsonl` records every task; on completion the real `creditsConsumed` is written back. Pending tasks count at their cap.",
        "Balance — the estimate (or cap) must fit in the account's remaining credits.",
      ],
      exitH: "Exit codes",
      exit: [["0", "success"], ["1", "task failed on KIE's side (not charged)"], ["2", "usage error"], ["3", "blocked by the spend guard — nothing sent"], ["4", "timed out — task still running; `kie wait <taskId>`"], ["5", "API / auth error"]],
    },
    config: {
      h: "Configuration",
      p: "`~/.config/kie/config.json` (or `$KIE_CONFIG_DIR`). Read with `kie config`, change with `kie config set <key> <value>`.",
      rows: [
        ["dailyBudget", "200", "Max credits per UTC day across all runs (≈ US$1 at $0.005/credit)"],
        ["maxCreditsPerTask", "50", "Per-task cap for models with a known estimate"],
        ["outDir", "./kie-media", "Where results are downloaded"],
        ["pollSeconds", "5", "Poll interval while waiting"],
        ["waitTimeoutSeconds", "900", "Stop waiting after this; the task keeps running on KIE"],
      ],
      code: "kie config\nkie config set dailyBudget 300",
    },
    skill: {
      h: "Agent skill (kie-media)",
      p: "The package ships an Agent Skills–spec skill that teaches coding agents to use the CLI: check the budget first, images before video, always cap video spend, return file paths, never touch the key. One command installs it for the agents you use.",
      code: "kie skill install                  # all four\nkie skill install --agent claude   # one of: claude | codex | cursor | gemini\nkie skill install --project        # into the current repo, for the team\nkie skill install --force          # overwrite an older copy",
      agents: [
        { name: "Claude Code", icon: "claude", path: "~/.claude/skills/kie-media", invoke: "/kie-media", note: "CLI, desktop app and IDE extension. Skills are discovered at session start." },
        { name: "Codex", icon: "openai", path: "~/.agents/skills/kie-media", invoke: "$kie-media · /skills", note: "CLI, IDE extension and desktop app." },
        { name: "Cursor", icon: "cursor", path: "~/.cursor/skills/kie-media", invoke: "/ in Agent chat", note: "Cursor 2.4+. Also reads ~/.agents/skills." },
        { name: "Gemini CLI", icon: "gemini", path: "~/.gemini/skills/kie-media", invoke: "auto (activate_skill) · /skills list", note: "Asks for consent the first time. Also reads ~/.agents/skills." },
      ],
      alt: "Without the CLI: `npx skills add julio-daza/kie-cli` (skills.sh) installs the same folder for any supported agent.",
    },
    mcp: {
      h: "MCP server (desktop apps)",
      p: "Claude Desktop and the Codex app run the agent's shells in a sandbox — no PATH, no keystore, no network to api.kie.ai — so the skill cannot run there. `kie mcp` is a tools-only MCP server over stdio that the app spawns on your machine: the key stays in the keystore, the app only receives results, and generated images are returned inline so they show in the chat. It reuses the CLI's catalog, spend guard and ledger, so the daily budget is shared.",
      code: "kie mcp install                # Claude Desktop + Codex + Cursor\nkie mcp install --app claude   # one of: claude | codex | cursor\nkie mcp config                 # print the JSON snippet for manual setup",
      tools: [
        ["kie_credits", "Balance and today's spend vs the daily budget."],
        ["kie_models", "Curated models and the flags they support."],
        ["kie_generate_image", "Generate, wait, download; returns the path and the image (≤ 1.5 MB) inline."],
        ["kie_generate_video", "Same for video; `max_credits` is required."],
        ["kie_task_status · kie_wait_task", "Poll once / wait and download."],
        ["kie_upload", "Local file → temporary KIE URL for refs."],
        ["kie_ledger", "Real credits consumed per task."],
      ],
      notes: [
        "stdio only, on purpose: a network server holding a paid key is exactly what this project avoids.",
        "The config is written with the absolute Node binary and script path, because GUI apps do not inherit your shell PATH (nvm, volta…).",
        "Configs: macOS `~/Library/Application Support/Claude/claude_desktop_config.json`, `~/.codex/config.toml`, `~/.cursor/mcp.json`. Restart the app after installing.",
        "Claude Code can use it too: `claude mcp add kie -- <node> <path-to-kie>/dist/src/index.js mcp` (the skill is usually enough there).",
      ],
    },
    output: {
      h: "Output contract",
      p: "When stdout is a terminal you get tables, panels and a live spinner. When piped, or with `--json`, stdout is strictly JSON and messages go to stderr — that is what agents should use. `--pretty` forces the human view; `--no-color` or `NO_COLOR` disables ANSI.",
      code: "kie image nano-banana-2 --prompt \"…\" --json\n{\n  \"taskId\": \"task_…\",\n  \"model\": \"nano-banana-2\",\n  \"state\": \"success\",\n  \"creditsConsumed\": 8,\n  \"files\": [\"kie-media/nano-banana-2-c0ffee12.png\"]\n}",
    },
    security: {
      h: "Security notes",
      items: [
        "The CLI talks only to `api.kie.ai`, `kieai.redpandaai.co` (KIE's upload host) and the result URLs KIE returns.",
        "It never sends a `callBackUrl`; `--set callBackUrl=…` and `--input {\"callBackUrl\":…}` are rejected.",
        "Results are always downloaded — KIE URLs expire in ~24 h — and the CLI returns paths, not links.",
        "Uploads via `kie upload` land in KIE's temporary storage and are deleted after ~3 days.",
        "Report vulnerabilities privately through GitHub Security Advisories (see SECURITY.md).",
      ],
    },
    faq: { h: "FAQ" },
  },
};

const es: DocsCopy = {
  meta: {
    title: "kie docs — comandos, flags, guardia de gasto, skill de agente",
    description: "Referencia de la CLI kie: instalación, almacenamiento de la key, todos los comandos y flags, catálogo de modelos, guardia de gasto y códigos de salida, configuración y el skill kie-media para Claude Code, Codex, Cursor y Gemini CLI.",
  },
  title: "Documentación",
  lead: "Todo lo que hace la CLI, en una página. JSON en stdout al hacer pipe, tablas en la terminal, códigos de salida para bifurcar.",
  toc: "En esta página",
  backHome: "← kiecli.com",
  sections: {
    install: {
      h: "Instalación",
      p: "Node ≥ 20. El paquete tiene cero dependencias en runtime y se publica desde GitHub Actions con provenance de npm.",
      code: "npm i -g @uxdata-co/kie\nkie version\nnpm audit signatures   # opcional: verifica que el tarball salió del repo",
      note: "Desde el código: clona julio-daza/kie-cli y luego `cd kie && npm install && npm run build && npm link`.",
    },
    key: {
      h: "API key",
      p: "Crea una key dedicada para agentes en kie.ai/api-key y ponle ahí topes por hora/día más una lista blanca de IPs — KIE los aplica aunque alguien se salte esta CLI. KIE es prepago: mantén un saldo moderado.",
      steps: ["`kie key set` — pega la key, la entrada está oculta.", "`kie key check` — origen, key enmascarada, validez, saldo.", "`kie key delete` — la elimina del almacén."],
      code: "kie key set\nkie key check",
      keyOrder: "Orden de resolución: `KIE_API_KEY` solo con `KIE_ALLOW_ENV_KEY=1` → el llavero del sistema (Keychain de macOS, servicio `kie-cli` · DPAPI de Windows, ámbito de usuario · Secret Service de Linux vía `secret-tool`) → `~/.config/kie/key` (0600). `KIE_DISABLE_KEYCHAIN=1` fuerza el archivo. Las herramientas del sistema se invocan por ruta absoluta y el secreto nunca va en una línea de comandos. La key nunca aparece en stdout, stderr, el ledger ni la config.",
    },
    commands: { h: "Comandos", p: "Los comandos de generación esperan la tarea, descargan el resultado y cierran el ledger, salvo que pases `--no-wait`." },
    flags: { h: "Flags de generación", p: "El catálogo traduce los flags genéricos a los campos de entrada de cada modelo; `--set` pasa cualquier campo crudo." },
    catalog: {
      h: "Catálogo de modelos",
      p: "Alias que escribes → ids de modelo en KIE. Solo `nano-banana-2` tiene estimación de créditos verificada; el resto exige `--max-credits`.",
      escape: "Cualquier modelo del Market de KIE que no esté en el catálogo:",
      escapeCode: "kie run <vendor>/<modelo> --input '{\"prompt\":\"…\"}' --max-credits 30 --dry-run\nkie run <vendor>/<modelo> --input '{\"prompt\":\"…\"}' --max-credits 30",
    },
    guard: {
      h: "Guardia de gasto y códigos de salida",
      p: "Se evalúa antes de que cualquier request salga de la máquina. Si bloquea, el código de salida es 3 y no se envió nada.",
      checks: [
        "Tope por tarea — los modelos con estimación verificada se comparan con `maxCreditsPerTask`; el resto necesita un `--max-credits <n>` explícito.",
        "Presupuesto diario — `~/.config/kie/ledger.jsonl` registra cada tarea; al completarse se escribe el `creditsConsumed` real. Las pendientes cuentan por su tope.",
        "Saldo — la estimación (o el tope) debe caber en los créditos restantes de la cuenta.",
      ],
      exitH: "Códigos de salida",
      exit: [["0", "éxito"], ["1", "la tarea falló del lado de KIE (no se cobra)"], ["2", "error de uso"], ["3", "bloqueado por la guardia de gasto — no se envió nada"], ["4", "tiempo agotado — la tarea sigue corriendo; `kie wait <taskId>`"], ["5", "error de API / autenticación"]],
    },
    config: {
      h: "Configuración",
      p: "`~/.config/kie/config.json` (o `$KIE_CONFIG_DIR`). Se lee con `kie config` y se cambia con `kie config set <clave> <valor>`.",
      rows: [
        ["dailyBudget", "200", "Créditos máximos por día UTC entre todas las ejecuciones (≈ US$1 a $0.005/crédito)"],
        ["maxCreditsPerTask", "50", "Tope por tarea para modelos con estimación conocida"],
        ["outDir", "./kie-media", "Dónde se descargan los resultados"],
        ["pollSeconds", "5", "Intervalo de consulta mientras espera"],
        ["waitTimeoutSeconds", "900", "Deja de esperar tras esto; la tarea sigue en KIE"],
      ],
      code: "kie config\nkie config set dailyBudget 300",
    },
    skill: {
      h: "Skill de agente (kie-media)",
      p: "El paquete incluye un skill (spec Agent Skills) que enseña a los agentes de código a usar la CLI: revisar el presupuesto primero, imágenes antes que video, siempre acotar el gasto en video, devolver rutas de archivo y nunca tocar la key. Un comando lo instala para los agentes que uses.",
      code: "kie skill install                  # los cuatro\nkie skill install --agent claude   # uno de: claude | codex | cursor | gemini\nkie skill install --project        # en el repo actual, para el equipo\nkie skill install --force          # sobrescribe una copia vieja",
      agents: [
        { name: "Claude Code", icon: "claude", path: "~/.claude/skills/kie-media", invoke: "/kie-media", note: "CLI, app de escritorio y extensión de IDE. Los skills se detectan al iniciar la sesión." },
        { name: "Codex", icon: "openai", path: "~/.agents/skills/kie-media", invoke: "$kie-media · /skills", note: "CLI, extensión de IDE y app de escritorio." },
        { name: "Cursor", icon: "cursor", path: "~/.cursor/skills/kie-media", invoke: "/ en el chat del Agente", note: "Cursor 2.4+. También lee ~/.agents/skills." },
        { name: "Gemini CLI", icon: "gemini", path: "~/.gemini/skills/kie-media", invoke: "auto (activate_skill) · /skills list", note: "Pide consentimiento la primera vez. También lee ~/.agents/skills." },
      ],
      alt: "Sin la CLI: `npx skills add julio-daza/kie-cli` (skills.sh) instala la misma carpeta para cualquier agente soportado.",
    },
    mcp: {
      h: "Servidor MCP (apps de escritorio)",
      p: "Claude Desktop y la app de Codex ejecutan los shells del agente en un sandbox — sin PATH, sin llavero, sin red hacia api.kie.ai — así que el skill no puede correr ahí. `kie mcp` es un servidor MCP solo de tools por stdio que la app lanza en tu máquina: la key se queda en el llavero, la app solo recibe resultados, y las imágenes generadas vuelven inline para verse en el chat. Reusa el catálogo, la guardia de gasto y el ledger de la CLI, así que el presupuesto diario es compartido.",
      code: "kie mcp install                # Claude Desktop + Codex + Cursor\nkie mcp install --app claude   # uno de: claude | codex | cursor\nkie mcp config                 # imprime el snippet JSON para configurarlo a mano",
      tools: [
        ["kie_credits", "Saldo y gasto de hoy contra el presupuesto diario."],
        ["kie_models", "Modelos curados y los flags que soportan."],
        ["kie_generate_image", "Genera, espera, descarga; devuelve la ruta y la imagen (≤ 1.5 MB) inline."],
        ["kie_generate_video", "Lo mismo para video; `max_credits` es obligatorio."],
        ["kie_task_status · kie_wait_task", "Una consulta / esperar y descargar."],
        ["kie_upload", "Archivo local → URL temporal de KIE para referencias."],
        ["kie_ledger", "Créditos reales consumidos por tarea."],
      ],
      notes: [
        "Solo stdio, a propósito: un servidor de red que sostiene una key de pago es justo lo que este proyecto evita.",
        "La config se escribe con el binario de Node y la ruta del script absolutos, porque las apps GUI no heredan el PATH de tu shell (nvm, volta…).",
        "Configs: macOS `~/Library/Application Support/Claude/claude_desktop_config.json`, `~/.codex/config.toml`, `~/.cursor/mcp.json`. Reinicia la app después de instalar.",
        "Claude Code también puede usarlo: `claude mcp add kie -- <node> <ruta-a-kie>/dist/src/index.js mcp` (ahí normalmente basta con el skill).",
      ],
    },
    output: {
      h: "Contrato de salida",
      p: "Si stdout es una terminal ves tablas, paneles y un spinner en vivo. Con pipe, o con `--json`, stdout es estrictamente JSON y los mensajes van a stderr — eso es lo que deben usar los agentes. `--pretty` fuerza la vista humana; `--no-color` o `NO_COLOR` quita el ANSI.",
      code: "kie image nano-banana-2 --prompt \"…\" --json\n{\n  \"taskId\": \"task_…\",\n  \"model\": \"nano-banana-2\",\n  \"state\": \"success\",\n  \"creditsConsumed\": 8,\n  \"files\": [\"kie-media/nano-banana-2-c0ffee12.png\"]\n}",
    },
    security: {
      h: "Notas de seguridad",
      items: [
        "La CLI solo habla con `api.kie.ai`, `kieai.redpandaai.co` (host de subida de KIE) y las URLs de resultado que KIE devuelve.",
        "Nunca envía `callBackUrl`; `--set callBackUrl=…` y `--input {\"callBackUrl\":…}` se rechazan.",
        "Los resultados siempre se descargan — las URLs de KIE expiran en ~24 h — y la CLI devuelve rutas, no enlaces.",
        "Las subidas con `kie upload` van al almacenamiento temporal de KIE y se borran a los ~3 días.",
        "Reporta vulnerabilidades en privado por GitHub Security Advisories (ver SECURITY.md).",
      ],
    },
    faq: { h: "Preguntas frecuentes" },
  },
};

export const docs: Record<Lang, DocsCopy> = { en, es };
