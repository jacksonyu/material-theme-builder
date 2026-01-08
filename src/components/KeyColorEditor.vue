<template>
  <div class="key-color-editor">
    <h3 class="section-title">关键色自定义</h3>
    <p class="section-desc">使用高保真策略生成色板</p>
    
    <div class="color-list">
      <div v-for="item in keyColors" :key="item.key" class="color-item">
        <div class="color-info">
          <span class="color-name">{{ item.label }}</span>
          <span v-if="hasOverride(item.key)" class="color-value">{{ overrides[item.key] }}</span>
          <span v-else class="color-placeholder">自动计算</span>
        </div>
        
        <div class="color-actions">
          <div 
            v-if="hasOverride(item.key)" 
            class="color-preview"
            :style="{ backgroundColor: overrides[item.key] }"
          ></div>
          
          <label class="color-picker-label">
            <input
              type="color"
              class="color-input"
              :value="overrides[item.key] || '#808080'"
              @input="handleColorChange(item.key, $event)"
            />
            <span class="pick-btn">{{ hasOverride(item.key) ? '修改' : '指定' }}</span>
          </label>
          
          <button
            v-if="hasOverride(item.key)"
            class="clear-btn"
            @click="clearOverride(item.key)"
            title="恢复自动计算"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    
    <button 
      v-if="hasAnyOverride" 
      class="clear-all-btn"
      @click="clearAll"
    >
      清除所有自定义
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KeyColorOverrides } from '../services/color-service'

const props = defineProps<{
  modelValue: KeyColorOverrides
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: KeyColorOverrides): void
  (e: 'set', key: keyof KeyColorOverrides, value: string | null): void
}>()

const keyColors = [
  { key: 'primary' as const, label: 'Primary' },
  { key: 'secondary' as const, label: 'Secondary' },
  { key: 'tertiary' as const, label: 'Tertiary' },
  { key: 'neutral' as const, label: 'Neutral' },
  { key: 'neutralVariant' as const, label: 'Neutral Variant' },
  { key: 'error' as const, label: 'Error' }
]

const overrides = computed(() => props.modelValue)

const hasAnyOverride = computed(() => {
  return Object.keys(props.modelValue).length > 0
})

function hasOverride(key: keyof KeyColorOverrides): boolean {
  return !!props.modelValue[key]
}

function handleColorChange(key: keyof KeyColorOverrides, event: Event) {
  const target = event.target as HTMLInputElement
  emit('set', key, target.value)
}

function clearOverride(key: keyof KeyColorOverrides) {
  emit('set', key, null)
}

function clearAll() {
  emit('update:modelValue', {})
}
</script>

<style scoped>
.key-color-editor {
  padding: 16px;
  background: var(--surface-container);
  border-radius: 16px;
}

.section-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-desc {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: var(--on-surface-variant);
}

.color-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--surface-container-high);
  border-radius: 8px;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.color-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--on-surface);
}

.color-value {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--on-surface-variant);
}

.color-placeholder {
  font-size: 11px;
  color: var(--on-surface-variant);
  opacity: 0.6;
  font-style: italic;
}

.color-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--outline-variant);
}

.color-picker-label {
  position: relative;
  cursor: pointer;
}

.color-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  cursor: pointer;
}

.pick-btn {
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: var(--on-surface-variant);
  background: var(--surface-container-highest);
  border-radius: 6px;
  transition: all 0.2s;
}

.pick-btn:hover {
  background: var(--primary-container);
  color: var(--on-primary-container);
}

.clear-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--on-surface-variant);
  background: transparent;
  border: 1px solid var(--outline-variant);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--error-container);
  border-color: var(--error);
  color: var(--on-error-container);
}

.clear-all-btn {
  margin-top: 12px;
  width: 100%;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--on-surface-variant);
  background: var(--surface-container-high);
  border: 1px dashed var(--outline-variant);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: var(--error-container);
  border-color: var(--error);
  color: var(--on-error-container);
}
</style>
