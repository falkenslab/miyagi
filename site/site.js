// miyagi — promotional site: menu, copy button and the terminal's one reveal.
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

// The terminal's lines appear one after another, once; all at once with reduced motion.
const lines = [...document.querySelectorAll(".terminal li")];
const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
lines.forEach((line, i) => {
  if (still) line.classList.add("shown");
  else setTimeout(() => line.classList.add("shown"), 250 + i * 420);
});
