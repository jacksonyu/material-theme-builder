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

    <!-- 分割线 & 导入部分 -->
    <div class="divider"></div>
    
    <div class="import-section">
      <h3 class="section-title">Import Theme</h3>
      <p class="format-note">选择导出的 JSON 文件恢复编辑状态</p>
      
      <div class="import-actions">
        <label class="action-btn import-btn">
          <span class="btn-icon">📥</span>
          <span>导入 JSON 文件</span>
          <input type="file" accept=".json" class="file-input" @change="handleImportFile" />
        </label>
      </div>
      
      <!-- 导入消息提示 -->
      <div v-if="importMessage" class="import-message" :class="importMessageType">
        {{ importMessage }}
      </div>
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

const { exportThemeOfficial, importTheme } = useTheme()

const showCopied = ref(false)
const importMessage = ref('')
const importMessageType = ref('')

function handleImportFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result
    if (typeof content !== 'string') return
    
    const res = importTheme(content)
    if (res.success) {
      importMessage.value = '主题导入成功！'
      importMessageType.value = 'success'
      setTimeout(() => {
        importMessage.value = ''
      }, 3000)
    } else {
      importMessage.value = `导入失败: ${res.error}`
      importMessageType.value = 'error'
    }
  }
  reader.onerror = () => {
    importMessage.value = '读取文件失败'
    importMessageType.value = 'error'
  }
  reader.readAsText(file)
  
  // 重置 value 使得相同文件可以再次触发
  event.target.value = ''
}

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

.divider {
  height: 1px;
  background: var(--outline-variant);
  margin: 24px 0;
}

.import-section {
  display: flex;
  flex-direction: column;
}

.file-input {
  display: none;
}

.import-btn {
  color: var(--on-surface);
  background: var(--surface-container-high);
  border: 2px solid var(--outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.import-btn:hover {
  background: var(--surface-container-highest);
  border-color: var(--outline);
}

.import-message {
  margin-top: 12px;
  padding: 10px 14px;
  font-size: 13px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.import-message.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.import-message.error {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}
</style>
