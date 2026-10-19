# GUI: extensions and capabilities

Issue: [#50](https://github.com/falkenslab/miyagi/issues/50)

## Goal

A view where the teacher sees what miyagi can do (capabilities), installs, configures, updates and removes extensions, and adds a repository, as the mockup's extensions view (ADR-021, ADR-022).

## Context

- The controller has the actions: `extensionCatalog`, `installExtension` (with `confirmed`), `updateExtension`, `removeExtension` (with `deleteData`), `setExtension` (on/off), `extensionOptions`, `setExtensionOptions`, `extensionImage`, `signInExtension`, `trustWorkspace`; `state.extensions` lists the active ones with their capabilities and what's unavailable.
- Captain Whiskers' drawer is the model (installed, catalog with logos and search, a confirmation for a foreign marketplace, options as a form).
- The mockup's tabs: installed, catalog, repositories, capabilities.
- Needs `gui-chat`; the kit's extensions are already wired in miyagi (`src/extensions.ts`).

## Changes

- The host maps the extension actions (`catalog`, `install`, `update`, `remove`, `extension`, `options`, `set-options`, `image`, `trust`) and marketplaces (`listMarketplaces`, `addMarketplace`, `removeMarketplace`).
- **Capabilities** tab first: what miyagi can do now and what's missing, in the teacher's words ("Corregir entregas en el aula: necesitas conectar un aula").
- **Installed**: on/off, options form (`userConfig`, sensitive ones never shown back), update, remove (asking whether to delete its data).
- **Catalog**: agent-extensions' entries with topic `miyagi`, logo, description in the teacher's language, what it needs on the computer, install.
- **Repositories**: the official one, fixed; adding another shows the kit's warning and needs the marketplace's name typed.
- "Conectar un aula": installs `moodle-teacher` and opens its options (sites); sign-in through the extension's window.
- A workspace with extensions it doesn't trust yet asks once (`trustWorkspace`).

- - -

## Acceptance

- In the app against the sandbox: install moodle-teacher, set its site, turn it off and on; the chat's `/extensions` agrees.
- Adding a foreign repository without typing its name adds nothing.
- No sensitive option's value reaches the page's state.

- - -
