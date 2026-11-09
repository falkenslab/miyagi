// A real screenshot in a window frame: kind "desktop" (the app's window), "web" (miyagi's page in
// a browser, with its address), "moodle" (the browser) or "terminal" (the CLI: the image is framed
// already, as a macOS window, so it goes bare). The image opens at full size on click, for phones.
import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Shot({ src, alt, title, kind = "terminal", children, width, height }) {
  const url = useBaseUrl(src);
  const browser = kind === "moodle" || kind === "web";
  const fallback = { desktop: "miyagi", web: "127.0.0.1 · miyagi", moodle: "Moodle · Introducción a SQL" }[kind] ?? "miyagi — Introducción a SQL";
  if (kind === "terminal") {
    return (
      <figure className="shot shot-bare">
        <a href={url}>
          <img src={url} alt={alt} loading="lazy" decoding="async" fetchpriority="low" width={width} height={height} />
        </a>
        {children ? <figcaption>{children}</figcaption> : null}
      </figure>
    );
  }
  return (
    <figure className="shot">
      <div className="shot-window">
        <div className={`shot-bar${browser ? " browser" : ""}${kind === "desktop" ? " desktop" : ""}`} aria-hidden="true">
          <span className="shot-dots"><i /><i /><i /></span>
          <span className={`shot-title${kind === "web" ? " address" : ""}`}><span>{title ?? fallback}</span></span>
        </div>
        <a href={url}>
          <img src={url} alt={alt} loading="lazy" decoding="async" fetchpriority="low" width={width} height={height} />
        </a>
      </div>
      {children ? <figcaption>{children}</figcaption> : null}
    </figure>
  );
}
