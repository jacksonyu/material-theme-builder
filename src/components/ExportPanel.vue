<template>
  <div class="export-panel">
    <h3 class="section-title">Export Theme</h3>
    
    <p class="format-note">官方 Material Theme Builder 格式</p>
    
    <!-- JSON 预览 -->
    <div class="json-preview">
      <div class="preview-header">
        <span class="preview-label">JSON 预览</span>
        <span class="preview-size">{{ formatSize(jsonOutput.length) }}</span>
      </div>
      <pre class="json-content">{{ jsonPreview }}</pre>
    </div>
    
    <!-- 导出按钮 -->
    <div class="export-actions">
      <button class="action-btn copy-btn" @click="copyToClipboard">
        <span class="btn-icon">📋</span>
        <span>复制到剪贴板</span>
      </button>
      <button class="action-btn download-btn" @click="downloadFile">
        <span class="btn-icon">💾</span>
        <span>下载 JSON</span>
      </button>
    </div>
    
    <!-- 复制成功提示 -->
    <div v-if="showCopied" class="copied-toast">
      已复制到剪贴板
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  theme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['copy', 'download'])

const { exportThemeOfficial } = useTheme()

const showCopied = ref(false)

// 生成官方格式 JSON 输出
const jsonOutput = computed(() => {
  return exportThemeOfficial()
})

// 预览（截断）
const jsonPreview = computed(() => {
  const lines = jsonOutput.value.split('\n')
  if (lines.length > 30) {
    return lines.slice(0, 30).join('\n') + '\n    ...\n}'
  }
  return jsonOutput.value
})

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(jsonOutput.value)
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
    emit('copy')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

function downloadFile() {
  const blob = new Blob([jsonOutput.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'material-theme.json'
  a.click()
  URL.revokeObjectURL(url)
  emit('download')
}
</script>

<style scoped>
.export-panel {
  padding: 16px;
  background: var(--surface-container);
  border-radius: 16px;
  position: relative;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.format-note {
  margin: 0 0 16px 0;
  font-size: 12px;
  color: var(--on-surface-variant);
}

.json-preview {
  background: var(--surface-container-highest);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--surface-container-high);
  border-bottom: 1px solid var(--outline-variant);
}

.preview-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.preview-size {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--on-surface-variant);
}

.json-content {
  margin: 0;
  padding: 14px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--on-surface);
  line-height: 1.5;
  max-height: 240px;
  overflow-y: auto;
  white-space: pre;
}

.export-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn {
  color: var(--on-surface);
  background: var(--surface-container-high);
  border: 2px solid var(--outline-variant);
}

.copy-btn:hover {
  background: var(--surface-container-highest);
  border-color: var(--outline);
}

.download-btn {
  color: var(--on-primary);
  background: var(--primary);
}

.download-btn:hover {
  filter: brightness(1.1);
}

.btn-icon {
  font-size: 16px;
}

.copied-toast {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--on-primary);
  background: var(--primary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.2s;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
