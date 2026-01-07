<template>
  <div class="variant-selector">
    <h3 class="section-title">Scheme Variant</h3>
    
    <div class="variant-grid">
      <button
        v-for="(info, key) in variantInfo"
        :key="key"
        :class="['variant-btn', { active: modelValue === key }]"
        @click="selectVariant(key)"
      >
        <span class="variant-name">{{ info.name }}</span>
        <span class="variant-desc">{{ info.description }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { SCHEME_VARIANT_INFO } from '../services/color-service'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const variantInfo = SCHEME_VARIANT_INFO

function selectVariant(key) {
  emit('update:modelValue', key)
}
</script>

<style scoped>
.variant-selector {
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

.variant-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.variant-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px 14px;
  text-align: left;
  background: var(--surface-container-high);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.variant-btn:hover {
  background: var(--surface-container-highest);
}

.variant-btn.active {
  background: var(--primary-container);
  border-color: var(--primary);
}

.variant-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--on-surface);
}

.variant-btn.active .variant-name {
  color: var(--on-primary-container);
}

.variant-desc {
  font-size: 12px;
  color: var(--on-surface-variant);
  line-height: 1.3;
}

.variant-btn.active .variant-desc {
  color: var(--on-primary-container);
  opacity: 0.8;
}
</style>
