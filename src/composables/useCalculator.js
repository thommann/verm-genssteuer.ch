import { reactive, computed } from 'vue';
import bins from '@/data/calculator_bins.json';
import paramsData from '@/data/calculator_params.json';
import cohorts from '@/data/projektion_cohorts.json';
import spendRef from '@/data/spend_reference.json';
import {
  makeModel,
  makeBracketModel,
  revenueForYear,
  revenueByBand,
  tariffCurve,
  dynamicProjection,
} from '@/lib/taxModel.js';

// Sentinel-Wert für «kein Wegzug»: Schwelle oberhalb aller bekannten Bins.
export const WEGZUG_MAX = 50e9;

// Effektive Sätze auf steuerbares Reinvermögen (ESTV-Basis).
// Vermögenssteuer: NZZ (nzz_vermoegenssteuer), Ø 0,28 %.
// Einkommenssteuer: Mittelwert aus Duschmalé-Beispiel (reichensteuer_studie_ch), Bandbreite 0,7–1,2 %, Mittelwert ~0,9 %.
export const VST_RATE = 0.0028;
export const EST_RATE = 0.0090;

const d = paramsData.defaults;

// Direkte Modell-Komponenten: schwelle, basis (Grenzsatz an der Schwelle), exponent, cap.
// «basis» je Preset = Grenzsatz, mit dem die Steuer direkt über dem Freibetrag einsetzt.
// Voreingestellte Steuermodelle zum Durchprobieren. Die Beschriftungen liegen zentral
// in der i18n-Locale (presets.<key>) und werden in der Komponente aufgelöst.
// Progressive Szenarien: gleicher Freibetrag (5 Mio.), gleicher Grenzsatz an der Schwelle
// (2 %) und gleicher Cap (100 %); variabel ist nur die Progression (exponent).
// Flache Szenarien: dieselben Werte, aber Progression 0 (konstanter Grenzsatz) und der
// Grenzsatz (basis) variabel (2 / 3 / 5 %). Eigene Probier-Presets, die Regler bleiben
// verstellbar.
export const PRESETS = {
  flach: {
    group: 'meine',
    schwelle: 5e6, exponent: 0.3, cap: 1, basis: 0.02,
  },
  moderat: {
    group: 'meine',
    schwelle: 5e6, exponent: 0.5, cap: 1, basis: 0.02,
  },
  steil: {
    group: 'meine',
    schwelle: 5e6, exponent: 0.9, cap: 1, basis: 0.02,
  },
  flach2: {
    group: 'flat',
    schwelle: 5e6, exponent: 0, cap: 1, basis: 0.02,
  },
  flach3: {
    group: 'flat',
    schwelle: 5e6, exponent: 0, cap: 1, basis: 0.03,
  },
  flach5: {
    group: 'flat',
    schwelle: 5e6, exponent: 0, cap: 1, basis: 0.05,
  },
  // WIR 2022: exakte Grenzsatz-Staffel je Vermögensband (Tabelle 7.2), ab 1 Mio. wie im
  // Original. Die ESTV-Klassen 1–5 Mio. sind im Populationsmodell enthalten (siehe Bins).
  wir2022_1: {
    group: 'wir22', kind: 'brackets',
    brackets: [
      { from: 1e6, rate: 0.01 }, { from: 1e7, rate: 0.015 }, { from: 1e8, rate: 0.02 },
      { from: 1e9, rate: 0.025 }, { from: 1e10, rate: 0.03 }, { from: 1e11, rate: 0.035 },
    ],
  },
  wir2022_2: {
    group: 'wir22', kind: 'brackets',
    brackets: [
      { from: 1e6, rate: 0.01 }, { from: 1e7, rate: 0.015 }, { from: 1e8, rate: 0.03 },
      { from: 1e9, rate: 0.05 }, { from: 1e10, rate: 0.07 }, { from: 1e11, rate: 0.10 },
    ],
  },
  wir2022_3: {
    group: 'wir22', kind: 'brackets',
    brackets: [
      { from: 1e6, rate: 0.01 }, { from: 1e7, rate: 0.015 }, { from: 1e8, rate: 0.07 },
      { from: 1e9, rate: 0.15 }, { from: 1e10, rate: 0.50 }, { from: 1e11, rate: 0.90 },
    ],
  },
};

// Anzeige-Gruppen der Preset-Leiste (in Reihenfolge der Zeilen). labelKey verweist auf
// die i18n-Locale; die Gruppe «meine» wird ohne Beschriftung angezeigt.
export const PRESET_GROUPS = [
  { id: 'meine', labelKey: 'presets.groupProgressiv' },
  { id: 'flat', labelKey: 'presets.groupFlach' },
  { id: 'wir22', labelKey: 'presets.groupWir22' },
];

// Startzustand = erstes Preset, damit der angezeigte Tarif zur hervorgehobenen Pille passt.
const FIRST_PRESET = Object.keys(PRESETS)[0];
const p0 = PRESETS[FIRST_PRESET];

