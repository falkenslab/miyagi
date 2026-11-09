import React from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const INSTALLER = "https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-setup.exe";

// The button that downloads the Windows installer, always the latest release's.
//   <DownloadWindows />
export default function DownloadWindows() {
  return (
    <p className={styles.box}>
      <a className={`button button--primary button--lg ${styles.button}`} href={INSTALLER}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
        </svg>
        {translate({ id: "download.windows", message: "Descargar para Windows", description: "The button that downloads the Windows installer" })}
      </a>
      <span className={styles.note}>
        {translate({ id: "download.windows.note", message: "miyagi-setup.exe · 64 bits · unos 225 MB", description: "What the Windows installer is, next to its download button" })}
      </span>
    </p>
  );
}
