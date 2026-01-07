<template>
  <div class="contrast-slider">
    <h3 class="section-title">Contrast Level</h3>
    
    <div class="slider-container">
      <input
        type="range"
        :value="modelValue"
        @input="handleSliderInput"
        min="-1"
        max="1"
        step="0.1"
        class="slider"
      />
      <span class="slider-value">{{ formattedValue }}</span>
    </div>
    
    <div class="preset-buttons">
      <button
        v-for="preset in presets"
        :key="preset.value"
        :class="{ active: isActive(preset.value) }"
        @click="selectPreset(preset.value)"
        class="preset-btn"
      >
        {{ preset.label }}
      </button>
    </div>
    
    <p class="contrast-description">{{ currentDescription }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const presets = [
  { label: 'Low', value: -0.5 },
  { label: 'Standard', value: 0 },
  { label: 'Medium', value: 0.5 },
  { label: 'High', value: 1 }
]

const formattedValue = computed(() => {
  const v = props.modelValue
  if (v === 0) return '0'
  return v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)
})

const currentDescription = computed(() => {
  const v = props.modelValue
  if (v <= -0.5) return '低对比度，更柔和的视觉效果'
  if (v < 0.25) return '标准对比度，平衡的可读性与美观'
  if (v < 0.75) return '中等对比度，增强可读性'
  return '高对比度，最大化可访问性'
})

function isActive(presetValue) {
  return Math.abs(props.modelValue - presetValue) < 0.1
}

function handleSliderInput(e) {
  emit('update:modelValue', parseFloat(e.target.value))
}

function selectPreset(value) {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.contrast-slider {
  padding: 16px;
  background: var(--surface-container);
  border-radius: 16px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(
    to right,
    var(--surface-container-highest),
    var(--primary),
    var(--primary)
  );
  border-radius: 4px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: var(--primary);
  border: 3px solid var(--on-primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.slider-value {
  min-width: 48px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary);
  text-align: right;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.preset-btn {
  flex: 1;
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--on-surface-variant);
  background: var(--surface-container-high);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: var(--surface-container-highest);
}

.preset-btn.active {
  color: var(--on-primary);
  background: var(--primary);
  border-color: var(--primary);
}

.contrast-description {
  margin: 0;
  font-size: 13px;
  color: var(--on-surface-variant);
  line-height: 1.4;
}
</style>
