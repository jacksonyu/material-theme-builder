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
      <button
        @click="randomizeColor"
        class="random-btn"
        title="随机颜色"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="random-icon">
          <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
        </svg>
      </button>
    </div>
    
    <div class="preset-group">
      <div class="group-title">经典系列</div>
      <div class="preset-colors">
        <button
          v-for="color in classicColors"
          :key="color.value"
          :style="{ backgroundColor: color.value }"
          :title="color.name"
          :class="{ active: modelValue === color.value }"
          @click="selectPreset(color.value)"
          class="preset-btn"
        />
      </div>
    </div>
    
    <div class="preset-group">
      <div class="group-title">活力系列</div>
      <div class="preset-colors">
        <button
          v-for="color in vibrantColors"
          :key="color.value"
          :style="{ backgroundColor: color.value }"
          :title="color.name"
          :class="{ active: modelValue === color.value }"
          @click="selectPreset(color.value)"
          class="preset-btn"
        />
      </div>
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

const classicColors = [
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

const vibrantColors = [
  { name: 'Neon Pink', value: '#F72585' },
  { name: 'Aurora Purple', value: '#7209B7' },
  { name: 'Electric Blue', value: '#3F37C9' },
  { name: 'Electric Cyan', value: '#4CC9F0' },
  { name: 'Tiffany Teal', value: '#00F5D4' },
  { name: 'Mint Green', value: '#06D6A0' },
  { name: 'Avocado Green', value: '#95D5B2' },
  { name: 'Bright Lime', value: '#AACC00' },
  { name: 'Sunny Yellow', value: '#FFD166' },
  { name: 'Vibrant Orange', value: '#FF9F1C' },
  { name: 'Coral Pink', value: '#FF70A6' },
  { name: 'Rose Red', value: '#FF5A5F' }
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

function randomizeColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
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
  flex-shrink: 0;
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
  min-width: 0;
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

.preset-group {
  margin-bottom: 16px;
}

.preset-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 11px;
  font-weight: 500;
  color: var(--on-surface-variant);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
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

.random-btn {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container-high);
  border: 2px solid var(--outline-variant);
  border-radius: 12px;
  cursor: pointer;
  color: var(--on-surface-variant);
  transition: all 0.2s;
}

.random-btn:hover {
  background: var(--surface-container-highest);
  color: var(--primary);
  border-color: var(--primary);
}

.random-btn:active {
  transform: scale(0.95);
}

.random-icon {
  width: 24px;
  height: 24px;
}
</style>
