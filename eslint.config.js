import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: globals.node } },
  // The promotional site's script runs in the browser.
  { files: ["site/**/*.js"], languageOptions: { globals: globals.browser } },
);
