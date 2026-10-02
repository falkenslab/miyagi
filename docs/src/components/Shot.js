// A real screenshot in a window frame: kind "terminal" (miyagi's chat) or "moodle" (the
// browser). The image opens at full size on click, for phones.
import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Shot({ src, alt, title, kind = "terminal", children, width, height }) {
  const url = useBaseUrl(src);
  return (
    <figure className="shot">
      <div className="shot-window">
        <div className={`shot-bar${kind === "moodle" ? " browser" : ""}`} aria-hidden="true">
          <span className="shot-dots"><i /><i /><i /></span>
          <span className="shot-title">{title ?? (kind === "moodle" ? "Moodle · Introducción a SQL" : "miyagi — Introducción a SQL")}</span>
        </div>
        <a href={url}>
          <img src={url} alt={alt} loading="lazy" decoding="async" fetchpriority="low" width={width} height={height} />
        </a>
      </div>
      {children ? <figcaption>{children}</figcaption> : null}
    </figure>
  );
}
