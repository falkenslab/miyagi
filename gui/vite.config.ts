import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The page is built into miyagi's dist/gui/, where the host serves it (src/host/server.ts).
// `npm run dev` proxies the API to a running `miyagi web` (MIYAGI_WEB, its address with the token).
const target = process.env.MIYAGI_WEB ? new URL(process.env.MIYAGI_WEB).origin : "http://127.0.0.1:4321";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "../dist/gui", emptyOutDir: true, assetsDir: "assets", sourcemap: false },
  server: { proxy: { "/api": { target, changeOrigin: false } } },
});
