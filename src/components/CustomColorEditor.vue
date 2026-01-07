<template>
  <div class="custom-color-editor">
    <div class="editor-header">
      <h3 class="section-title">Custom Colors</h3>
      <button class="add-btn" @click="showAddForm = true" v-if="!showAddForm">
        <span>+</span> Add Color
      </button>
    </div>
    
    <!-- 添加表单 -->
    <div v-if="showAddForm" class="add-form">
      <input
        v-model="newColor.name"
        type="text"
        placeholder="Color Name"
        class="name-input"
      />
      <div class="color-input-row">
        <input
          type="color"
          v-model="newColor.value"
          class="mini-picker"
        />
        <input
          v-model="newColor.value"
          type="text"
          placeholder="#000000"
          class="hex-input"
        />
      </div>
      <label class="harmonize-toggle">
        <input
          type="checkbox"
          v-model="newColor.harmonize"
        />
        <span>与源颜色协调</span>
      </label>
      <div class="form-actions">
        <button class="cancel-btn" @click="cancelAdd">取消</button>
        <button class="confirm-btn" @click="confirmAdd" :disabled="!isValidNewColor">添加</button>
      </div>
    </div>
    
    <!-- 颜色列表 -->
    <div class="color-list" v-if="customColors.length > 0">
      <div
        v-for="color in customColors"
        :key="color.id"
        class="color-item"
      >
        <div class="color-preview" :style="{ backgroundColor: color.value }"></div>
        <div class="color-info">
          <span class="color-name">{{ color.name }}</span>
          <span class="color-hex">{{ color.value }}</span>
        </div>
        <div class="color-badges">
          <span v-if="color.harmonize" class="badge harmonized">协调</span>
        </div>
        <button class="remove-btn" @click="$emit('remove', color.id)">×</button>
      </div>
    </div>
    
    <p v-else-if="!showAddForm" class="empty-hint">
      添加自定义颜色来扩展您的主题调色板
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isValidHex } from '../services/color-service'

const props = defineProps({
  customColors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add', 'remove'])

const showAddForm = ref(false)

const newColor = ref({
  name: '',
  value: '#FF5722',
  harmonize: true
})

const isValidNewColor = computed(() => {
  return newColor.value.name.trim() && isValidHex(newColor.value.value)
})

function cancelAdd() {
  showAddForm.value = false
  resetForm()
}

function confirmAdd() {
  if (isValidNewColor.value) {
    emit('add', newColor.value.name, newColor.value.value, newColor.value.harmonize)
    showAddForm.value = false
    resetForm()
  }
}

function resetForm() {
  newColor.value = {
    name: '',
    value: '#FF5722',
    harmonize: true
  }
}
</script>

<style scoped>
.custom-color-editor {
  padding: 16px;
  background: var(--surface-container);
  border-radius: 16px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--on-primary);
  background: var(--primary);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  filter: brightness(1.1);
}

.add-btn span {
  font-size: 16px;
  font-weight: 700;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--surface-container-high);
  border-radius: 12px;
  margin-bottom: 16px;
}

.name-input,
.hex-input {
  padding: 12px;
  font-size: 14px;
  color: var(--on-surface);
  background: var(--surface-container-highest);
  border: 2px solid var(--outline-variant);
  border-radius: 8px;
}

.name-input:focus,
.hex-input:focus {
  outline: none;
  border-color: var(--primary);
}

.color-input-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.mini-picker {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
}

.mini-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.mini-picker::-webkit-color-swatch {
  border: 2px solid var(--outline);
  border-radius: 8px;
}

.hex-input {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.harmonize-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--on-surface-variant);
  cursor: pointer;
}

.harmonize-toggle input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  color: var(--on-surface-variant);
  background: var(--surface-container);
}

.cancel-btn:hover {
  background: var(--surface-container-highest);
}

.confirm-btn {
  color: var(--on-primary);
  background: var(--primary);
}

.confirm-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--surface-container-high);
  border-radius: 12px;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid var(--outline-variant);
}

.color-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.color-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
}

.color-hex {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--on-surface-variant);
  text-transform: uppercase;
}

.color-badges {
  display: flex;
  gap: 4px;
}

.badge {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
}

.badge.harmonized {
  color: var(--on-tertiary-container);
  background: var(--tertiary-container);
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--on-surface-variant);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  color: var(--error);
  background: var(--error-container);
}

.empty-hint {
  margin: 0;
  padding: 24px;
  font-size: 13px;
  color: var(--on-surface-variant);
  text-align: center;
  background: var(--surface-container-high);
  border-radius: 12px;
  border: 2px dashed var(--outline-variant);
}
</style>
