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

// Voreingestellte Steuermodelle zum Durchprobieren.
export const PRESETS = {
  flach: {
    label: 'Flach',
    desc: 'Fast flacher Satz, 2 % Ø-Satz bei 100 Mio.',
    schwelle: 5e6, exponent: 0.3, cap: 0.5, ankerSatz: 0.02,
  },
  moderat: {
    label: 'Moderat',
    desc: 'Sanft progressiv, 2 % Ø-Satz bei 100 Mio.',
    schwelle: 5e6, exponent: 0.5, cap: 0.5, ankerSatz: 0.02,
  },
  steil: {
    label: 'Stark progressiv',
    desc: 'Steile Kurve, 2 % Ø-Satz bei 100 Mio.',
    schwelle: 5e6, exponent: 0.9, cap: 0.5, ankerSatz: 0.02,
  },
  wir: {
    label: 'World Inequality Lab',
    desc: 'Effektivsätze nach WIR 2022: 0,6 % ab 1 Mio. bis 3,2 % über 100 Mrd.',
    schwelle: 5e6, exponent: 0.15, cap: 0.05, ankerSatz: 0.013,
  },
};

const state = reactive({
  schwelle: d.schwelle,
  exponent: d.exponent,
  cap: d.cap,
  ankerSatz: d.ankerSatz,
  ankerVermoegen: d.ankerVermoegen,
  rendite: d.rendite,
  year: 2022,
  activePreset: 'moderat',
});

const model = computed(() =>
  makeModel({
    schwelle: state.schwelle,
    exponent: state.exponent,
    cap: state.cap,
    ankerVermoegen: state.ankerVermoegen,
    ankerSatz: state.ankerSatz,
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
  state.ankerSatz = p.ankerSatz;
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
