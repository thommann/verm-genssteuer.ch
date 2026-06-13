<script setup>
// Die übrigen Kampagnen-Aussagen als eigene, verlinkbare Abschnitte (je eine id).
// Unter jeder Aussage ein interner Link zur Erklärung: die passende Themenseite
// und ihr Anker. Texte und Link-Beschriftungen liegen in i18n (claims.items.*),
// Route und Anker bleiben hier, weil sie zur Struktur gehören.
import SourceTag from '@/components/ui/SourceTag.vue';

const CLAIMS = [
  { id: 'wirtschaft', key: 'wirtschaft', tone: 'accent', route: '/verteilung', hash: 'international' },
  { id: 'eigenheim', key: 'eigenheim', tone: 'gold', route: '/verteilung', hash: 'ubs-studie' },
  { id: 'krankenkasse', key: 'krankenkasse', tone: 'teal', route: '/rechner', hash: 'verwendung' },
  { id: 'oev', key: 'oev', tone: 'blue', route: '/rechner', hash: 'verwendung' },
  { id: 'strassen', key: 'strassen', tone: 'violet', route: '/verteilung', hash: 'verteilung' },
  { id: 'ende-monat', key: 'endeMonat', tone: 'accent', route: '/verteilung', hash: 'ubs-studie' },
  { id: 'standort', key: 'standort', tone: 'teal', route: '/rechner', hash: 'rechner' },
  { id: 'mittelstand', key: 'mittelstand', tone: 'gold', route: '/rechner', hash: 'verwendung' },
  { id: 'faire-steuern', key: 'faireSteuern', tone: 'violet', route: '/modelle', hash: 'zucman', source: 'zucman_g20' },
  { id: 'mindeststeuer', key: 'mindeststeuer', tone: 'teal', route: '/modelle', hash: 'zucman' },
  { id: 'kein-wegzug', key: 'keinWegzug', tone: 'blue', route: '/rechner', hash: 'wegzug' },
  { id: 'schon-fair', key: 'schonFair', tone: 'violet', route: '/modelle', hash: 'zucman' },
];
</script>

<template>
  <section id="aussagen" class="section section-alt">
    <div class="wrap">
      <div class="eyebrow">{{ $t('claims.eyebrow') }}</div>
      <h2>{{ $t('claims.title') }}</h2>
      <p class="lead">{{ $t('claims.lead') }}</p>

      <div class="claims">
        <article
          v-for="c in CLAIMS"
          :id="c.id"
          :key="c.id"
          class="claim card"
          :class="`tone-${c.tone}`"
        >
          <p class="claim-text" v-html="$t(`claims.items.${c.key}.text`)" />
          <div class="claim-foot">
            <router-link :to="{ path: c.route, hash: `#${c.hash}` }" class="claim-link">
              {{ $t(`claims.items.${c.key}.link`) }} <span aria-hidden="true">→</span>
            </router-link>
            <SourceTag v-if="c.source" :id="c.source" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.claims {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
  margin-top: 34px;
}

.claim {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px 28px 24px;
  position: relative;
  overflow: hidden;
  scroll-margin-top: 86px;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.claim::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--tone); opacity: 0.9;
}
.tone-accent { --tone: var(--accent); }
.tone-gold { --tone: var(--gold); }
.tone-teal { --tone: var(--teal); }
.tone-blue { --tone: var(--blue); }
.tone-violet { --tone: var(--violet); }
.claim:hover { transform: translateY(-3px); border-color: var(--tone); }

.claim-text {
  margin: 0;
  font-size: clamp(1.4rem, 2.4vw, 1.85rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--text);
}
.claim-text :deep(.hl) { color: var(--tone); }

.claim-foot {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 18px;
}
.claim-link {
  display: inline-flex; align-items: center; gap: 7px;
  font-weight: 700; font-size: 0.92rem; color: var(--text);
  text-decoration: none;
}
.claim-link span { color: var(--tone); transition: transform 0.15s ease; display: inline-block; }
.claim-link:hover { text-decoration: none; }
.claim-link:hover span { transform: translateX(4px); }
</style>
