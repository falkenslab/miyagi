// electron-builder's afterPack: what Electron ships that miyagi doesn't need, out of the app before
// the installer is made. WebGPU's shader compiler (dxcompiler.dll, dxil.dll: 26 MB; miyagi's page
// doesn't use WebGPU, and Moodle in the built-in browser neither), and Chromium's licenses, kept
// but gzipped (LICENSES.chromium.html.gz: 20 MB to 1.5 MB). CommonJS: electron-builder requires it.
const { existsSync, readFileSync, rmSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { gzipSync } = require("node:zlib");

exports.default = async function afterPack({ appOutDir }) {
  for (const file of ["dxcompiler.dll", "dxil.dll"]) rmSync(path.join(appOutDir, file), { force: true });
  const licenses = path.join(appOutDir, "LICENSES.chromium.html");
  if (existsSync(licenses)) {
    writeFileSync(`${licenses}.gz`, gzipSync(readFileSync(licenses), { level: 9 }));
    rmSync(licenses);
  }
};
