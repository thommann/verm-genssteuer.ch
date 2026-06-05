import { ref, onMounted, onUnmounted } from 'vue';

// Verfolgt, welcher der übergebenen Abschnitts-Anker gerade oben sichtbar ist.
// Wird innerhalb einer Seite genutzt, etwa um den aktiven Schritt im Rechner-Stepper
// zu markieren. Liefert eine reaktive activeId zurück.
export function useScrollSpy(ids, { line = 90 } = {}) {
  const activeId = ref(ids[0]);
  let ticking = false;

  const update = () => {
    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    }
    if (current !== activeId.value) activeId.value = current;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  onMounted(() => {
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
  onUnmounted(() => window.removeEventListener('scroll', onScroll));

  return { activeId };
}
