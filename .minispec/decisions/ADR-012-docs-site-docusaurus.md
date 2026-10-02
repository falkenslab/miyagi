# ADR-012: The documentation site is Docusaurus in docs/, kept in step by a skill

## Decision

The public site at https://falkenslab.github.io/miyagi/ is a Docusaurus site in `docs/` (its own `package.json`, built by `.github/workflows/pages.yml`), replacing the hand-written single page in `site/`. It holds the landing page for teachers, a guide, a step-by-step use-case tutorial with real screenshots, and an advanced section. Every change to the project updates it before it is committed or released, through the `update-docs` skill and its `check-docs.mjs`.

## Motivation

One HTML page per language had no room for what users kept needing: the full guide (until then split between `README.md`, `docs/CHEATSHEET.md` and `docs/skills.md`), the details advanced users ask about (own skills, the knowledge base, `config.json`, the publish gate, the practice runner), and a worked course that shows the agent really working. A static site generator gives navigation, search-friendly pages and broken-link checks for Markdown we already write. Rejected: keeping `site/` and adding more HTML pages by hand (no shared navigation, every page a copy of the layout); MkDocs (Python toolchain in a Node repo).

## Consequences

- A build step and a second `node_modules` (`docs/`), outside the npm package; the deploy only publishes if the build passes, and the build fails on broken links and anchors.
- Spanish only for now: the English page of `site/` is gone until Docusaurus i18n is set up.
- The docs can drift from the code: `update-docs` runs before every commit that changes what a user sees and before every release (`commit` and `release` call it), and `check-docs.mjs` fails when a skill, command, subcommand or config key is undocumented.
- The tutorial's screenshots are real (moodle-sandbox and the chat driven in a pseudo-terminal): a change to what they show means retaking them, never editing them.
