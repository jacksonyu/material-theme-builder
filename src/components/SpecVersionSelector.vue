<template>
  <div class="spec-version-selector">
    <h3 class="section-title">Spec Version</h3>
    
    <div class="version-buttons">
      <button
        v-for="(info, key) in versionInfo"
        :key="key"
        :class="['version-btn', { active: modelValue === key }]"
        @click="selectVersion(key)"
      >
        <span class="version-name">{{ info.name }}</span>
        <span class="version-desc">{{ info.description }}</span>
      </button>
    </div>
    
    <p v-if="modelValue === 'spec2025' && showLowContrastWarning" class="warning-text">
      ⚠️ Spec 2025 不支持低对比度（&lt; 0），将自动调整为标准对比度
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SPEC_VERSION_INFO } from '../services/color-service'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  contrastLevel: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const versionInfo = SPEC_VERSION_INFO

const showLowContrastWarning = computed(() => {
  return props.contrastLevel < 0
})

function selectVersion(key) {
  emit('update:modelValue', key)
}
</script>

<style scoped>
.spec-version-selector {
  padding: 16px;
  background: var(--surface-container);
  border-radius: 16px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.version-buttons {
  display: flex;
  gap: 8px;
}

.version-btn {
  flex: 1;
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

.version-btn:hover {
  background: var(--surface-container-highest);
}

.version-btn.active {
  background: var(--primary-container);
  border-color: var(--primary);
}

.version-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--on-surface);
}

.version-btn.active .version-name {
  color: var(--on-primary-container);
}

.version-desc {
  font-size: 11px;
  color: var(--on-surface-variant);
  line-height: 1.3;
}

.version-btn.active .version-desc {
  color: var(--on-primary-container);
  opacity: 0.8;
}

.warning-text {
  margin: 12px 0 0 0;
  padding: 10px 12px;
  font-size: 12px;
  color: var(--on-error-container);
  background: var(--error-container);
  border-radius: 8px;
  line-height: 1.4;
}
</style>
