import React, { useEffect, useState } from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const LATEST = "https://github.com/falkenslab/miyagi/releases/latest/download";
export const RELEASES = "https://github.com/falkenslab/miyagi/releases";

// Every installer of the desktop app, always the latest release's (#116).
const FILES = {
  windows: `${LATEST}/miyagi-setup.exe`,
  macArm: `${LATEST}/miyagi-arm64.dmg`,
  macIntel: `${LATEST}/miyagi-x64.dmg`,
  appImage: `${LATEST}/miyagi.AppImage`,
  deb: `${LATEST}/miyagi.deb`,
};

const label = {
  windows: () => translate({ id: "download.windows", message: "Descargar para Windows", description: "The button that downloads the Windows installer" }),
  mac: () => translate({ id: "download.mac", message: "Descargar para Mac", description: "The button that downloads the Mac app (Apple Silicon)" }),
  linux: () => translate({ id: "download.linux", message: "Descargar para Linux", description: "The button that downloads the Linux app (AppImage)" }),
};

/** The visitor's system, from the browser; Windows until the page knows (and on the server). */
function detect() {
  const platform = (navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || "").toLowerCase();
  if (platform.includes("mac")) return "mac";
  if (platform.includes("linux") && !/android/i.test(navigator.userAgent)) return "linux";
  return "windows";
}

/** The download for the visitor's system: its button's address and label. */
export function useDownload() {
  const [system, setSystem] = useState("windows");
  useEffect(() => setSystem(detect()), []);
  const href = system === "mac" ? FILES.macArm : system === "linux" ? FILES.appImage : FILES.windows;
  return { system, href, label: label[system]() };
}

/** Every installer as a line of links, for under a download button. */
export function AllDownloads({ className }) {
  return (
    <span className={className}>
      <a href={FILES.windows}>Windows</a>
      {" · "}
      <a href={FILES.macArm}>{translate({ id: "download.macArm", message: "Mac (Apple Silicon)", description: "Link to the Mac app for Apple Silicon" })}</a>
      {" · "}
      <a href={FILES.macIntel}>{translate({ id: "download.macIntel", message: "Mac (Intel)", description: "Link to the Mac app for Intel Macs" })}</a>
      {" · "}
      <a href={FILES.appImage}>Linux (AppImage)</a>
      {" · "}
      <a href={FILES.deb}>Linux (.deb)</a>
      {" · "}
      <a href={RELEASES}>{translate({ id: "download.releases", message: "novedades y versiones anteriores", description: "The link to every release and its notes, next to the download button" })}</a>
    </span>
  );
}

// The button that downloads the desktop app for the visitor's system, and the other systems' below it.
//   <DownloadApp />
export default function DownloadApp() {
  const { href, label: text } = useDownload();
  return (
    <div className={styles.box}>
      <a className={`button button--primary button--lg ${styles.button}`} href={href}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
        </svg>
        {text}
      </a>
      <AllDownloads className={styles.note} />
    </div>
  );
}
