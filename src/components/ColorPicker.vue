<template>
  <div class="color-picker">
    <h3 class="section-title">Source Color</h3>
    
    <div class="picker-row">
      <input
        type="color"
        :value="modelValue"
        @input="handleColorInput"
        class="native-picker"
      />
      <input
        type="text"
        :value="modelValue"
        @input="handleHexInput"
        @blur="validateHex"
        class="hex-input"
        placeholder="#6750A4"
        maxlength="7"
      />
    </div>
    
    <div class="preset-colors">
      <button
        v-for="color in presetColors"
        :key="color.value"
        :style="{ backgroundColor: color.value }"
        :title="color.name"
        :class="{ active: modelValue === color.value }"
        @click="selectPreset(color.value)"
        class="preset-btn"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isValidHex } from '../services/color-service'

const props = defineProps({
  modelValue: {
    type: String,
    default: '#6750A4'
  }
})

const emit = defineEmits(['update:modelValue'])

const presetColors = [
  { name: 'Material Purple', value: '#6750A4' },
  { name: 'Blue', value: '#0061A4' },
  { name: 'Teal', value: '#006A6A' },
  { name: 'Green', value: '#386A20' },
  { name: 'Yellow', value: '#695F00' },
  { name: 'Orange', value: '#8B5000' },
  { name: 'Red', value: '#BA1A1A' },
  { name: 'Pink', value: '#984061' },
  { name: 'Deep Purple', value: '#5B4EA8' },
  { name: 'Indigo', value: '#4355B9' },
  { name: 'Cyan', value: '#006874' },
  { name: 'Brown', value: '#6D5E4B' }
]

function handleColorInput(e) {
  emit('update:modelValue', e.target.value.toUpperCase())
}

function handleHexInput(e) {
  let value = e.target.value.toUpperCase()
  if (!value.startsWith('#')) {
    value = '#' + value
  }
  emit('update:modelValue', value)
}

function validateHex(e) {
  if (!isValidHex(props.modelValue)) {
    emit('update:modelValue', '#6750A4')
  }
}

function selectPreset(color) {
  emit('update:modelValue', color)
}
</script>

<style scoped>
.color-picker {
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

.picker-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.native-picker {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  padding: 0;
  background: transparent;
}

.native-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.native-picker::-webkit-color-swatch {
  border: 2px solid var(--outline);
  border-radius: 12px;
}

.hex-input {
  flex: 1;
  height: 56px;
  padding: 0 16px;
  font-size: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  color: var(--on-surface);
  background: var(--surface-container-high);
  border: 2px solid var(--outline-variant);
  border-radius: 12px;
  text-transform: uppercase;
  transition: border-color 0.2s;
}

.hex-input:focus {
  outline: none;
  border-color: var(--primary);
}

.preset-colors {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.preset-btn {
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  transform: scale(1.1);
}

.preset-btn.active {
  border-color: var(--on-surface);
  box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--primary);
}
</style>