const state = reactive({
  schwelle: p0.schwelle,
  exponent: p0.exponent,
  cap: p0.cap,
  basis: p0.basis,
  rendite: d.rendite,
  year: 2022,
  activePreset: FIRST_PRESET,
  wegzugSchwelle: WEGZUG_MAX,
});

const model = computed(() => {
  const p = state.activePreset ? PRESETS[state.activePreset] : null;
  if (p && p.kind === 'brackets') return makeBracketModel(p.brackets);
  return makeModel({
    schwelle: state.schwelle,
    exponent: state.exponent,
    cap: state.cap,
    basis: state.basis,
  });
});

// Effektive Wegzugs-Schwelle: Infinity = kein Wegzug (sentinel WEGZUG_MAX).
const effectiveWegzug = computed(() =>
  state.wegzugSchwelle >= WEGZUG_MAX ? Infinity : state.wegzugSchwelle
);
const wegzugAktiv = computed(() => effectiveWegzug.value < Infinity);

const staticRevenue = computed(() => revenueForYear(bins, model.value, state.year, effectiveWegzug.value));
const bands = computed(() => revenueByBand(bins, model.value, state.year, effectiveWegzug.value));
const curve = computed(() => tariffCurve(model.value, model.value.schwelle, 2e10, 64));
const projection = computed(() =>
  dynamicProjection(cohorts, model.value, state.rendite, 2022, 11, effectiveWegzug.value)
);
const sustainableRevenue = computed(() => {
  const p = projection.value;
  return p[p.length - 1].revenue;
});

// Anzahl Steuerpflichtige und heutige Steuerleistung der wegziehenden Gruppe.
const wegzugPersonen = computed(() => {
  if (!wegzugAktiv.value) return 0;
  const key = `cnt${state.year}`;
  let sum = 0;
  for (const b of bins) {
    if (b.mid >= effectiveWegzug.value) sum += b[key];
  }
  return Math.round(sum);
});

// Heutiger Steuerausfall durch Wegzug (auf steuerbares Vermögen, Quellen: NZZ + Martinez/KOF).
const wegzugVstVerlust = computed(() => {
  if (!wegzugAktiv.value) return 0;
  const key = `cnt${state.year}`;
  let sum = 0;
  for (const b of bins) {
    if (b.mid >= effectiveWegzug.value) sum += b[key] * b.mid * VST_RATE;
  }
  return sum;
});
const wegzugEstVerlust = computed(() => {
  if (!wegzugAktiv.value) return 0;
  const key = `cnt${state.year}`;
  let sum = 0;
  for (const b of bins) {
    if (b.mid >= effectiveWegzug.value) sum += b[key] * b.mid * EST_RATE;
  }
  return sum;
});
const wegzugAktuelleSteuern = computed(() => wegzugVstVerlust.value + wegzugEstVerlust.value);

// Netto-Fiskalgewinn: was der Staat netto mehr hat als heute.
// = neue Steuer von den Verbliebenen − heutige Steuern der Abgewanderten.
const nettoStatisch = computed(() => staticRevenue.value - wegzugAktuelleSteuern.value);
const nettoDauerhaft = computed(() => sustainableRevenue.value - wegzugAktuelleSteuern.value);
const nettoProjection = computed(() =>
  projection.value.map((p) => ({ ...p, revenue: p.revenue - wegzugAktuelleSteuern.value }))
);

// Jahre bis zur vollstaendigen Tilgung der Staatsschuld (Maastricht-Definition)
// durch kumulierte Netto-Einnahmen. null = Horizont (250 Jahre) wird ueberschritten.
const DEBTFREE_HORIZON = 250;
const debtFreeYears = computed(() => {
  const target = spendRef.kennzahlen.staatsschuld_maastricht.value;
  const series = dynamicProjection(cohorts, model.value, state.rendite, state.year, DEBTFREE_HORIZON, effectiveWegzug.value);
  let cum = 0;
  for (let i = 0; i < series.length; i += 1) {
    const rev = series[i].revenue - wegzugAktuelleSteuern.value;
    if (rev <= 0) break;
    if (cum + rev >= target) return i + (target - cum) / rev;
    cum += rev;
  }
  return null;
});

function applyPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  // Power-Presets («Unsere») setzen die Regler; WIR-Presets nutzen ein eigenes,
  // exaktes Modell (Grenzsatz-Bänder), die Regler bleiben dabei unverändert.
  if (!p.kind) {
    state.schwelle = p.schwelle;
    state.exponent = p.exponent;
    state.cap = p.cap;
    state.basis = p.basis;
  }
  state.activePreset = key;
}

function markCustom() {
  state.activePreset = null;
}

export function useCalculator() {
  return {
    state,
    model,
    staticRevenue,
    bands,
    curve,
    wegzugPersonen,
    wegzugAktuelleSteuern,
    nettoStatisch,
    nettoDauerhaft,
    nettoProjection,
    debtFreeYears,
    years: Object.keys(paramsData.years).map(Number),
    applyPreset,
    markCustom,
  };
}
