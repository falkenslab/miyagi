import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/** Asks the person for a folder with the system's own dialog: its path, or undefined if they cancel (#79). */
export type FolderPicker = (title: string, start?: string) => Promise<string | undefined>;

// The dialog's title and starting folder go through the environment, never into a command line.
const WINDOWS = [
  "[Console]::OutputEncoding = [Text.Encoding]::UTF8",
  "Add-Type -AssemblyName System.Windows.Forms",
  // An owner on top, so the dialog doesn't open behind the browser.
  "$owner = New-Object System.Windows.Forms.Form -Property @{ TopMost = $true; ShowInTaskbar = $false }",
  "$dialog = New-Object System.Windows.Forms.FolderBrowserDialog",
  "$dialog.Description = $env:MIYAGI_PICK_TITLE",
  "$dialog.ShowNewFolderButton = $true",
  "if ($env:MIYAGI_PICK_START -and (Test-Path -LiteralPath $env:MIYAGI_PICK_START)) { $dialog.SelectedPath = $env:MIYAGI_PICK_START }",
  "if ($dialog.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) { $dialog.SelectedPath }",
].join("; ");
const MAC = 'set p to system attribute "MIYAGI_PICK_TITLE"\nPOSIX path of (choose folder with prompt p)';

/** A program on the PATH, for Linux's dialogs. */
const onPath = (name: string) => (process.env.PATH ?? "").split(path.delimiter).some((dir) => dir && existsSync(path.join(dir, name)));

/** The command that shows this system's folder dialog, if it has one. */
function command(title = "", start?: string): [string, string[]] | undefined {
  if (process.platform === "win32") return ["powershell.exe", ["-NoProfile", "-NonInteractive", "-STA", "-Command", WINDOWS]];
  if (process.platform === "darwin") return ["osascript", ["-e", MAC]];
  if (onPath("zenity")) return ["zenity", ["--file-selection", "--directory", `--title=${title}`, ...(start ? [`--filename=${start}${path.sep}`] : [])]];
  if (onPath("kdialog")) return ["kdialog", ["--getexistingdirectory", start || process.env.HOME || "/", "--title", title]];
  return undefined;
}

/** A folder's path without its last slash (macOS and zenity print one), but a root's ("/", "C:\\"). */
const withoutSlash = (dir: string) => (dir.length > 1 && /[\\/]$/.test(dir) && !/^[A-Za-z]:[\\/]$/.test(dir) ? dir.slice(0, -1) : dir);

/** The system's folder dialog, opened by the host (miyagi from npm), or undefined if this system has none. */
export function systemFolderPicker(): FolderPicker | undefined {
  if (!command()) return undefined;
  return (title, start) =>
    new Promise((resolve) => {
      const env = { ...process.env, MIYAGI_PICK_TITLE: title, MIYAGI_PICK_START: start ?? "" };
      const [program, args] = command(title, start) ?? ["", []];
      let out = "";
      const child = spawn(program, args, { env, stdio: ["ignore", "pipe", "ignore"], windowsHide: false });
      child.stdout.setEncoding("utf8").on("data", (chunk: string) => (out += chunk));
      child.on("error", () => resolve(undefined));
      // Cancelled, the dialog exits with an error or prints nothing.
      child.on("close", (code) => resolve(code === 0 && out.trim() ? withoutSlash(out.trim()) : undefined));
    });
}
