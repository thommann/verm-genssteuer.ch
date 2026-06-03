/**
 * Vermögenssteuer-Modell — exakte Nachbildung des Excel-Rechners
 * ("Vermoegenssteuer_Rechner.xlsx", Blätter «Steuerrechner» / «Engine» / «Projektion»).
 *
 * Marginaler Tarif:  τ(W) = Basis · (W / Schwelle)^k,  gedeckelt bei «Cap».
 * Die Steuer wird nur auf den Vermögensteil über der Schwelle erhoben:
 *   Steuer(W) = ∫_Schwelle^W min(Cap, Basis·(x/Schwelle)^k) dx
 *
 * «Basis» wird so kalibriert, dass der Ø-Satz beim Anker-Vermögen den Zielwert trifft.
 *
 * Validierung (siehe scripts/01_extract_calculator.py):
 *   Mit den Default-Parametern reproduziert dieses Modell die im Workbook
 *   publizierten Aufkommen exakt: 76,0512 / 91,1598 / 91,5437 Mrd. CHF (2020/21/22)
 *   sowie die dynamische Projektion (92,30 → 23,87 Mrd.).
 */

/** Kalibrierter Basis-Satz (Grenzsatz bei der Schwelle). */
export function computeBasis(schwelle, k, anker, target) {
  const kp = k + 1;
  return (target * anker * kp) / (schwelle * (Math.pow(anker / schwelle, kp) - 1));
}

/** Vermögen, ab dem der Grenzsatz den Cap erreicht. */
export function capCrossing(schwelle, k, cap, basis) {
  return schwelle * Math.pow(cap / basis, 1 / k);
}

/**
 * Erzeugt das Steuer-Funktionsbündel für einen Parametersatz.
 * params = { schwelle, exponent (k), cap, ankerVermoegen, ankerSatz }
 */
export function makeModel({ schwelle, exponent, cap, ankerVermoegen, ankerSatz }) {
  const k = exponent;
  const kp = k + 1;
  const basis = computeBasis(schwelle, k, ankerVermoegen, ankerSatz);
  const wcap = capCrossing(schwelle, k, cap, basis);

  const tax = (W) => {
    if (W <= schwelle) return 0;
    if (W <= wcap) return (basis * schwelle / kp) * (Math.pow(W / schwelle, kp) - 1);
    const below = (basis * schwelle / kp) * (Math.pow(wcap / schwelle, kp) - 1);
    return below + cap * (W - wcap);
  };

  const marginalRate = (W) => {
    if (W <= schwelle) return 0;
    return Math.min(cap, basis * Math.pow(W / schwelle, k));
  };

  const avgRate = (W) => (W <= 0 ? 0 : tax(W) / W);

  return { tax, marginalRate, avgRate, basis, wcap, schwelle, cap, k };
}

/** Statisches Jahresaufkommen: Σ Anzahl(Band) · Steuer(Bandmitte). */
export function revenueForYear(bins, model, year) {
  const key = `cnt${year}`;
  let sum = 0;
  for (const b of bins) sum += b[key] * model.tax(b.mid);
  return sum;
}

const BANDS = [
  { label: '5–10 Mio.', lo: 5e6, hi: 10e6 },
  { label: '10–100 Mio.', lo: 10e6, hi: 100e6 },
  { label: '100 Mio.–1 Mrd.', lo: 100e6, hi: 1e9 },
  { label: '1–10 Mrd.', lo: 1e9, hi: 10e9 },
  { label: '> 10 Mrd.', lo: 10e9, hi: Infinity },
];

/** Aufkommen pro Vermögensband (wie im Workbook gruppiert). */
export function revenueByBand(bins, model, year) {
  const key = `cnt${year}`;
  return BANDS.map((band) => {
    let sum = 0;
    for (const b of bins) {
      if (b.mid >= band.lo && b.mid < band.hi) sum += b[key] * model.tax(b.mid);
    }
    return { label: band.label, value: sum };
  });
}

/** Punkte für die Tarifkurve (Grenz- und Ø-Satz) über ein logarithmisches Vermögensraster. */
export function tariffCurve(model, fromW, toW, points = 60) {
  const out = [];
  const logFrom = Math.log10(fromW);
  const logTo = Math.log10(toW);
  for (let i = 0; i < points; i += 1) {
    const W = Math.pow(10, logFrom + ((logTo - logFrom) * i) / (points - 1));
    out.push({ W, marginal: model.marginalRate(W), avg: model.avgRate(W) });
  }
  return out;
}

/**
 * Dynamische Hochrechnung je Kohorte: W(t+1) = W(t)·(1+r) − Steuer(W(t)).
 * Rein mechanisch (keine Abwanderung/Verhalten). Gibt Jahresaufkommen zurück.
 */
export function dynamicProjection(cohorts, model, rendite, startYear = 2022, nYears = 11) {
  const W = cohorts.map((c) => c.W0);
  const n = cohorts.map((c) => c.anzahl);
  const series = [];
  for (let t = 0; t < nYears; t += 1) {
    let rev = 0;
    for (let i = 0; i < W.length; i += 1) rev += n[i] * model.tax(W[i]);
    series.push({ year: startYear + t, revenue: rev });
    for (let i = 0; i < W.length; i += 1) {
      W[i] = Math.max(0, W[i] * (1 + rendite) - model.tax(W[i]));
    }
  }
  return series;
}

/** Gleichgewichts-Vermögen W*, bei dem der Ø-Satz gerade die Rendite r erreicht. */
export function equilibriumWealth(model, rendite, hi = 1e12) {
  let lo = model.schwelle;
  if (model.avgRate(hi) < rendite) return null; // Cap zu tief: kein Gleichgewicht
  for (let i = 0; i < 80; i += 1) {
    const mid = Math.sqrt(lo * hi);
    if (model.avgRate(mid) < rendite) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
