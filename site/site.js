// miyagi — promotional site: menu, copy button, the terminal's examples, the tabs and the latest release.
document.documentElement.classList.add("js");

// The menu folds on narrow screens; on wide ones the links are always shown.
const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  const narrow = window.matchMedia("(max-width: 47.99rem)");
  const sync = () => {
    links.hidden = narrow.matches && toggle.getAttribute("aria-expanded") !== "true";
  };
  toggle.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", String(toggle.getAttribute("aria-expanded") !== "true"));
    sync();
  });
  links.addEventListener("click", (event) => {
    if (event.target.closest("a") && narrow.matches) {
      toggle.setAttribute("aria-expanded", "false");
      sync();
    }
  });
  narrow.addEventListener("change", sync);
  sync();
}

// Theme: system → light → dark. The choice is remembered; the head's inline script applies it
// before the first paint. Without JS the button stays hidden and the page follows the system.
const themeButton = document.querySelector(".theme");
if (themeButton) {
  const order = ["system", "light", "dark"];
  const show = (theme) => {
    const label = themeButton.dataset[theme];
    themeButton.setAttribute("aria-label", label);
    themeButton.dataset.tip = label;
    themeButton.querySelector("use").setAttribute("href", `#i-${theme}`);
  };
  let theme = document.documentElement.dataset.theme ?? "system";
  show(theme);
  themeButton.hidden = false;
  themeButton.addEventListener("click", () => {
    theme = order[(order.indexOf(theme) + 1) % order.length];
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    try {
      if (theme === "system") localStorage.removeItem("miyagi-theme");
      else localStorage.setItem("miyagi-theme", theme);
    } catch {
      // Storage blocked: the choice lasts until the page is left.
    }
    show(theme);
  });
}

// Copy the install command; the button says so, in the page's language.
for (const button of document.querySelectorAll(".copy")) {
  button.addEventListener("click", async () => {
    const code = button.parentElement.querySelector("code").textContent.trim();
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = button.dataset.done;
    } catch {
      button.textContent = button.dataset.fail;
    }
    setTimeout(() => (button.textContent = button.dataset.label), 2000);
  });
}

// The terminal plays one example: the request is typed, then each line appears, and it stops at
// the approval. The buttons under it play another. With reduced motion, each example is shown whole.
const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scenes = [...document.querySelectorAll(".terminal .scene")];
const sceneButtons = [...document.querySelectorAll(".scenes button")];
let timers = [];

function play(name) {
  timers.forEach(clearTimeout);
  timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  for (const scene of scenes) scene.hidden = scene.dataset.scene !== name;
  for (const button of sceneButtons) button.setAttribute("aria-pressed", String(button.dataset.scene === name));

  const scene = scenes.find((s) => s.dataset.scene === name);
  if (!scene) return;
  const lines = [...scene.children];
  const typed = scene.querySelector(".typed");
  const text = typed.dataset.text ?? typed.textContent;
  typed.dataset.text = text;
  if (still) {
    typed.textContent = text;
    lines.forEach((line) => line.classList.add("shown"));
    return;
  }

  lines.forEach((line) => line.classList.remove("shown"));
  typed.textContent = "";
  typed.classList.add("typing");
  lines[0].classList.add("shown");
  const perChar = 38;
  for (let i = 1; i <= text.length; i++) later(() => (typed.textContent = text.slice(0, i)), 300 + i * perChar);
  const typedAt = 300 + text.length * perChar + 350;
  later(() => typed.classList.remove("typing"), typedAt);
  lines.slice(1).forEach((line, i) => later(() => line.classList.add("shown"), typedAt + i * 650));
}

if (scenes.length) {
  for (const button of sceneButtons) button.addEventListener("click", () => play(button.dataset.scene));
  // Start when the terminal comes into view, not while it's off screen.
  const first = scenes[0].dataset.scene;
  if ("IntersectionObserver" in window && !still) {
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        seen.disconnect();
        play(first);
      }
    });
    scenes[0].querySelectorAll("li").forEach((li) => li.classList.remove("shown"));
    seen.observe(document.querySelector(".terminal"));
  } else {
    play(first);
  }
}

// Tabs for what it does (ARIA tabs pattern): without JS, every panel is shown with its heading.
const tablist = document.querySelector("[role=tablist]");
if (tablist) {
  const tabs = [...tablist.querySelectorAll("[role=tab]")];
  const select = (tab, focus) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    }
    if (focus) tab.focus();
  };
  tablist.hidden = false;
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab, false));
    tab.addEventListener("keydown", (event) => {
      const moves = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in moves)) return;
      event.preventDefault();
      select(tabs[(moves[event.key] + tabs.length) % tabs.length], true);
    });
  });
  for (const panel of document.querySelectorAll("[role=tabpanel]")) panel.tabIndex = 0;
  select(tabs[0], false);
}

// The latest release, from GitHub; if it can't be fetched, the line just stays empty.
const release = document.querySelector(".release");
if (release) {
  fetch("https://api.github.com/repos/falkenslab/miyagi/releases/latest")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((r) => {
      const date = new Date(r.published_at).toLocaleDateString(document.documentElement.lang, { day: "numeric", month: "long", year: "numeric" });
      release.textContent = `${release.dataset.prefix} ${r.tag_name} (${date})`;
    })
    .catch(() => {});
}
