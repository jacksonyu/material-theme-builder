<template>
  <button
    class="color-role-card"
    :style="cardStyle"
    @click="copyColor"
    :title="`点击复制 ${hex}`"
  >
    <span class="role-name">{{ formatRoleName(name) }}</span>
    <span class="role-hex">{{ hex }}</span>
    
    <div v-if="copied" class="copied-indicator">✓</div>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  hex: {
    type: String,
    required: true
  },
  onHex: {
    type: String,
    default: null
  }
})

const copied = ref(false)

const cardStyle = computed(() => {
  const textColor = props.onHex || getContrastColor(props.hex)
  return {
    backgroundColor: props.hex,
    color: textColor
  }
})

function formatRoleName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

function getContrastColor(hex) {
  // 简单的对比色计算
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

async function copyColor() {
  try {
    await navigator.clipboard.writeText(props.hex)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.color-role-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 4px;
  padding: 12px;
  min-height: 72px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  text-align: left;
  transition: transform 0.15s, box-shadow 0.15s;
}

.color-role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.role-name {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.2;
}

.role-hex {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  opacity: 0.7;
  text-transform: uppercase;
}

.copied-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pop 0.2s;
}

@keyframes pop {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>
