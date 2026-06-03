import { reactive, computed } from 'vue';
import bins from '@/data/calculator_bins.json';
import paramsData from '@/data/calculator_params.json';
import cohorts from '@/data/projektion_cohorts.json';
import {
  makeModel,
  revenueForYear,
  revenueByBand,
  tariffCurve,
  dynamicProjection,
  equilibriumWealth,
} from '@/lib/taxModel.js';

const d = paramsData.defaults;

// Direkte Modell-Komponenten: schwelle, basis (Grenzsatz an der Schwelle), exponent, cap.
// «basis» je Preset = Grenzsatz, mit dem die Steuer direkt über dem Freibetrag einsetzt.
// Voreingestellte Steuermodelle zum Durchprobieren.
export const PRESETS = {
  flach: {
    label: 'Flach', group: 'meine',
    desc: 'Fast flacher Satz: 1,1 % an der Schwelle, kaum Progression.',
    schwelle: 5e6, exponent: 0.3, cap: 0.5, basis: 0.0108,
  },
  moderat: {
    label: 'Moderat', group: 'meine',
    desc: 'Sanft progressiv: 0,68 % an der Schwelle.',
    schwelle: 5e6, exponent: 0.5, cap: 0.5, basis: 0.006784,
  },
  steil: {
    label: 'Stark progressiv', group: 'meine',
    desc: 'Steile Kurve: 0,26 % an der Schwelle, schnell steigend.',
    schwelle: 5e6, exponent: 0.9, cap: 0.5, basis: 0.002572,
  },
  wir2022_1: {
    label: 'moderat', group: 'wir22',
    desc: 'Progressives Szenario 1 (moderat): Effektivsätze 0,6 % ab 1 Mio. bis 3,2 % über 100 Mrd.',
    schwelle: 5e6, exponent: 0.15, cap: 0.05, basis: 0.009853,
  },
  wir2022_2: {
    label: 'hoch', group: 'wir22',
    desc: 'Progressives Szenario 2 (hoch): Grenzsätze bis 10 %, Effektivsätze bis ~8 % über 100 Mrd.',
    schwelle: 5e6, exponent: 0.2, cap: 0.1, basis: 0.01356,
  },
  wir2022_3: {
    label: 'sehr hoch', group: 'wir22',
    desc: 'Progressives Szenario 3 (sehr hoch): Grenzsätze bis 90 %, Effektivsätze bis ~67 % über 100 Mrd.',
    schwelle: 5e6, exponent: 0.45, cap: 0.9, basis: 0.01183,
  },
  wir2026_2: {
    label: '2 %', group: 'wir26',
    desc: 'Mindeststeuer 2 %: beendet die Regressivität an der Spitze.',
    schwelle: 5e6, exponent: 0, cap: 1, basis: 0.02,
  },
  wir2026_3: {
    label: '3 %', group: 'wir26',
    desc: 'Mindeststeuer 3 %: stellt moderate Progression wieder her.',
    schwelle: 5e6, exponent: 0, cap: 1, basis: 0.03,
  },
  wir2026_5: {
    label: '5 %', group: 'wir26',
    desc: 'Ambitionierte Mindeststeuer 5 %.',
    schwelle: 5e6, exponent: 0, cap: 1, basis: 0.05,
  },
};

// Anzeige-Gruppen der Preset-Leiste (in Reihenfolge der Zeilen).
export const PRESET_GROUPS = [
  { id: 'meine', label: 'Meine' },
  { id: 'wir22', label: 'WIR 2022' },
  { id: 'wir26', label: 'WIR 2026' },
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

const model = computed(() =>
  makeModel({
    schwelle: state.schwelle,
    exponent: state.exponent,
    cap: state.cap,
    basis: state.basis,
  })
);

const staticRevenue = computed(() => revenueForYear(bins, model.value, state.year));
const bands = computed(() => revenueByBand(bins, model.value, state.year));
const curve = computed(() => tariffCurve(model.value, state.schwelle, 2e10, 64));
const projection = computed(() => dynamicProjection(cohorts, model.value, state.rendite));
const sustainableRevenue = computed(() => {
  const p = projection.value;
  return p[p.length - 1].revenue;
});
const equilibrium = computed(() => equilibriumWealth(model.value, state.rendite));

function applyPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  state.schwelle = p.schwelle;
  state.exponent = p.exponent;
  state.cap = p.cap;
  state.basis = p.basis;
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
