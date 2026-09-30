import { setTheme } from "@falkenslab/agent-kit";

/**
 * The hinomaru palette: the sensei's face in the chat header (`LOGO` below) and
 * docs/assets/miyagi.svg, and miyagi's colours in the terminal. The brand's red is
 * `SUN` (#bc002d); on a dark terminal it needs a lighter shade to read.
 */
export const PALETTE = {
  sumi: "#18181b",
  washi: "#f3f3f0",
  sun: "#bc002d",
  sunLight: "#e0303f",
  sunSoft: "#e0564a",
  skin: "#e2b48a",
  hair: "#b9bcc2",
  beard: "#cfd1d6",
  stroke: "#d9d4c7",
} as const;

/** `text` in a 24-bit colour, or as is when the terminal has none (NO_COLOR, not a TTY). */
function paint(hex: string): (text: string) => string {
  const on = !process.env.NO_COLOR && (process.env.FORCE_COLOR !== undefined || (process.stdout.isTTY && process.stdout.hasColors?.() !== false));
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (text) => (on ? `\x1b[38;2;${r};${g};${b}m${text}\x1b[39m` : text);
}

const hair = paint(PALETTE.hair);
const band = paint(PALETTE.washi);
const sun = paint(PALETTE.sunLight);
const skin = paint(PALETTE.skin);
const beard = paint(PALETTE.beard);

/**
 * The chat header's logo: the sensei squinting, with the headband and its sun, the moustache
 * and the goatee — 5 lines by 9 columns, as agent-kit's header expects.
 */
export const LOGO = [
  hair("  .-----."),
  `${band("~=[==")}${sun("o")}${band("==]")}`,
  skin("  | = = |"),
  beard("  |/~~~\\|"),
  beard("   \\_Y_/"),
];

/**
 * miyagi's look on top of agent-kit's default theme, set once at the CLI's start so the
 * chat, the one-shot view and the wizard share it: the sun's red for the spinner, the
 * selected option and the panels' border; tool bullets in the light stroke grey. Replies, the
 * human's lines and the dimmed tool lines keep the kit's colours.
 */
export function applyTeacherTheme(): void {
  setTheme({ working: PALETTE.sunLight, selection: PALETTE.sunSoft, accent: PALETTE.sun, toolBullet: PALETTE.stroke });
}
