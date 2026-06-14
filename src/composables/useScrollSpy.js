import { ref, watch, onMounted, onUnmounted } from 'vue';

// Verfolgt, welcher der übergebenen Abschnitts-Anker gerade oben sichtbar ist.
// Wird innerhalb einer Seite genutzt, etwa um den aktiven Schritt im Rechner-Stepper
// zu markieren. Liefert eine reaktive activeId zurück.
//
// Mit syncHash: true schreibt der Spy den aktiven Anker zusätzlich beim Scrollen in die
// URL (per history.replaceState, also ohne Verlaufseintrag und ohne erneutes Springen).
// Der erste Wert beim Laden wird übersprungen, damit eine ankerlose URL (z. B. «/»)
// sauber bleibt, bis der Nutzer tatsächlich scrollt.
export function useScrollSpy(ids, { line = 90, syncHash = false } = {}) {
  const activeId = ref(ids[0]);
  let ticking = false;

  if (syncHash) {
    watch(activeId, (id) => {
      history.replaceState(history.state, '', `${location.pathname}${location.search}#${id}`);
    });
  }

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
