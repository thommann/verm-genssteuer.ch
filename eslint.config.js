import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';

// Flat-Config für ESLint mit Vue-Regeln. Reines JavaScript-Projekt: ESLint-Core
// (recommended) plus eslint-plugin-vue (flat/recommended) auf .js und .vue. Die SFC-Scripts
// werden über den vue-eslint-parser mit dem Standard-JS-Parser (espree) gelesen.
export default [
  {
    name: 'app/ignores',
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      'data/**',
      'marketing/instagram/out/**',
    ],
  },

  {
    name: 'app/language',
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    name: 'app/source',
    files: ['src/**/*.{js,vue}'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    name: 'app/node',
    files: ['*.{js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    name: 'app/browser-in-node',
    // e2e- und Marketing-Skripte laufen in Node, enthalten aber page.evaluate-Callbacks,
    // die im Browser ausgeführt werden: darum beide Global-Sätze.
    files: ['e2e/**/*.js', 'marketing/**/*.mjs'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  {
    name: 'app/rules',
    rules: {
      // Inline-Markup stammt ausschliesslich aus den zentralen, vertrauenswürdigen
      // i18n-Texten und wird bewusst per v-html gerendert (siehe src/i18n/index.js,
      // warnHtmlMessage: false). Das ist ein Architekturentscheid, keine Einzelausnahme.
      'vue/no-v-html': 'off',
      // «App» ist die konventionelle Wurzelkomponente; die Mehrwort-Pflicht gilt sonst.
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
    },
  },
];
