<template>
  <div class="platform-selector">
    <h3 class="section-title">Platform</h3>
    
    <div class="platform-buttons">
      <button
        v-for="platform in platforms"
        :key="platform.id"
        :class="['platform-btn', { active: modelValue === platform.id }]"
        @click="selectPlatform(platform.id)"
      >
        <span class="platform-icon">{{ platform.icon }}</span>
        <div class="platform-info">
          <span class="platform-name">{{ platform.name }}</span>
          <span class="platform-desc">{{ platform.description }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const platforms = [
  {
    id: 'phone',
    name: 'Phone',
    icon: '📱',
    description: '适用于手机及平板设备'
  },
  {
    id: 'watch',
    name: 'Watch',
    icon: '⌚',
    description: '适用于智能手表等微型设备'
  }
]

function selectPlatform(id) {
  emit('update:modelValue', id)
}
</script>

<style scoped>
.platform-selector {
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

.platform-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.platform-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  text-align: left;
  background: var(--surface-container-high);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.platform-btn:hover {
  background: var(--surface-container-highest);
}

.platform-btn.active {
  background: var(--primary-container);
  border-color: var(--primary);
}

.platform-icon {
  font-size: 20px;
}

.platform-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.platform-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--on-surface);
}

.platform-btn.active .platform-name {
  color: var(--on-primary-container);
}

.platform-desc {
  font-size: 11px;
  color: var(--on-surface-variant);
  line-height: 1.3;
}

.platform-btn.active .platform-desc {
  color: var(--on-primary-container);
  opacity: 0.8;
}
</style>
