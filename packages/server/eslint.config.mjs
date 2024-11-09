import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/**/*"] },
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  eslintPluginUnicorn.configs["flat/all"],
  pluginJs.configs.recommended,
  perfectionist.configs["recommended-natural"],
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
];
