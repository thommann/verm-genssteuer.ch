import { createI18n } from 'vue-i18n';
import de from './locales/de.js';

// Zentrale Textverwaltung über vue-i18n. Alle Oberflächentexte liegen in den
// Locale-Dateien unter src/i18n/locales/ und werden ausschliesslich über Schlüssel
// referenziert. Texte mit Inline-Markup werden in den Komponenten per v-html
// gerendert; deshalb ist die HTML-Warnung bewusst deaktiviert.
export const i18n = createI18n({
  legacy: false, // Composition API ($t im Template via globalInjection)
  globalInjection: true,
  locale: 'de',
  fallbackLocale: 'de',
  warnHtmlMessage: false, // Texte mit Inline-Markup werden bewusst per v-html gerendert
  messages: { de },
});

export default i18n;
