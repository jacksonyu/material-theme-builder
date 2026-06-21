<template>
  <div class="theme-preview">
    <div class="preview-header">
      <h3 class="section-title">Color Roles</h3>
      <button class="mode-toggle" @click="$emit('toggleMode')">
        <span class="mode-icon">{{ isDark ? '🌙' : '☀️' }}</span>
        <span>{{ isDark ? 'Dark' : 'Light' }}</span>
      </button>
    </div>
    
    <div class="color-groups">
      <!-- 标准颜色分组 -->
      <div v-for="group in colorGroups" :key="group.title" class="color-group">
        <h4 class="group-title">{{ group.title }}</h4>
        <div class="role-grid">
          <ColorRoleCard
            v-for="roleItem in group.roles"
            :key="roleItem.name"
            :name="roleItem.name"
            :hex="roles[roleItem.name]"
            :on-hex="roleItem.onRole ? roles[roleItem.onRole] : undefined"
          />
        </div>
      </div>
      
      <!-- 自定义颜色 -->
      <div v-if="customColors && customColors.length > 0" class="color-group">
        <h4 class="group-title">Custom Colors</h4>
        <div v-for="custom in customColors" :key="custom.name" class="custom-color-section">
          <span class="custom-color-name">{{ custom.name }}</span>
          <div class="role-grid" v-if="custom.roles">
            <ColorRoleCard :name="`${custom.name}`" :hex="custom.roles.color" :on-hex="custom.roles.onColor" />
            <ColorRoleCard :name="`on${custom.name}`" :hex="custom.roles.onColor" />
            <ColorRoleCard :name="`${custom.name}Container`" :hex="custom.roles.colorContainer" :on-hex="custom.roles.onColorContainer" />
            <ColorRoleCard :name="`on${custom.name}Container`" :hex="custom.roles.onColorContainer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ColorRoleCard from './ColorRoleCard.vue'

defineProps({
  roles: {
    type: Object,
    required: true
  },
  isDark: {
    type: Boolean,
    default: false
  },
  customColors: {
    type: Array,
    default: () => []
  }
})

defineEmits(['toggleMode'])

const colorGroups = [
  {
    title: 'Primary',
    roles: [
      { name: 'primary', onRole: 'onPrimary' },
      { name: 'primaryDim' },
      { name: 'onPrimary' },
      { name: 'primaryContainer', onRole: 'onPrimaryContainer' },
      { name: 'onPrimaryContainer' },
      { name: 'primaryFixed', onRole: 'onPrimaryFixed' },
      { name: 'primaryFixedDim', onRole: 'onPrimaryFixedVariant' },
      { name: 'onPrimaryFixed' },
      { name: 'onPrimaryFixedVariant' }
    ]
  },
  {
    title: 'Secondary',
    roles: [
      { name: 'secondary', onRole: 'onSecondary' },
      { name: 'secondaryDim' },
      { name: 'onSecondary' },
      { name: 'secondaryContainer', onRole: 'onSecondaryContainer' },
      { name: 'onSecondaryContainer' },
      { name: 'secondaryFixed', onRole: 'onSecondaryFixed' },
      { name: 'secondaryFixedDim', onRole: 'onSecondaryFixedVariant' },
      { name: 'onSecondaryFixed' },
      { name: 'onSecondaryFixedVariant' }
    ]
  },
  {
    title: 'Tertiary',
    roles: [
      { name: 'tertiary', onRole: 'onTertiary' },
      { name: 'tertiaryDim' },
      { name: 'onTertiary' },
      { name: 'tertiaryContainer', onRole: 'onTertiaryContainer' },
      { name: 'onTertiaryContainer' },
      { name: 'tertiaryFixed', onRole: 'onTertiaryFixed' },
      { name: 'tertiaryFixedDim', onRole: 'onTertiaryFixedVariant' },
      { name: 'onTertiaryFixed' },
      { name: 'onTertiaryFixedVariant' }
    ]
  },
  {
    title: 'Error',
    roles: [
      { name: 'error', onRole: 'onError' },
      { name: 'errorDim' },
      { name: 'onError' },
      { name: 'errorContainer', onRole: 'onErrorContainer' },
      { name: 'onErrorContainer' }
    ]
  },
  {
    title: 'Surface',
    roles: [
      { name: 'surface', onRole: 'onSurface' },
      { name: 'onSurface' },
      { name: 'surfaceVariant', onRole: 'onSurfaceVariant' },
      { name: 'onSurfaceVariant' },
      { name: 'surfaceDim' },
      { name: 'surfaceBright' },
      { name: 'surfaceContainerLowest' },
      { name: 'surfaceContainerLow' },
      { name: 'surfaceContainer' },
      { name: 'surfaceContainerHigh' },
      { name: 'surfaceContainerHighest' }
    ]
  },
  {
    title: 'Outline & Others',
    roles: [
      { name: 'outline' },
      { name: 'outlineVariant' },
      { name: 'inverseSurface', onRole: 'inverseOnSurface' },
      { name: 'inverseOnSurface' },
      { name: 'inversePrimary' },
      { name: 'shadow' },
      { name: 'scrim' },
      { name: 'background', onRole: 'onBackground' },
      { name: 'onBackground' }
    ]
  }
]
</script>

<style scoped>
.theme-preview {
  padding: 20px;
  background: var(--surface-container);
  border-radius: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  background: var(--surface-container-high);
  border: 2px solid var(--outline-variant);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-toggle:hover {
  background: var(--surface-container-highest);
  border-color: var(--outline);
}

.mode-icon {
  font-size: 16px;
}

.color-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.color-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--on-surface-variant);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--outline-variant);
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.surface-grid {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .role-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.custom-color-section {
  margin-bottom: 16px;
}

.custom-color-section:last-child {
  margin-bottom: 0;
}

.custom-color-name {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 8px;
  text-transform: capitalize;
}
</style>
