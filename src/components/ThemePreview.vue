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
      <!-- Primary -->
      <div class="color-group">
        <h4 class="group-title">Primary</h4>
        <div class="role-grid">
          <ColorRoleCard name="primary" :hex="roles.primary" :on-hex="roles.onPrimary" />
          <ColorRoleCard name="onPrimary" :hex="roles.onPrimary" />
          <ColorRoleCard name="primaryContainer" :hex="roles.primaryContainer" :on-hex="roles.onPrimaryContainer" />
          <ColorRoleCard name="onPrimaryContainer" :hex="roles.onPrimaryContainer" />
        </div>
      </div>
      
      <!-- Secondary -->
      <div class="color-group">
        <h4 class="group-title">Secondary</h4>
        <div class="role-grid">
          <ColorRoleCard name="secondary" :hex="roles.secondary" :on-hex="roles.onSecondary" />
          <ColorRoleCard name="onSecondary" :hex="roles.onSecondary" />
          <ColorRoleCard name="secondaryContainer" :hex="roles.secondaryContainer" :on-hex="roles.onSecondaryContainer" />
          <ColorRoleCard name="onSecondaryContainer" :hex="roles.onSecondaryContainer" />
        </div>
      </div>
      
      <!-- Tertiary -->
      <div class="color-group">
        <h4 class="group-title">Tertiary</h4>
        <div class="role-grid">
          <ColorRoleCard name="tertiary" :hex="roles.tertiary" :on-hex="roles.onTertiary" />
          <ColorRoleCard name="onTertiary" :hex="roles.onTertiary" />
          <ColorRoleCard name="tertiaryContainer" :hex="roles.tertiaryContainer" :on-hex="roles.onTertiaryContainer" />
          <ColorRoleCard name="onTertiaryContainer" :hex="roles.onTertiaryContainer" />
        </div>
      </div>
      
      <!-- Error -->
      <div class="color-group">
        <h4 class="group-title">Error</h4>
        <div class="role-grid">
          <ColorRoleCard name="error" :hex="roles.error" :on-hex="roles.onError" />
          <ColorRoleCard name="onError" :hex="roles.onError" />
          <ColorRoleCard name="errorContainer" :hex="roles.errorContainer" :on-hex="roles.onErrorContainer" />
          <ColorRoleCard name="onErrorContainer" :hex="roles.onErrorContainer" />
        </div>
      </div>
      
      <!-- Surface -->
      <div class="color-group">
        <h4 class="group-title">Surface</h4>
        <div class="role-grid surface-grid">
          <ColorRoleCard name="surface" :hex="roles.surface" :on-hex="roles.onSurface" />
          <ColorRoleCard name="onSurface" :hex="roles.onSurface" />
          <ColorRoleCard name="surfaceVariant" :hex="roles.surfaceVariant" :on-hex="roles.onSurfaceVariant" />
          <ColorRoleCard name="onSurfaceVariant" :hex="roles.onSurfaceVariant" />
          <ColorRoleCard name="surfaceDim" :hex="roles.surfaceDim" />
          <ColorRoleCard name="surfaceBright" :hex="roles.surfaceBright" />
          <ColorRoleCard name="surfaceContainerLowest" :hex="roles.surfaceContainerLowest" />
          <ColorRoleCard name="surfaceContainerLow" :hex="roles.surfaceContainerLow" />
          <ColorRoleCard name="surfaceContainer" :hex="roles.surfaceContainer" />
          <ColorRoleCard name="surfaceContainerHigh" :hex="roles.surfaceContainerHigh" />
          <ColorRoleCard name="surfaceContainerHighest" :hex="roles.surfaceContainerHighest" />
        </div>
      </div>
      
      <!-- Outline & Others -->
      <div class="color-group">
        <h4 class="group-title">Outline & Others</h4>
        <div class="role-grid">
          <ColorRoleCard name="outline" :hex="roles.outline" />
          <ColorRoleCard name="outlineVariant" :hex="roles.outlineVariant" />
          <ColorRoleCard name="inverseSurface" :hex="roles.inverseSurface" />
          <ColorRoleCard name="inverseOnSurface" :hex="roles.inverseOnSurface" />
          <ColorRoleCard name="inversePrimary" :hex="roles.inversePrimary" />
          <ColorRoleCard name="shadow" :hex="roles.shadow" />
          <ColorRoleCard name="scrim" :hex="roles.scrim" />
          <ColorRoleCard name="background" :hex="roles.background" />
        </div>
      </div>
      
      <!-- Custom Colors -->
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
