import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

// Flat-Config für ESLint mit Vue- und TypeScript-Regeln (offizielles @vue/eslint-config).
// Die TypeScript-Regeln laufen ohne Typprüfung (recommended, nicht type-checked), weil das
// Projekt reines JavaScript in <script setup> nutzt; so greifen die TS-Regeln auf .vue/.js,
// ohne ein tsconfig/Typsystem zu verlangen.
export default defineConfigWithVueTs(
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

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/source',
    files: ['src/**/*.{js,vue}'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    name: 'app/node',
    files: ['*.{js,mjs}', 'marketing/**/*.mjs'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    name: 'app/e2e',
    // Die page.evaluate-Callbacks laufen im Browser, der Testrahmen in Node: beide Globals.
    files: ['e2e/**/*.js'],
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
      // Die SFC-Scripts sind bewusst JavaScript (kein lang-Attribut). Die Vue+TS-Tooling
      // lintet sie trotzdem; ein unbekanntes lang bleibt verboten.
      'vue/block-lang': ['error', { script: { allowNoLang: true } }],
    },
  },
);
