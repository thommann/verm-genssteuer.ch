/**
 * Vermögenssteuer-Modell: progressive Vermögenssteuer auf das reichste 1 %.
 *
 * Marginaler Tarif:  τ(W) = Basis · (W / Schwelle)^k,  gedeckelt bei «Cap».
 * Die Steuer wird nur auf den Vermögensteil über der Schwelle erhoben:
 *   Steuer(W) = ∫_Schwelle^W min(Cap, Basis·(x/Schwelle)^k) dx
 *
 * «basis» ist der Grenzsatz direkt an der Schwelle und eine direkte Modell-Komponente.
 * (computeBasis bleibt als Hilfsfunktion erhalten, um basis aus einem gewünschten
 * Ø-Satz an einem Anker-Vermögen abzuleiten, etwa für die Pipeline-Reproduktion.)
 * Herleitung und Formeln: docs/METHODIK.md, Abschnitt 6 (Verfahren E).
 *
 * Validierung (scripts/00_reproduce_statistics.py): mit den Default-Parametern und der
 * ESTV-/FDK-Population (calculator_bins.json) ergibt dieses Modell das Referenz-Aufkommen
 * 76,0512 / 91,1598 / 91,5437 Mrd. CHF (2020/21/22) sowie die dynamische Projektion
 * (92,30 → 23,87 Mrd.), beides exakt reproduzierbar.
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
 * params = { schwelle, exponent (k), cap, basis }, basis = Grenzsatz an der Schwelle.
 */
export function makeModel({ schwelle, exponent, cap, basis }) {
  const k = exponent;
  const kp = k + 1;
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

/**
 * Exakte progressive Grenzsatz-Staffel (Bänder), für die WIR-2022-Szenarien.
 * brackets = [{ from, rate }] aufsteigend; `rate` ist der Grenzsatz vom jeweiligen
 * `from` bis zur nächsten Bandgrenze. Steuer = Σ rate_i · (in das Band fallender Anteil).
 */
export function makeBracketModel(brackets) {
  const b = [...brackets].sort((x, y) => x.from - y.from);
  const schwelle = b[0].from;

  const tax = (W) => {
    let sum = 0;
    for (let i = 0; i < b.length; i += 1) {
      if (W <= b[i].from) break;
      const hi = i + 1 < b.length ? Math.min(W, b[i + 1].from) : W;
      sum += b[i].rate * (hi - b[i].from);
    }
    return sum;
  };

  const marginalRate = (W) => {
    let r = 0;
    for (let i = 0; i < b.length; i += 1) {
      if (W >= b[i].from) r = b[i].rate;
      else break;
    }
    return r;
  };

  const avgRate = (W) => (W <= 0 ? 0 : tax(W) / W);

  return { tax, marginalRate, avgRate, schwelle, cap: null, wcap: null, k: null, basis: null, brackets: b };
}

/**
 * Statisches Jahresaufkommen: Σ Anzahl(Band) · Steuer(Bandmitte).
 * wegzugSchwelle: Bins mit mid >= Schwelle werden ausgeschlossen (Wegzug-Szenario).
 */
export function revenueForYear(bins, model, year, wegzugSchwelle = Infinity) {
  const key = `cnt${year}`;
  let sum = 0;
  for (const b of bins) {
    if (b.mid >= wegzugSchwelle) continue;
    sum += b[key] * model.tax(b.mid);
  }
  return sum;
}

const BANDS = [
  { label: '1–5 Mio.', lo: 1e6, hi: 5e6 },
  { label: '5–10 Mio.', lo: 5e6, hi: 10e6 },
  { label: '10–100 Mio.', lo: 10e6, hi: 100e6 },
  { label: '100 Mio.–1 Mrd.', lo: 100e6, hi: 1e9 },
  { label: '1–10 Mrd.', lo: 1e9, hi: 10e9 },
  { label: '> 10 Mrd.', lo: 10e9, hi: Infinity },
];

/** Aufkommen pro Vermögensband (wie im Workbook gruppiert). */
export function revenueByBand(bins, model, year, wegzugSchwelle = Infinity) {
  const key = `cnt${year}`;
  return BANDS.map((band) => {
    let sum = 0;
    for (const b of bins) {
      if (b.mid >= wegzugSchwelle) continue;
      if (b.mid >= band.lo && b.mid < band.hi) sum += b[key] * model.tax(b.mid);
    }
    return { label: band.label, value: sum, lo: band.lo, hi: band.hi };
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
 * wegzugSchwelle: Kohorten mit W0 >= Schwelle werden ausgeschlossen (Wegzug-Szenario).
 */
export function dynamicProjection(cohorts, model, rendite, startYear = 2022, nYears = 11, wegzugSchwelle = Infinity) {
  const src = wegzugSchwelle < Infinity ? cohorts.filter((c) => c.W0 < wegzugSchwelle) : cohorts;
  const W = src.map((c) => c.W0);
  const n = src.map((c) => c.anzahl);
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
