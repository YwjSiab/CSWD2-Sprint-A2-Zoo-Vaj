import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
<<<<<<< HEAD
  // 🌐 Browser files (front-end)
  {
    files: ["**/*.js"],
    ignores: ["server.js"], // exclude Node file from browser rules
    languageOptions: {
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off", // allow console.log
    },
  },

  // 🖥️ Node.js files (server/backend)
  {
    files: ["server.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
=======
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module", // Set "module" if using import/export
      globals: globals.browser, // Use browser globals
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console logs
      ...pluginJs.configs.recommended.rules, // Apply recommended ESLint rules
    },
  },
];
>>>>>>> 2468668 (added toggle to animal status and health)
