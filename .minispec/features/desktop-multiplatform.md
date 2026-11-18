# Desktop app for macOS and Linux

Issue: [#116](https://github.com/falkenslab/miyagi/issues/116)

## Goal

Every release also carries the desktop app for macOS (`.dmg`, Apple Silicon and Intel) and Linux (`.AppImage`, `.deb`), and a Homebrew cask, built and checked by the release workflow like the Windows installer.

## Context

- The desktop app (`desktop/`, ADR-022) builds only for Windows: `"dist": "electron-builder --win"`, one `win` target (`nsis`), `artifactName: miyagi-setup.exe`. v0.18.0 carries only `miyagi-setup.exe` and `miyagi.tgz`.
- `.github/workflows/release.yml` (#115) builds `miyagi.tgz` on Ubuntu and the installer on Windows into a draft release, checked by `.claude/skills/release/check-package.mjs` and `check-desktop.mjs`.
- No cross-building: the Claude SDK installs only the `claude` binary of the platform `npm install` runs on (`@anthropic-ai/claude-agent-sdk-darwin-arm64`, `-darwin-x64`, `-linux-x64`…), and a `.dmg` is only made on macOS. Each installer is built on its own runner.
- Windows-only today:
  - `check-desktop.mjs` looks for `claude-agent-sdk-win32-x64/claude.exe`, `miyagi.exe` and Windows' locale files;
  - `scripts/afterPack.cjs` removes WebGPU's DLLs (`dxcompiler.dll`, `dxil.dll`);
  - the window draws its own title bar (`titleBarStyle: "hidden"`, `titleBarOverlay`) with the menu in the page; on macOS the traffic lights sit on the left and the menu belongs in the system's menu bar.
- `desktop/build/` has only `icon.png`; macOS wants an `.icns` (electron-builder makes it from a 512 px or larger PNG).
- Unsigned for now, as on Windows. On recent macOS an unsigned, unnotarized app downloaded from the internet is reported as "damaged": it opens with right click › Open, or `xattr -dr com.apple.quarantine /Applications/miyagi.app`, which the install page must explain. Signing and notarization (Apple Developer) stay for later.
- The repo is public, so `releases/latest/download/<name>` works for everyone, and so does a Homebrew tap.
- The same work is specified for padawan (`../padawan/.minispec/features/distribution.md`, padawan#20).

## Changes

- `desktop/package.json`:
  - `mac`: `dmg`, `arm64` and `x64`, `category: public.app-category.education`, the icon; `artifactName` `miyagi-arm64.dmg` and `miyagi-x64.dmg`;
  - `linux`: `AppImage` and `deb`, x64, `maintainer`, `category: Education`, the icon; `miyagi.AppImage` and `miyagi.deb`;
  - `dist` builds the current platform (`electron-builder`, no `--win`).
- `desktop/main.mjs`: on macOS, the window's title bar leaves room for the traffic lights and the menu goes to the application menu; the page's own menu stays on Windows and Linux.
- `scripts/afterPack.cjs`: each platform's trimming (the Windows DLLs only on Windows).
- `check-desktop.mjs` per platform: the SDK package of the build's platform and arch, the app's executable (`miyagi.app/Contents/MacOS/miyagi`, the AppImage's or the unpacked Linux one), and the start check on each (`xvfb-run` on Linux).
- `release.yml`: `macos-latest` (arm64), `macos-13` (x64) and `ubuntu-latest` jobs next to Windows, each uploading to the same draft; the release job attaches every file.
- Homebrew: a tap repo `falkenslab/homebrew-tap` with `Casks/miyagi.rb` (version, both `.dmg` URLs and their `sha256`, a `caveats` for the unsigned app); the workflow updates it after the release is published. `brew install --cask falkenslab/tap/miyagi`.
- `release` skill: the new files and their checks.
- Docs: Instalar and the landing page with a download per system (Windows, Mac, Linux), Gatekeeper's warning explained, and "Todas las descargas" listing every file; Spanish and English.

- - -

## Acceptance

- A manual run of the workflow builds and checks every file on its system; a release made from its tag carries `miyagi-setup.exe`, `miyagi-arm64.dmg`, `miyagi-x64.dmg`, `miyagi.AppImage`, `miyagi.deb` and `miyagi.tgz`.
- Each installs and starts showing the release's version: macOS arm64 and x64 (dmg, opened despite Gatekeeper), Ubuntu (deb and AppImage), Windows (exe).
- A session runs on each, using its own platform's `claude` binary.
- `brew install --cask falkenslab/tap/miyagi` installs the release's version on a Mac.

- - -
