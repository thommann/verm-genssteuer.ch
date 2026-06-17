const nf = (opts) => new Intl.NumberFormat('de-CH', opts);

/** CHF kompakt: Mrd./Mio./Tsd. */
export function chfCompact(v, digits = 1) {
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${nf({ maximumFractionDigits: digits }).format(v / 1e9)} Mrd.`;
  if (abs >= 1e6) return `${nf({ maximumFractionDigits: digits }).format(v / 1e6)} Mio.`;
  if (abs >= 1e3) return `${nf({ maximumFractionDigits: 0 }).format(v / 1e3)} Tsd.`;
  return nf({ maximumFractionDigits: 0 }).format(v);
}

export function chf(v, digits = 0) {
  return `CHF ${nf({ maximumFractionDigits: digits }).format(v)}`;
}

/** Anteil 0..1 → Prozent. */
export function pct(v, digits = 1) {
  return `${nf({ maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v * 100)} %`;
}

/** Anteil 0..1 → Prozent ohne Nachkommastelle (häufige Diagramm-Achsen-Formatierung). */
export const pct0 = (v) => pct(v, 0);

export function num(v, digits = 0, minDigits = 0) {
  return nf({ maximumFractionDigits: digits, minimumFractionDigits: minDigits }).format(v);
}
