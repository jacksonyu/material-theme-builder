<template>
  <div class="palette-preview">
    <h3 class="section-title">Tonal Palettes</h3>
    
    <div class="palette-list">
      <div
        v-for="(palette, name) in palettes"
        :key="name"
        class="palette-row"
      >
        <span class="palette-name">{{ formatName(name) }}</span>
        <div class="tones">
          <button
            v-for="tone in displayedTones"
            :key="tone"
            :style="{ backgroundColor: palette[tone] }"
            :title="`${formatName(name)} ${tone}: ${palette[tone]}`"
            @click="copyColor(palette[tone], `${formatName(name)} ${tone}`)"
            class="tone-swatch"
          >
            <span class="tone-label" :style="{ color: tone >= 50 ? '#000' : '#fff' }">
              {{ tone }}
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="copiedMessage" class="copied-toast">
      {{ copiedMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  palettes: {
    type: Object,
    required: true
  },
  displayedTones: {
    type: Array,
    default: () => [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100]
  }
})

const copiedMessage = ref('')
let copiedTimeout = null

function formatName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

async function copyColor(hex, label) {
  try {
    await navigator.clipboard.writeText(hex)
    copiedMessage.value = `已复制 ${label}: ${hex}`
    
    if (copiedTimeout) clearTimeout(copiedTimeout)
    copiedTimeout = setTimeout(() => {
      copiedMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.palette-preview {
  padding: 16px;
  background: var(--surface-container);
  border-radius: 16px;
  position: relative;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.palette-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.palette-name {
  min-width: 120px;
  font-size: 13px;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.tones {
  display: flex;
  flex: 1;
  gap: 2px;
}

.tone-swatch {
  flex: 1;
  aspect-ratio: 1;
  min-width: 32px;
  max-width: 48px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.tone-swatch:hover {
  transform: scale(1.15);
  z-index: 1;
}

.tone-label {
  font-size: 10px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s;
}

.tone-swatch:hover .tone-label {
  opacity: 1;
}

.copied-toast {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--on-primary);
  background: var(--primary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
