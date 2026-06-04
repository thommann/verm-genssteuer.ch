import { reactive, computed } from 'vue';
import bins from '@/data/calculator_bins.json';
import paramsData from '@/data/calculator_params.json';
import cohorts from '@/data/projektion_cohorts.json';
import {
  makeModel,
  makeBracketModel,
  makeMinTaxModel,
  revenueForYear,
  revenueByBand,
  tariffCurve,
  dynamicProjection,
  equilibriumWealth,
} from '@/lib/taxModel.js';

const d = paramsData.defaults;

// Direkte Modell-Komponenten: schwelle, basis (Grenzsatz an der Schwelle), exponent, cap.
// «basis» je Preset = Grenzsatz, mit dem die Steuer direkt über dem Freibetrag einsetzt.
// Voreingestellte Steuermodelle zum Durchprobieren. Die Beschriftungen liegen zentral
// in der i18n-Locale (presets.<key>) und werden in der Komponente aufgelöst.
export const PRESETS = {
  flach: {
    group: 'meine',
    schwelle: 5e6, exponent: 0.3, cap: 0.5, basis: 0.0108,
  },
  moderat: {
    group: 'meine',
    schwelle: 5e6, exponent: 0.5, cap: 0.5, basis: 0.006784,
  },
  steil: {
    group: 'meine',
    schwelle: 5e6, exponent: 0.9, cap: 0.5, basis: 0.002572,
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
  // WIR 2026: Mindeststeuer auf das Gesamtvermögen ab 100 Mio. $ (Centi-Millionäre).
  wir2026_2: {
    group: 'wir26', kind: 'mintax',
    threshold: 1e8, rate: 0.02,
  },
  wir2026_3: {
    group: 'wir26', kind: 'mintax',
    threshold: 1e8, rate: 0.03,
  },
  wir2026_5: {
    group: 'wir26', kind: 'mintax',
    threshold: 1e8, rate: 0.05,
  },
};

// Anzeige-Gruppen der Preset-Leiste (in Reihenfolge der Zeilen). labelKey verweist auf
// die i18n-Locale; die Gruppe «meine» wird ohne Beschriftung angezeigt.
export const PRESET_GROUPS = [
  { id: 'meine', labelKey: '' },
  { id: 'wir22', labelKey: 'presets.groupWir22' },
  { id: 'wir26', labelKey: 'presets.groupWir26' },
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
});

const model = computed(() => {
  const p = state.activePreset ? PRESETS[state.activePreset] : null;
  if (p && p.kind === 'brackets') return makeBracketModel(p.brackets);
  if (p && p.kind === 'mintax') return makeMinTaxModel(p.threshold, p.rate);
  return makeModel({
    schwelle: state.schwelle,
    exponent: state.exponent,
    cap: state.cap,
    basis: state.basis,
  });
});

const staticRevenue = computed(() => revenueForYear(bins, model.value, state.year));
const bands = computed(() => revenueByBand(bins, model.value, state.year));
const curve = computed(() => tariffCurve(model.value, model.value.schwelle, 2e10, 64));
const projection = computed(() => dynamicProjection(cohorts, model.value, state.rendite));
const sustainableRevenue = computed(() => {
  const p = projection.value;
  return p[p.length - 1].revenue;
});
const equilibrium = computed(() => equilibriumWealth(model.value, state.rendite));

function applyPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  // Power-Presets («Unsere») setzen die Regler; WIR-Presets nutzen ein eigenes,
  // exaktes Modell (Bänder bzw. Mindeststeuer), die Regler bleiben dabei unverändert.
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
    sustainableRevenue,
    bands,
    curve,
    projection,
    equilibrium,
    years: Object.keys(paramsData.years).map(Number),
    publishedRevenue: paramsData.published_revenue,
    applyPreset,
    markCustom,
  };
}
