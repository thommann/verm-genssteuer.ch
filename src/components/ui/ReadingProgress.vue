<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// Dünne Lesefortschrittsleiste am oberen Rand plus ein «nach oben»-Knopf, der erst
// nach etwas Scrollen erscheint. Beides hilft auf den langen Themenseiten bei der
// Orientierung. Der Fortschritt bezieht sich auf die aktuelle Seite.
const route = useRoute();
const progress = ref(0);
const showTop = ref(false);
let ticking = false;

const measure = () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  showTop.value = window.scrollY > window.innerHeight * 0.6;
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    measure();
  });
};

const toTop = () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
};

// Nach einem Seitenwechsel (Scroll springt nach oben) den Balken neu vermessen.
watch(() => route.fullPath, () => nextTick(measure));

onMounted(() => {
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});
</script>

<template>
  <div
    class="progress"
    :style="{ transform: `scaleX(${progress})` }"
    aria-hidden="true"
  />
  <transition name="totop">
    <button
      v-if="showTop"
      type="button"
      class="to-top"
      :aria-label="$t('nav.toTop')"
      :title="$t('nav.toTop')"
      @click="toTop"
    >
      <span aria-hidden="true">↑</span>
    </button>
  </transition>
</template>

<style scoped>
.progress {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  height: 3px; transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--accent), var(--violet), var(--teal));
}
.to-top {
  position: fixed; right: clamp(16px, 4vw, 32px); bottom: clamp(16px, 4vw, 32px); z-index: 55;
  width: 46px; height: 46px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 800; color: var(--text);
  background: rgba(11, 16, 32, 0.86); backdrop-filter: blur(8px);
  border: 1px solid var(--border); box-shadow: var(--shadow);
}
.to-top:hover { border-color: var(--accent); color: var(--accent-soft); }

.totop-enter-active, .totop-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.totop-enter-from, .totop-leave-to { opacity: 0; transform: translateY(8px); }
</style>
