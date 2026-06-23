<template>
  <div class="tone-override-panel">
    <h3 class="section-title">Color Role Tone 改写</h3>
    <p class="section-desc">手动覆盖特定 Role 的 Tone 值</p>
    
    <!-- 风险警告 -->
    <div class="warning-box">
      <div class="warning-icon">⚠️</div>
      <div class="warning-content">
        <strong>高风险操作</strong>
        <p>手动改写 Tone 值可能破坏 MD3 的对比度保障和语义一致性。仅在明确知道自己在"破坏规则"时使用。</p>
      </div>
    </div>
    
    <!-- 模式切换 -->
    <div class="mode-tabs">
      <button 
        :class="['mode-tab', { active: activeMode === 'light' }]"
        @click="activeMode = 'light'"
      >
        Light Mode
        <span v-if="lightOverridesCount > 0" class="count-badge">{{ lightOverridesCount }}</span>
      </button>
      <button 
        :class="['mode-tab', { active: activeMode === 'dark' }]"
        @click="activeMode = 'dark'"
      >
        Dark Mode
        <span v-if="darkOverridesCount > 0" class="count-badge">{{ darkOverridesCount }}</span>
      </button>
    </div>
    
    <!-- 已配置的改写列表 -->
    <div v-if="currentOverrides.length > 0" class="overrides-list">
      <div 
        v-for="override in currentOverrides" 
        :key="override.role"
        class="override-item"
      >
        <div class="override-info">
          <span class="role-name">{{ override.role }}</span>
          <span class="tone-value">Tone {{ override.tone }}</span>
        </div>
        <div class="override-actions">
          <input
            type="range"
            class="tone-slider"
            :value="override.tone"
            min="0"
            max="100"
            step="1"
            @input="updateOverride(override.role, Number(($event.target as HTMLInputElement).value))"
          />
          <button
            class="remove-btn"
            @click="removeOverride(override.role)"
            title="移除改写"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      当前 {{ activeMode === 'light' ? '亮色' : '暗色' }} 模式无改写配置
    </div>
    
    <!-- 添加新改写 -->
    <div class="add-override-form">
      <h4 class="form-title">添加改写</h4>
      
      <div class="form-row">
        <label class="form-label">Color Role</label>
        <select v-model="newRole" class="role-select">
          <option value="">选择 Role...</option>
          <optgroup label="Primary">
            <option v-for="role in primaryRoles" :key="role" :value="role">{{ role }}</option>
          </optgroup>
          <optgroup label="Secondary">
            <option v-for="role in secondaryRoles" :key="role" :value="role">{{ role }}</option>
          </optgroup>
          <optgroup label="Tertiary">
            <option v-for="role in tertiaryRoles" :key="role" :value="role">{{ role }}</option>
          </optgroup>
          <optgroup label="Error">
            <option v-for="role in errorRoles" :key="role" :value="role">{{ role }}</option>
          </optgroup>
          <optgroup label="Surface & Neutral">
            <option v-for="role in surfaceRoles" :key="role" :value="role">{{ role }}</option>
          </optgroup>
          <optgroup label="Others">
            <option v-for="role in otherRoles" :key="role" :value="role">{{ role }}</option>
          </optgroup>
          <optgroup v-if="customColorRoles.length > 0" label="自定义颜色">
            <option v-for="role in customColorRoles" :key="role" :value="role">{{ role }}</option>
          </optgroup>
        </select>
      </div>
      
      <div class="form-row">
        <label class="form-label">Tone 值 (0-100)</label>
        <div class="tone-input-row">
          <input
            type="range"
            v-model.number="newTone"
            min="0"
            max="100"
            step="1"
            class="tone-slider"
          />
          <input
            type="number"
            v-model.number="newTone"
            min="0"
            max="100"
            class="tone-number"
          />
        </div>
      </div>
      
      <button 
        class="add-btn"
        :disabled="!newRole"
        @click="addOverride"
      >
        添加改写
      </button>
    </div>
    
    <!-- 清除所有 -->
    <button 
      v-if="hasAnyOverride"
      class="clear-all-btn"
      @click="clearAll"
    >
      清除所有改写
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ALL_COLOR_ROLES, type ToneOverrides } from '../services/color-service'

const props = defineProps<{
  modelValue: ToneOverrides
  customColors?: Array<{ name: string }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ToneOverrides): void
  (e: 'add', mode: 'light' | 'dark', role: string, tone: number): void
  (e: 'remove', mode: 'light' | 'dark', role: string): void
  (e: 'update', mode: 'light' | 'dark', role: string, tone: number): void
}>()

// UI 状态
const activeMode = ref<'light' | 'dark'>('light')
const newRole = ref('')
const newTone = ref(50)

