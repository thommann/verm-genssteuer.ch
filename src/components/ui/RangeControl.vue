<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 1 },
  label: { type: String, required: true },
  display: { type: String, default: '' },
  hint: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue']);

const onInput = (e) => emit('update:modelValue', Number(e.target.value));
</script>

<template>
  <div class="range">
    <div class="range-head">
      <label>{{ label }}</label>
      <span class="range-display tnum">{{ display }}</span>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="onInput"
    />
    <p v-if="hint" class="range-hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.range { margin-bottom: 18px; }
.range-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
label { font-weight: 600; font-size: 0.92rem; }
.range-display { color: var(--gold); font-weight: 700; font-size: 0.95rem; }
.range-hint { color: var(--text-mute); font-size: 0.78rem; margin: 6px 0 0; }

input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--gold));
  outline: none;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: #fff;
  border: 3px solid var(--accent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
input[type='range']::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%;
  background: #fff; border: 3px solid var(--accent); cursor: pointer;
}
</style>
