// miyagi's face in ASCII, as the terminal draws it: coloured by the theme's variables.
const ROWS: { y: number; fill: string; cells: [number, string, string?][] }[] = [
  { y: 44.8, fill: "var(--hair)", cells: [[54, "."], [78, "-"], [102, "-"], [126, "-"], [150, "-"], [174, "-"], [198, "."]] },
  { y: 90.8, fill: "var(--band)", cells: [[6, "~"], [30, "="], [54, "["], [78, "="], [102, "="], [126, "o", "var(--sun)"], [150, "="], [174, "="], [198, "]"]] },
  { y: 136.8, fill: "var(--skin)", cells: [[54, "|"], [102, "="], [150, "="], [198, "|"]] },
  { y: 182.8, fill: "var(--beard)", cells: [[54, "|"], [78, "/"], [102, "~"], [126, "~"], [150, "~"], [174, "\\"], [198, "|"]] },
  { y: 228.8, fill: "var(--beard)", cells: [[78, "\\"], [102, "_"], [126, "Y"], [150, "_"], [174, "/"]] },
];

export function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg viewBox="0 0 228 244" width={size} height={(size * 244) / 228} aria-hidden="true" className="logo">
      <g fontFamily="ui-monospace, 'Cascadia Mono', Consolas, monospace" fontSize="40" fontWeight="600">
        {ROWS.map((row) => (
          <text key={row.y} y={row.y} fill={row.fill}>
            {row.cells.map(([x, char, fill]) => (
              <tspan key={x} x={x} fill={fill}>
                {char}
              </tspan>
            ))}
          </text>
        ))}
      </g>
    </svg>
  );
}
