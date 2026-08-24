export type Lang = "en" | "es";

export const LANGS: Record<Lang, string> = { en: "English", es: "Español" };
export const REPO = "https://github.com/julio-daza/kie-cli";
export const NPM = "https://www.npmjs.com/package/@uxdata-co/kie";
export const AFFILIATE = "https://kie.ai?ref=abddfed9f3893359a999113356686aaa";

const en = {
  meta: {
    title: "kie — KIE.ai media generation CLI for agents",
    description:
      "Generate images and video on KIE.ai from the terminal or from an AI agent. Zero dependencies, key in the OS keychain, hard spend guards.",
  },
  nav: { features: "Why", install: "Install", tutorials: "Tutorials", guard: "Spend guard", docs: "Docs", github: "GitHub", npm: "npm", lang: "ES" },
  hero: {
    eyebrow: "Open source · MIT · 0 runtime dependencies",
    headline: "Generate media. Keep your keys.",
    sub: "Your AI agent creates images and video on KIE.ai — without ever seeing the API key, and never spending more than you allow.",
    ctaSecondary: "Use it in chat with AI",
    copy: "Copy",
    copied: "Copied",
    terminalTitle: "kie help",
  },
  audience: {
    label: "Are you an agent or a human?",
    agent: "I'm an Agent",
    human: "I'm a Human",
    copy: "Copy",
    copied: "Copied",
    agentHint: "Send this prompt to your agent to generate media with kie",
    agentSub: "A complete operating guide: install, spend limits, models, exit codes.",
    humanHint: "Install the CLI — Node \u2265 20, zero runtime dependencies",
    humanSub: "Then `kie key set` to store your key, and `kie skill install` to teach your agent.",
  },
  agents: {
    label: "Works with",
    items: [
      { name: "Codex", icon: "openai", hint: "$kie-media" },
      { name: "Claude Code", icon: "claude", hint: "/kie-media" },
      { name: "Cursor", icon: "cursor", hint: "/ in Agent chat" },
      { name: "Gemini CLI", icon: "gemini", hint: "auto-activated" },
    ],
  },
  affiliate: {
    eyebrow: "Support this project",
    title: "Same models. Up to 84% cheaper.",
    lead: "kie runs on KIE.ai — the same Veo, Nano Banana, GPT Image, Kling and Seedance models the official APIs serve, at a fraction of the price. Prepaid wallet, no hidden fees, and failed generations are never billed.",
    stats: [
      { v: "\u221286%", k: "GPT Image 2 vs OpenAI" },
      { v: "\u221261%", k: "Veo 3.1 vs Google" },
      { v: "\u221250%", k: "Nano Banana 2 vs Google" },
      { v: "$0", k: "for failed tasks" },
    ],
    cta: "Sign up on Kie",
    note: "By signing up with this affiliate link you support the maintenance and updates of this code.",
  },
  why: {
    eyebrow: "Why kie",
    title: "Your key is money.",
    lead: "Media APIs are the most expensive credentials to leak. Most wrappers read the key from an env var, pull in hundreds of packages and ship a default webhook.",
    cards: [
      { t: "Key in the OS keystore", d: "macOS Keychain, Windows DPAPI or Linux Secret Service — a 0600 file only as fallback. Env vars need an explicit opt-in. Every byte of output goes through a redactor." },
      { t: "Hard spend cap", d: "Per-task cap, daily budget and balance check — all before the request leaves your machine." },
      { t: "No third parties", d: "Talks only to KIE's own hosts. No callbacks, no telemetry, no proxies." },
      { t: "Agent-native", d: "JSON on stdout, exit codes you can branch on, and always file paths — never URLs that expire." },
    ],
  },
  install: {
    eyebrow: "Install",
    title: "Two minutes.",
    steps: [
      { t: "Install", d: "Node ≥ 20. Published with npm provenance.", code: "npm i -g @uxdata-co/kie" },
      { t: "Store the key", d: "Input is hidden. It never appears in output again.", code: "kie key set" },
      { t: "Install the skill", d: "Claude Code, Codex, Cursor and Gemini CLI.", code: "kie skill install" },
    ],
  },
  tutorials: {
    eyebrow: "Tutorials",
    title: "Just ask.",
    lead: "Your coding agent makes the media, you keep the key.",
    tabs: {
      claude: {
        label: "Claude Code",
        steps: [
          "New session — skills load from `~/.claude/skills/`.",
          "Ask in plain language, or invoke `/kie-media`.",
        ],
        prompt: "Generate a 16:9 hero image of an isometric coffee shop with warm light, for the landing page.",
        reply: "Done — 8 credits. Saved to assets/hero-coffee.png (1920×1080). Want a night version?",
        cmds: ["kie credits --json", "kie image nano-banana-2 --prompt \"isometric coffee shop, warm light\" --aspect 16:9 --out ./assets --name hero-coffee --json"],
      },
      codex: {
        label: "Codex",
        steps: [
          "New session — skills load from `~/.agents/skills/`.",
          "Ask naturally, or call `$kie-media`. For video, say the cap out loud.",
        ],
        prompt: "$kie-media make a 5-second clip of the barista sliding a cup across the counter, soft dolly-in. Cap it at 80 credits.",
        reply: "Kling 3.0, 5 s with sound — 64 credits. Saved to assets/barista-slide.mp4. 120 credits left today.",
        cmds: ["kie upload ./assets/hero-coffee.png --json", "kie video kling-3.0 --prompt \"barista slides a cup across the counter, soft dolly-in\" --image <url> --duration 5 --sound --max-credits 80 --json"],
      },
      cursor: {
        label: "Cursor",
        steps: [
          "Cursor 2.4+ — skills load from `~/.cursor/skills/`.",
          "Type `/` and pick kie-media, or just ask.",
        ],
        prompt: "/kie-media I need three 1:1 product shots of a ceramic mug on linen, soft daylight, for the shop grid.",
        reply: "Three images, 8 credits each — 24 total. Saved to public/shop/mug-1.png, mug-2.png, mug-3.png.",
        cmds: ["kie credits --json", "kie image nano-banana-2 --prompt \"ceramic mug on linen, soft daylight\" --aspect 1:1 --out ./public/shop --name mug-1 --json"],
      },
      gemini: {
        label: "Gemini CLI",
        steps: [
          "Start gemini — `/skills list` shows kie-media.",
          "Ask naturally; it calls `activate_skill` and asks consent once.",
        ],
        prompt: "Make a 9:16 teaser image of a night market street with neon signs for our Instagram story.",
        reply: "nano-banana-2, 2K — 12 credits. Saved to assets/stories/night-market.png. 164 credits left today.",
        cmds: ["kie credits --json", "kie image nano-banana-2 --prompt \"night market street, neon signs\" --aspect 9:16 --resolution 2K --out ./assets/stories --name night-market --json"],
      },
      desktop: {
        label: "Claude Desktop · Codex app",
        steps: [
          "Desktop apps run the agent's shells in a sandbox: no PATH, no keystore, no network to KIE. The skill can't run there — so use the MCP server instead.",
          "Run `kie mcp install`. It registers `kie mcp` (stdio) in Claude Desktop, the Codex app and Cursor with the absolute Node path. Restart the app.",
          "Ask normally. The app spawns `kie` on your machine; the key never leaves the keystore and the generated image shows up right in the chat.",
        ],
        prompt: "Generate a 16:9 hero image of an isometric coffee shop with warm light, then a night version.",
        reply: "Here are both (8 credits each). Saved to kie-media/coffee-day.png and kie-media/coffee-night.png — 184 credits left today.",
        cmds: ["kie mcp install --app claude", "# the app calls: kie_credits → kie_generate_image(model: nano-banana-2, aspect: 16:9)"],
      },
    },
    rules: {
      title: "What the agent won't do",
      items: [
        "Jump to video — images first, then video with `--max-credits`.",
        "Raise its own cap after a block (exit 3). It reports the reason.",
        "Ask for, print or set the API key.",
        "Hand you a KIE URL — you get a file path.",
      ],
      budget: "kie config set dailyBudget 300",
    },
  },
  guard: {
    eyebrow: "Spend guard",
    title: "Blocked means unsent.",
    lead: "Three independent checks run before any request leaves the machine. If one fails, you get exit code 3 and nothing was sent.",
    checks: [
      { n: "01", t: "Per-task cap", d: "Models without a verified price require an explicit `--max-credits` — the agent has to say out loud what it accepts to spend." },
      { n: "02", t: "Daily budget", d: "A local ledger records every task and writes back the real credits spent. Pending tasks count at their cap." },
      { n: "03", t: "Balance", d: "If the estimate exceeds what's left on the account, the request never leaves." },
    ],
  },
  docsCta: {
    eyebrow: "Documentation",
    title: "Every command, one page.",
    teaser: "Commands and flags, the model catalog, spend guard and exit codes, configuration, the agent skill and security notes.",
    cta: "Read the documentation",
  },
  docs: {
    commands: [
      ["kie key set|check|delete", "Store the API key (Keychain · DPAPI · Secret Service · 0600 file), verify it, remove it."],
      ["kie credits", "Balance plus today's spend against the daily budget."],
      ["kie models [--kind image|video]", "Curated catalog with the flags each model supports."],
      ["kie image <model> --prompt … [opts]", "Generate an image, wait, download."],
      ["kie video <model> --prompt … [opts]", "Generate a video, wait, download."],
      ["kie run <model-id> --input '{…}' --max-credits N", "Escape hatch for any KIE Market model."],
      ["kie status <taskId>", "One poll, no download."],
      ["kie wait <taskId> [--out dir]", "Poll until done, download, settle the ledger."],
      ["kie upload <file>", "Local file → temporary URL for --ref / --image (KIE deletes it after ~3 days)."],
      ["kie ledger [--limit 20]", "Local spend log with real creditsConsumed."],
      ["kie config set <key> <value>", "dailyBudget · maxCreditsPerTask · outDir · pollSeconds · waitTimeoutSeconds"],
      ["kie skill install [--agent claude|codex|cursor|gemini|all]", "Install the kie-media agent skill (--project for the current repo)."],
      ["kie mcp · kie mcp install [--app claude|codex|cursor|all]", "MCP server on stdio for desktop apps; install registers it in Claude Desktop / Codex / Cursor."],
    ],
    flags: [
      ["--prompt <text>", "The prompt."],
      ["--ref <url>", "Reference image, repeatable (edit / style / multimodal reference)."],
      ["--image <url> / --end-image <url>", "First and last frame for video."],
      ["--aspect, --resolution, --duration", "16:9 · 1K|2K|4K|720p · seconds"],
      ["--sound, --fast, --format", "Native audio · cheaper variant · png|jpg"],
      ["--set key=value", "Raw model field, repeatable. callBackUrl is rejected."],
      ["--max-credits <n>", "Accept spending up to n credits on this task."],
      ["--dry-run", "Print the exact request, send nothing."],
      ["--out <dir>, --name <base>, --no-wait", "Where files go · base filename · submit and return."],
      ["--json, --pretty, --no-color, --quiet", "Output control. JSON is automatic when piped."],
    ],
    catalog: [
      ["nano-banana-2", "image", "Google Nano Banana 2 — generate + edit with up to 14 refs. Est. 1K=8 · 2K=12 · 4K=18 credits."],
      ["seedream-v4", "image", "ByteDance Seedream V4 — text-to-image, switches to edit with --ref."],
      ["kling-3.0", "video", "Kling 3.0 — 3–15 s, native audio, --set mode=pro."],
      ["seedance-2.5", "video", "ByteDance Seedance 2.5 — frames or multimodal refs, 4–30 s."],
      ["minimax-h3", "video", "MiniMax H3 — sub-model chosen from your flags (text / image / reference)."],
      ["veo3", "video", "Google Veo 3 — own endpoint, --fast for veo3_fast."],
    ],
  },
  faq: {
    eyebrow: "FAQ",
    items: [
      { q: "Does it work on Linux or Windows?", a: "Yes. The key goes to Windows DPAPI (user scope) or the Linux Secret Service (secret-tool); without either it falls back to ~/.config/kie/key with 0600 permissions. Everything else is identical." },
      { q: "How is the npm package built?", a: "Every release is published by GitHub Actions from a git tag, with npm provenance: the tarball is cryptographically linked to the commit that produced it. Zero runtime dependencies, so what you audit is what runs." },
      { q: "What if a model isn't in the catalog?", a: "kie run <model-id> --input '{…}' --max-credits N sends any KIE Market model. Check the schema on docs.kie.ai first, or use --dry-run." },
      { q: "Can I use it without an agent?", a: "Of course. In a terminal it renders tables, panels and a live spinner; pipe it and you get JSON." },
    ],
  },
  cta: {
    title: "Cheap, safe image AI.",
    button: "View on GitHub",
    sub: "MIT licensed. Read the source before you trust it with a key — that's the point.",
  },
  footer: { builtPre: "Built by", name: "Julio Daza", license: "MIT License" },
};

