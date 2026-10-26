// Starts Docusaurus' JavaScript once the page has loaded, not while it's being drawn (#27).
// Every page is server-rendered: the text, the menu's links and the theme (set by the inline script
// in the head) are there without JavaScript. The ~500 kB bundle that hydrates them took the
// phone's CPU in the middle of the first paint, which is what kept Lighthouse's mobile
// performance under 90. After the build, each page's deferred bundle scripts are kept as
// data-hydrate and a small loader adds them, in order, once the page has both loaded and painted
// its first content (the load event can come first), and a frame after that.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BUNDLE = /<script src="([^"]+\/assets\/js\/[^"]+\.js)" defer="defer"><\/script>/g;
const LOADER =
  "<script>!function(){var n=2,d=!1;function g(){if(d)return;d=!0;document.querySelectorAll('script[data-hydrate]').forEach(function(o){var s=document.createElement('script');s.src=o.getAttribute('data-hydrate');s.async=!1;document.body.appendChild(s)})}function r(){--n||requestAnimationFrame(function(){setTimeout(g,0)})}'complete'===document.readyState?r():addEventListener('load',r);try{var p=new PerformanceObserver(function(l){l.getEntries().some(function(e){return'first-contentful-paint'===e.name})&&(p.disconnect(),r())});p.observe({type:'paint',buffered:!0})}catch(e){r()}setTimeout(g,3e3)}()</script>";

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => (entry.isDirectory() ? htmlFiles(path.join(dir, entry.name)) : entry.name.endsWith(".html") ? [path.join(dir, entry.name)] : [])));
  return nested.flat();
}

export default function deferredHydration() {
  return {
    name: "deferred-hydration",
    async postBuild({ outDir }) {
      for (const file of await htmlFiles(outDir)) {
        const html = await readFile(file, "utf8");
        if (!BUNDLE.test(html)) continue;
        BUNDLE.lastIndex = 0;
        const deferred = html.replace(BUNDLE, '<script type="text/plain" data-hydrate="$1"></script>').replace("</body>", `${LOADER}</body>`);
        await writeFile(file, deferred);
      }
    },
  };
}
