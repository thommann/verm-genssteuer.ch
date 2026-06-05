import { fileURLToPath, URL } from 'node:url';
import { copyFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// GitHub Pages kennt keinen SPA-Fallback: Direktaufrufe wie /rechner würden sonst 404
// liefern. Wir kopieren die gebaute index.html nach 404.html, damit Pages bei unbekannten
// Pfaden dieselbe App ausliefert und der Router (History-Mode) die Route übernimmt.
const spaFallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const out = fileURLToPath(new URL('./dist', import.meta.url));
    const index = `${out}/index.html`;
    if (existsSync(index)) copyFileSync(index, `${out}/404.html`);
  },
});

export default defineConfig({
  // Custom Domain (vermögenssteuer.ch) wird vom Root ausgeliefert
  base: '/',
  plugins: [vue(), spaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
