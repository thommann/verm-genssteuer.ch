import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Liest eine i18n-Block-Liste aus dem Namensraum `base` und loest alle Felder ueber rt() in
// reine Strings auf. Eine Block-Liste ist `[{ t, x, by }]` mit t = 'p' (Absatz), 'h'
// (Zwischentitel) oder 'q' (Zitat); optional dazu eine `sources`-Liste mit Quellen-ids.
// `base` darf ein String oder ein Getter (fuer reaktive Namensraeume) sein.
// Gibt zusaetzlich tm/rt/r zurueck, damit Aufrufer weitere Felder (z. B. ein Video) aus
// demselben Namensraum aufloesen koennen.
export function useProseBlocks(base) {
  const { tm, rt } = useI18n();
  const r = (v) => (v == null ? '' : rt(v));
  const ns = computed(() => (typeof base === 'function' ? base() : base));

  const blocks = computed(() =>
    (tm(`${ns.value}.blocks`) || []).map((b) => ({ t: r(b.t), x: r(b.x), by: r(b.by) })),
  );
  const sources = computed(() => (tm(`${ns.value}.sources`) || []).map(r));

  return { tm, rt, r, blocks, sources };
}
