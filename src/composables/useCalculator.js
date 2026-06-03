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
  moderat: {
    label: 'Moderat',
    desc: '2 % Ø-Satz ab 100 Mio., Freibetrag 5 Mio.',
    schwelle: 5e6, exponent: 0.9, cap: 1, ankerSatz: 0.02,
  },
  sanft: {
    label: 'Sanft',
    desc: 'Fast flacher Satz, ~0,8 % ab 100 Mio.',
    schwelle: 5e6, exponent: 0.45, cap: 1, ankerSatz: 0.008,
  },
  steil: {
    label: 'Stark progressiv',
    desc: 'Steile Kurve, 3,5 % ab 100 Mio.',
    schwelle: 5e6, exponent: 1.2, cap: 1, ankerSatz: 0.035,
  },
  millionaere: {
    label: 'Ab 1 % (≈ 5 Mio.)',
    desc: 'Nur das reichste Prozent, moderat.',
    schwelle: 5e6, exponent: 0.9, cap: 1, ankerSatz: 0.02,
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
