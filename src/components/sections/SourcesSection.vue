<script setup>
import sources from '@/data/sources.json';
</script>

<template>
  <section id="quellen" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">{{ $t('sources.eyebrow') }}</div>
      <h2 v-html="$t('sources.title')" />
      <p class="lead">{{ $t('sources.lead') }}</p>

      <div class="src-list">
        <a v-for="s in sources" :key="s.id" :href="s.url" target="_blank" rel="noopener" class="src card">
          <div class="src-head">
            <span class="src-kurz">{{ s.kurz }}</span>
            <span class="pill">{{ s.stand }}</span>
          </div>
          <div class="src-titel">{{ s.titel }}</div>
          <div class="src-hg">{{ s.herausgeber }}</div>
          <div v-if="s.hinweis" class="src-hinweis">{{ s.hinweis }}</div>
          <div class="src-url">{{ s.url }} ↗</div>
        </a>
      </div>

      <div class="method card">
        <h3>{{ $t('sources.methodTitle') }}</h3>
        <ul>
          <li v-html="$t('sources.methodLi1')" />
          <li v-html="$t('sources.methodLi3')" />
          <li v-html="$t('sources.methodLi4')" />
          <li v-html="$t('sources.methodLi5')" />
          <li v-html="$t('sources.methodLi6')" />
        </ul>
      </div>

      <footer class="foot">
        <p class="muted" v-html="$t('sources.footer')" />
      </footer>
    </div>
  </section>
</template>

<style scoped>
.src-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin: 28px 0; }
.src { padding: 20px; text-decoration: none; color: inherit; transition: border-color 0.15s ease, transform 0.15s ease; display: block; }
.src:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none; }
.src-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px; }
.src-kurz { font-weight: 800; color: var(--text); min-width: 0; overflow-wrap: anywhere; }
.src-head .pill { max-width: 100%; overflow-wrap: anywhere; }
.src-titel { font-size: 0.9rem; color: var(--text-soft); margin-bottom: 4px; }
.src-hg { font-size: 0.8rem; color: var(--text-mute); }
.src-hinweis { font-size: 0.8rem; color: var(--text-mute); margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.src-url { font-size: 0.76rem; color: var(--accent-soft); margin-top: 10px; word-break: break-all; }

.method { padding: 26px; margin-top: 8px; }
.method ul { margin: 12px 0 0; padding-left: 20px; color: var(--text-soft); }
.method li { margin-bottom: 12px; font-size: 0.92rem; }
.foot { margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border); }
.foot p { max-width: 80ch; font-size: 0.86rem; }
</style>
