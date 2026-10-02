// The logo as inline SVG, so its colours follow the site's theme (--logo-* in custom.css)
// instead of the system's, as the static/img/miyagi.svg file does.
import React from "react";

const rows = [
  [44.8, [[54, "hair", "."], [78, "hair", "-"], [102, "hair", "-"], [126, "hair", "-"], [150, "hair", "-"], [174, "hair", "-"], [198, "hair", "."]]],
  [90.8, [[6, "band", "~"], [30, "band", "="], [54, "band", "["], [78, "band", "="], [102, "band", "="], [126, "sun", "o"], [150, "band", "="], [174, "band", "="], [198, "band", "]"]]],
  [136.8, [[54, "skin", "|"], [102, "skin", "="], [150, "skin", "="], [198, "skin", "|"]]],
  [182.8, [[54, "beard", "|"], [78, "beard", "/"], [102, "beard", "~"], [126, "beard", "~"], [150, "beard", "~"], [174, "beard", "\\"], [198, "beard", "|"]]],
  [228.8, [[78, "beard", "\\"], [102, "beard", "_"], [126, "beard", "Y"], [150, "beard", "_"], [174, "beard", "/"]]],
];

export default function Logo({ className, width = 84, height = 90 }) {
  return (
    <svg className={className} viewBox="0 0 228 244" width={width} height={height} aria-hidden="true" focusable="false">
      <g fontFamily="ui-monospace, 'Cascadia Mono', Consolas, Menlo, 'DejaVu Sans Mono', monospace" fontSize="40" fontWeight="600">
        {rows.map(([y, cells]) => (
          <text key={y} y={y}>
            {cells.map(([x, part, ch]) => (
              <tspan key={x} x={x} style={{ fill: `var(--logo-${part})` }}>{ch}</tspan>
            ))}
          </text>
        ))}
      </g>
    </svg>
  );
}
