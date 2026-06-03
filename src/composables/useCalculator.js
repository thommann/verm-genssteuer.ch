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
  // WIR 2022: exakte Grenzsatz-Staffel je Vermögensband (Tabelle 7.2). Freibetrag 5 Mio.
  // wie auf der ganzen Seite (Original ab 1 Mio.); das 5–10-Mio-Band trägt den 1-%-Satz.
  wir2022_1: {
    label: 'moderat', group: 'wir22', kind: 'brackets',
    desc: 'WIR 2022, Szenario 1 (moderat): exakte Grenzsätze 1 → 3,5 % über 100 Mrd.',
    brackets: [
      { from: 5e6, rate: 0.01 }, { from: 1e7, rate: 0.015 }, { from: 1e8, rate: 0.02 },
      { from: 1e9, rate: 0.025 }, { from: 1e10, rate: 0.03 }, { from: 1e11, rate: 0.035 },
    ],
  },
  wir2022_2: {
    label: 'hoch', group: 'wir22', kind: 'brackets',
    desc: 'WIR 2022, Szenario 2 (hoch): exakte Grenzsätze 1 → 10 % über 100 Mrd.',
    brackets: [
      { from: 5e6, rate: 0.01 }, { from: 1e7, rate: 0.015 }, { from: 1e8, rate: 0.03 },
      { from: 1e9, rate: 0.05 }, { from: 1e10, rate: 0.07 }, { from: 1e11, rate: 0.10 },
    ],
  },
  wir2022_3: {
    label: 'sehr hoch', group: 'wir22', kind: 'brackets',
    desc: 'WIR 2022, Szenario 3 (sehr hoch): exakte Grenzsätze 1 → 90 % über 100 Mrd.',
    brackets: [
      { from: 5e6, rate: 0.01 }, { from: 1e7, rate: 0.015 }, { from: 1e8, rate: 0.07 },
      { from: 1e9, rate: 0.15 }, { from: 1e10, rate: 0.50 }, { from: 1e11, rate: 0.90 },
    ],
  },
  // WIR 2026: Mindeststeuer auf das Gesamtvermögen ab 100 Mio. $ (Centi-Millionäre).
  wir2026_2: {
    label: '2 %', group: 'wir26', kind: 'mintax',
    desc: 'WIR 2026: Mindeststeuer 2 % des Vermögens ab 100 Mio. $.',
    threshold: 1e8, rate: 0.02,
  },
  wir2026_3: {
    label: '3 %', group: 'wir26', kind: 'mintax',
    desc: 'WIR 2026: Mindeststeuer 3 % des Vermögens ab 100 Mio. $.',
    threshold: 1e8, rate: 0.03,
  },
  wir2026_5: {
    label: '5 %', group: 'wir26', kind: 'mintax',
    desc: 'WIR 2026: Mindeststeuer 5 % des Vermögens ab 100 Mio. $.',
    threshold: 1e8, rate: 0.05,
  },
};

// Anzeige-Gruppen der Preset-Leiste (in Reihenfolge der Zeilen).
export const PRESET_GROUPS = [
  { id: 'meine', label: 'Unsere' },
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
  // exaktes Modell (Bänder bzw. Mindeststeuer) – die Regler bleiben dabei unverändert.
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