const es: typeof en = {
  meta: {
    title: "kie — CLI de generación de medios en KIE.ai para agentes",
    description:
      "Genera imágenes y video en KIE.ai desde la terminal o desde un agente de IA. Cero dependencias, key en el llavero del sistema, límites de gasto estrictos.",
  },
  nav: { features: "Por qué", install: "Instalar", tutorials: "Tutoriales", guard: "Guardia de gasto", docs: "Docs", github: "GitHub", npm: "npm", lang: "EN" },
  hero: {
    eyebrow: "Open source · MIT · 0 dependencias en runtime",
    headline: "Genera medios. Conserva tus llaves.",
    sub: "Tu agente de IA crea imágenes y video en KIE.ai — sin ver nunca la API key, y sin gastar más de lo que autorizas.",
    ctaSecondary: "Usar en chat con IA",
    copy: "Copiar",
    copied: "Copiado",
    terminalTitle: "kie help",
  },
  audience: {
    label: "\u00bfEres un agente o una persona?",
    agent: "Soy un agente",
    human: "Soy humano",
    copy: "Copiar",
    copied: "Copiado",
    agentHint: "Env\u00eda este prompt a tu agente para generar medios con kie",
    agentSub: "Una gu\u00eda completa: instalaci\u00f3n, l\u00edmites de gasto, modelos y c\u00f3digos de salida.",
    humanHint: "Instala la CLI \u2014 Node \u2265 20, cero dependencias en runtime",
    humanSub: "Luego `kie key set` para guardar tu key, y `kie skill install` para tu agente.",
  },
  agents: {
    label: "Funciona con",
    items: [
      { name: "Codex", icon: "openai", hint: "$kie-media" },
      { name: "Claude Code", icon: "claude", hint: "/kie-media" },
      { name: "Cursor", icon: "cursor", hint: "/ en el chat del Agente" },
      { name: "Gemini CLI", icon: "gemini", hint: "se activa sola" },
    ],
  },
  affiliate: {
    eyebrow: "Apoya este proyecto",
    title: "Los mismos modelos. Hasta 84% más barato.",
    lead: "kie corre sobre KIE.ai — los mismos modelos Veo, Nano Banana, GPT Image, Kling y Seedance que sirven las APIs oficiales, por una fracción del precio. Billetera prepaga, sin cargos ocultos, y las generaciones fallidas nunca se cobran.",
    stats: [
      { v: "\u221286%", k: "GPT Image 2 vs OpenAI" },
      { v: "\u221261%", k: "Veo 3.1 vs Google" },
      { v: "\u221250%", k: "Nano Banana 2 vs Google" },
      { v: "$0", k: "por tareas fallidas" },
    ],
    cta: "Regístrate en Kie",
    note: "Al registrarte con este link de afiliado apoyas el mantenimiento y actualización de este código.",
  },
  why: {
    eyebrow: "Por qué kie",
    title: "Tu llave es dinero.",
    lead: "Las APIs de medios son las credenciales más caras de perder. La mayoría de wrappers leen la key de una variable de entorno, arrastran cientos de paquetes y traen un webhook por defecto.",
    cards: [
      { t: "Key en el llavero del sistema", d: "Keychain de macOS, DPAPI de Windows o Secret Service de Linux — archivo 0600 solo como respaldo. Las variables de entorno exigen opt-in explícito. Toda la salida pasa por un redactor." },
      { t: "Tope de gasto duro", d: "Tope por tarea, presupuesto diario y chequeo de saldo — todo antes de que el request salga de tu máquina." },
      { t: "Sin terceros", d: "Solo habla con los hosts de KIE. Sin callbacks, sin telemetría, sin proxies." },
      { t: "Nativo para agentes", d: "JSON en stdout, códigos de salida para bifurcar y siempre rutas de archivo — nunca URLs que expiran." },
    ],
  },
  install: {
    eyebrow: "Instalación",
    title: "Dos minutos.",
    steps: [
      { t: "Instala", d: "Node ≥ 20. Publicado con provenance de npm.", code: "npm i -g @uxdata-co/kie" },
      { t: "Guarda la key", d: "La entrada está oculta. No vuelve a aparecer en ninguna salida.", code: "kie key set" },
      { t: "Instala el skill", d: "Claude Code, Codex, Cursor y Gemini CLI.", code: "kie skill install" },
    ],
  },
  tutorials: {
    eyebrow: "Tutoriales",
    title: "Solo pídelo.",
    lead: "Tu agente de código produce los medios, tú conservas la llave.",
    tabs: {
      claude: {
        label: "Claude Code",
        steps: [
          "Sesión nueva — los skills se cargan de `~/.claude/skills/`.",
          "Pide en lenguaje natural, o invoca `/kie-media`.",
        ],
        prompt: "Genera una imagen hero 16:9 de una cafetería isométrica con luz cálida, para la landing.",
        reply: "Listo — 8 créditos. Guardada en assets/hero-coffee.png (1920×1080). ¿Quieres una versión nocturna?",
        cmds: ["kie credits --json", "kie image nano-banana-2 --prompt \"cafetería isométrica, luz cálida\" --aspect 16:9 --out ./assets --name hero-coffee --json"],
      },
      codex: {
        label: "Codex",
        steps: [
          "Sesión nueva — los skills se cargan de `~/.agents/skills/`.",
          "Pide con naturalidad, o invoca `$kie-media`. Para video, di el tope.",
        ],
        prompt: "$kie-media haz un clip de 5 segundos del barista deslizando una taza por la barra, dolly-in suave. Tope de 80 créditos.",
        reply: "Kling 3.0, 5 s con sonido — 64 créditos. Guardado en assets/barista-slide.mp4. Quedan 120 créditos hoy.",
        cmds: ["kie upload ./assets/hero-coffee.png --json", "kie video kling-3.0 --prompt \"el barista desliza una taza por la barra, dolly-in suave\" --image <url> --duration 5 --sound --max-credits 80 --json"],
      },
      cursor: {
        label: "Cursor",
        steps: [
          "Cursor 2.4+ — los skills se cargan de `~/.cursor/skills/`.",
          "Escribe `/` y elige kie-media, o solo pide.",
        ],
        prompt: "/kie-media necesito tres fotos de producto 1:1 de una taza de cerámica sobre lino, luz de día suave, para la grilla de la tienda.",
        reply: "Tres imágenes, 8 créditos cada una — 24 en total. Guardadas en public/shop/mug-1.png, mug-2.png, mug-3.png.",
        cmds: ["kie credits --json", "kie image nano-banana-2 --prompt \"taza de cerámica sobre lino, luz de día suave\" --aspect 1:1 --out ./public/shop --name mug-1 --json"],
      },
      gemini: {
        label: "Gemini CLI",
        steps: [
          "Inicia gemini — `/skills list` muestra kie-media.",
          "Pide con naturalidad; llama a `activate_skill` y pide permiso una vez.",
        ],
        prompt: "Haz una imagen teaser 9:16 de una calle de mercado nocturno con letreros de neón para nuestra historia de Instagram.",
        reply: "nano-banana-2, 2K — 12 créditos. Guardada en assets/stories/night-market.png. Quedan 164 créditos hoy.",
        cmds: ["kie credits --json", "kie image nano-banana-2 --prompt \"calle de mercado nocturno, letreros de neón\" --aspect 9:16 --resolution 2K --out ./assets/stories --name night-market --json"],
      },
      desktop: {
        label: "Claude Desktop · app de Codex",
        steps: [
          "Las apps de escritorio corren los shells del agente en un sandbox: sin PATH, sin llavero, sin red hacia KIE. El skill no puede correr ahí — usa el servidor MCP.",
          "Ejecuta `kie mcp install`. Registra `kie mcp` (stdio) en Claude Desktop, la app de Codex y Cursor con la ruta absoluta de Node. Reinicia la app.",
          "Pide con normalidad. La app lanza `kie` en tu máquina; la key nunca sale del llavero y la imagen generada aparece directamente en el chat.",
        ],
        prompt: "Genera una imagen hero 16:9 de una cafetería isométrica con luz cálida, y luego una versión nocturna.",
        reply: "Aquí están las dos (8 créditos cada una). Guardadas en kie-media/coffee-day.png y kie-media/coffee-night.png — quedan 184 créditos hoy.",
        cmds: ["kie mcp install --app claude", "# la app llama: kie_credits → kie_generate_image(model: nano-banana-2, aspect: 16:9)"],
      },
    },
    rules: {
      title: "Lo que el agente no hará",
      items: [
        "Saltar a video — primero imágenes, luego video con `--max-credits`.",
        "Subirse el tope tras un bloqueo (exit 3). Reporta la razón.",
        "Pedir, mostrar ni configurar la API key.",
        "Darte una URL de KIE — recibes una ruta de archivo.",
      ],
      budget: "kie config set dailyBudget 300",
    },
  },
  guard: {
    eyebrow: "Guardia de gasto",
    title: "Bloqueado es no enviado.",
    lead: "Tres chequeos independientes corren antes de que cualquier request salga de la máquina. Si uno falla, obtienes código de salida 3 y no se envió nada.",
    checks: [
      { n: "01", t: "Tope por tarea", d: "Los modelos sin precio verificado exigen un `--max-credits` explícito — el agente tiene que decir en voz alta cuánto acepta gastar." },
      { n: "02", t: "Presupuesto diario", d: "Un ledger local registra cada tarea y escribe los créditos reales gastados. Las pendientes cuentan por su tope." },
      { n: "03", t: "Saldo", d: "Si la estimación supera lo que queda en la cuenta, el request nunca sale." },
    ],
  },
  docsCta: {
    eyebrow: "Documentación",
    title: "Todos los comandos, una página.",
    teaser: "Comandos y flags, catálogo de modelos, guardia de gasto y códigos de salida, configuración, el skill de agente y notas de seguridad.",
    cta: "Leer la documentación",
  },
  docs: {
    commands: [
      ["kie key set|check|delete", "Guardar la API key (Keychain · DPAPI · Secret Service · archivo 0600), verificarla, eliminarla."],
      ["kie credits", "Saldo más el gasto de hoy contra el presupuesto diario."],
      ["kie models [--kind image|video]", "Catálogo curado con los flags que soporta cada modelo."],
      ["kie image <modelo> --prompt … [opts]", "Generar una imagen, esperar, descargar."],
      ["kie video <modelo> --prompt … [opts]", "Generar un video, esperar, descargar."],
      ["kie run <model-id> --input '{…}' --max-credits N", "Vía de escape para cualquier modelo del Market de KIE."],
      ["kie status <taskId>", "Una consulta, sin descarga."],
      ["kie wait <taskId> [--out dir]", "Consultar hasta terminar, descargar, cerrar el ledger."],
      ["kie upload <archivo>", "Archivo local → URL temporal para --ref / --image (KIE lo borra a los ~3 días)."],
      ["kie ledger [--limit 20]", "Registro local de gasto con creditsConsumed reales."],
      ["kie config set <clave> <valor>", "dailyBudget · maxCreditsPerTask · outDir · pollSeconds · waitTimeoutSeconds"],
      ["kie skill install [--agent claude|codex|cursor|gemini|all]", "Instalar el skill kie-media (--project para el repo actual)."],
      ["kie mcp · kie mcp install [--app claude|codex|cursor|all]", "Servidor MCP por stdio para apps de escritorio; install lo registra en Claude Desktop / Codex / Cursor."],
    ],
    flags: [
      ["--prompt <texto>", "El prompt."],
      ["--ref <url>", "Imagen de referencia, repetible (edición / estilo / referencia multimodal)."],
      ["--image <url> / --end-image <url>", "Primer y último frame para video."],
      ["--aspect, --resolution, --duration", "16:9 · 1K|2K|4K|720p · segundos"],
      ["--sound, --fast, --format", "Audio nativo · variante barata · png|jpg"],
      ["--set clave=valor", "Campo crudo del modelo, repetible. callBackUrl se rechaza."],
      ["--max-credits <n>", "Aceptar gastar hasta n créditos en esta tarea."],
      ["--dry-run", "Imprime el request exacto, no envía nada."],
      ["--out <dir>, --name <base>, --no-wait", "Dónde van los archivos · nombre base · enviar y volver."],
      ["--json, --pretty, --no-color, --quiet", "Control de salida. JSON es automático al hacer pipe."],
    ],
    catalog: [
      ["nano-banana-2", "imagen", "Google Nano Banana 2 — genera + edita con hasta 14 referencias. Est. 1K=8 · 2K=12 · 4K=18 créditos."],
      ["seedream-v4", "imagen", "ByteDance Seedream V4 — texto a imagen, pasa a edición con --ref."],
      ["kling-3.0", "video", "Kling 3.0 — 3–15 s, audio nativo, --set mode=pro."],
      ["seedance-2.5", "video", "ByteDance Seedance 2.5 — frames o referencias multimodales, 4–30 s."],
      ["minimax-h3", "video", "MiniMax H3 — elige el submodelo según tus flags (texto / imagen / referencia)."],
      ["veo3", "video", "Google Veo 3 — endpoint propio, --fast para veo3_fast."],
    ],
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    items: [
      { q: "¿Funciona en Linux o Windows?", a: "Sí. La key va a DPAPI de Windows (ámbito de usuario) o al Secret Service de Linux (secret-tool); sin ninguno de los dos cae a ~/.config/kie/key con permisos 0600. Todo lo demás es idéntico." },
      { q: "¿Cómo se construye el paquete de npm?", a: "Cada release la publica GitHub Actions desde un tag de git, con provenance de npm: el tarball queda vinculado criptográficamente al commit que lo produjo. Cero dependencias en runtime: lo que auditas es lo que corre." },
      { q: "¿Y si un modelo no está en el catálogo?", a: "kie run <model-id> --input '{…}' --max-credits N envía cualquier modelo del Market de KIE. Revisa el schema en docs.kie.ai primero, o usa --dry-run." },
      { q: "¿Puedo usarlo sin un agente?", a: "Claro. En la terminal muestra tablas, paneles y un spinner en vivo; si haces pipe obtienes JSON." },
    ],
  },
  cta: {
    title: "IA de imágenes barata y segura.",
    button: "Ver en GitHub",
    sub: "Licencia MIT. Lee el código antes de confiarle una key — de eso se trata.",
  },
  footer: { builtPre: "Hecho por", name: "Julio Daza", license: "Licencia MIT" },
};

export const ui: Record<Lang, typeof en> = { en, es };

export function t(lang: Lang) {
  return ui[lang];
}

export function localePath(lang: Lang, path = "/"): string {
  return lang === "en" ? path : `/es${path === "/" ? "/" : path}`;
}