// Role 分组
const primaryRoles = ALL_COLOR_ROLES.filter(r => r.startsWith('primary') || r === 'inversePrimary' || r.startsWith('onPrimary'))
const secondaryRoles = ALL_COLOR_ROLES.filter(r => r.startsWith('secondary') || r.startsWith('onSecondary'))
const tertiaryRoles = ALL_COLOR_ROLES.filter(r => r.startsWith('tertiary') || r.startsWith('onTertiary'))
const errorRoles = ALL_COLOR_ROLES.filter(r => r.startsWith('error') || r.startsWith('onError'))
const surfaceRoles = ALL_COLOR_ROLES.filter(r => 
  r.startsWith('surface') || r.startsWith('onSurface') || 
  r === 'background' || r === 'onBackground'
)
const otherRoles = ALL_COLOR_ROLES.filter(r => 
  r.startsWith('outline') || r.startsWith('inverse') || 
  r === 'shadow' || r === 'scrim'
)

// 自定义颜色 Role
const customColorRoles = computed(() => {
  if (!props.customColors) return []
  const roles: string[] = []
  for (const color of props.customColors) {
    const baseName = color.name.toLowerCase().replace(/\s+/g, '')
    roles.push(
      baseName,
      `on${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`,
      `${baseName}Container`,
      `on${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Container`
    )
  }
  return roles
})

// 计算属性
const currentOverrides = computed(() => {
  return activeMode.value === 'light' 
    ? props.modelValue.light 
    : props.modelValue.dark
})

const lightOverridesCount = computed(() => props.modelValue.light.length)
const darkOverridesCount = computed(() => props.modelValue.dark.length)
const hasAnyOverride = computed(() => 
  props.modelValue.light.length > 0 || props.modelValue.dark.length > 0
)

// 方法
function addOverride() {
  if (!newRole.value) return
  emit('add', activeMode.value, newRole.value, newTone.value)
  newRole.value = ''
  newTone.value = 50
}

function removeOverride(role: string) {
  emit('remove', activeMode.value, role)
}

function updateOverride(role: string, tone: number) {
  emit('update', activeMode.value, role, tone)
}

function clearAll() {
  emit('update:modelValue', { light: [], dark: [] })
}
</script>

<style scoped>
.tone-override-panel {
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

/* 警告框 */
.warning-box {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--error-container);
  border-radius: 12px;
  margin-bottom: 16px;
}

.warning-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-content strong {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--on-error-container);
  margin-bottom: 4px;
}

.warning-content p {
  margin: 0;
  font-size: 11px;
  color: var(--on-error-container);
  opacity: 0.9;
  line-height: 1.4;
}

/* 模式切换 */
.mode-tabs {
  display: flex;
  background: var(--surface-container-highest);
  border-radius: 8px;
  padding: 2px;
  margin-bottom: 12px;
}

.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--on-surface-variant);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-tab.active {
  background: var(--surface);
  color: var(--on-surface);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 600;
  background: var(--primary);
  color: var(--on-primary);
  border-radius: 9px;
}

/* 改写列表 */
.overrides-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.override-item {
  padding: 10px 12px;
  background: var(--surface-container-high);
  border-radius: 8px;
}

.override-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.role-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--on-surface);
}

.tone-value {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--on-surface-variant);
}

.override-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tone-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: var(--outline-variant);
  border-radius: 2px;
  cursor: pointer;
}

.tone-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--surface);
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.remove-btn {
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

.remove-btn:hover {
  background: var(--error-container);
  border-color: var(--error);
  color: var(--on-error-container);
}

/* 空状态 */
.empty-state {
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--on-surface-variant);
  opacity: 0.7;
  background: var(--surface-container-high);
  border-radius: 8px;
  margin-bottom: 16px;
}

/* 添加表单 */
.add-override-form {
  padding: 12px;
  background: var(--surface-container-high);
  border-radius: 12px;
  border: 1px dashed var(--outline-variant);
}

.form-title {
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--on-surface);
}

.form-row {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 11px;
  color: var(--on-surface-variant);
  margin-bottom: 6px;
}

.role-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--on-surface);
  background: var(--surface);
  border: 1px solid var(--outline-variant);
  border-radius: 8px;
  cursor: pointer;
}

.role-select:focus {
  outline: none;
  border-color: var(--primary);
}

.tone-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tone-number {
  width: 60px;
  padding: 6px 8px;
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--on-surface);
  background: var(--surface);
  border: 1px solid var(--outline-variant);
  border-radius: 6px;
  text-align: center;
}

.tone-number:focus {
  outline: none;
  border-color: var(--primary);
}

.add-btn {
  width: 100%;
  padding: 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--on-primary);
  background: var(--primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-btn:not(:disabled):hover {
  opacity: 0.9;
}

/* 清除所有 */
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
