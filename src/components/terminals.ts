/**
 * Pre-rendered terminal transcripts (HTML strings) so line breaks survive Astro's
 * whitespace handling. Classes are styled in Terminal.astro.
 *
 * Hard rule: no visible line may exceed 50 columns. The terminals live in narrow
 * grid columns, and anything wider produces a horizontal scrollbar that hides
 * content. The box borders are hand-aligned to exactly 50 columns.
 */
const L = (cls: string, s: string) => `<span class="${cls}">${s}</span>`;

const LOGO = [
  ["g1", "            ╭─●─╮           "],
  ["g1", "           ╱     ╲          "],
  ["g2", "          ╱  ╱╲   ╲         "],
  ["g2", "         ╱  ╱  ╲ ╲ ╲        "],
  ["g3", "        ╱  ╱────╲ ╲ ╲       "],
  ["g3", "       ╱  ╱      ╲   ╲      "],
  ["g4", "  ●───╯  ╱        ╲ ╲ ╰───● "],
] as const;

export const heroTerminal = [
  "",
  ...LOGO.map(([c, line]) => L(c, line)),
  "",
  `${L("w", "kie")} ${L("dim", "v0.6.0")} ${L("dim", "·")} ${L("b", "media generation for AI agents")}`,
  L("dim", "images · video · zero deps · spend-guarded"),
  "",
  `${L("p", "$")} kie credits`,
  `${L("dim", "╭─ ")}${L("b", "▲ kie")}  credits ${L("dim", "───────────────────────────────╮")}`,
  `${L("dim", "│")}  ${L("dim", "balance")}          ${L("w", "980 credits")}  ${L("dim", "≈ US$4.90")}       ${L("dim", "│")}`,
  `${L("dim", "│")}  ${L("dim", "today")}            16 / 200  ${L("b", "█")}${L("dim", "███████████")} 8%    ${L("dim", "│")}`,
  `${L("dim", "│")}  ${L("dim", "remaining today")}  184 credits                  ${L("dim", "│")}`,
  L("dim", "╰────────────────────────────────────────────────╯"),
  "",
  `${L("p", "$")} kie image nano-banana-2 \\`,
  `    --prompt "isometric coffee shop" --aspect 16:9`,
  `${L("b", "⠹")} nano-banana-2  generating 40%  task_c0ffee12 ${L("dim", "14s")}`,
  `${L("dim", "╭─ ")}${L("b", "▲ kie")}  generation complete ${L("dim", "───────────────────╮")}`,
  `${L("dim", "│")}  ${L("dim", "state")}    ${L("ok", "success")}                              ${L("dim", "│")}`,
  `${L("dim", "│")}  ${L("dim", "credits")}  ${L("w", "8")}                                    ${L("dim", "│")}`,
  `${L("dim", "│")}  ${L("dim", "files")}    ${L("b", "kie-media/nano-banana-2-c0ffee12.png")} ${L("dim", "│")}`,
  L("dim", "╰────────────────────────────────────────────────╯"),
  "",
].join("\n");

export const guardTerminal = [
  `${L("p", "$")} kie video kling-3.0 --prompt "drone shot"`,
  `${L("err", "✖ Spend guard blocked the request:")} this model`,
  `  has no known credit estimate. Re-run with`,
  `  ${L("w", "--max-credits &lt;n&gt;")} to state the most you`,
  `  accept to spend on this task.`,
  L("dim", "Today: 16 credits used, 184 remaining."),
  `${L("p", "$")} echo $?`,
  L("warn", "3"),
].join("\n");
