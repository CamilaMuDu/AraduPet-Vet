
import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },

  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
  },

  {
    settings: {
      react: { version: "detect" },
    },
  },

  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Reglas compatibles con React moderno y Vite
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },

  {
    ignores: ["node_modules", "dist", "public", ".nuxt"],
  },

  eslintConfigPrettier,
];
