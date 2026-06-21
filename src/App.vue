<template>
  <div class="app" :class="{ dark: isDark }">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <span class="icon">🎨</span>
          Material Theme Builder
        </h1>
        <p class="app-subtitle">基于 Material Design 3 动态颜色系统</p>
      </div>
    </header>
    
    <main class="app-main">
      <aside class="sidebar left-sidebar">
        <ColorPicker v-model="sourceColor" />
        <CustomColorEditor
          :custom-colors="customColors"
          @add="addCustomColor"
          @remove="removeCustomColor"
        />
        <ContrastSlider v-model="contrastLevel" />
        <SpecVersionSelector v-model="specVersion" :contrast-level="contrastLevel" :variant="variant" />
        <PlatformSelector v-model="platform" />
        <VariantSelector v-model="variant" />
        <KeyColorEditor
          v-model="keyColorOverrides"
          @set="setKeyColorOverride"
        />
        <ToneOverridePanel
          v-model="toneOverrides"
          :custom-colors="customColors"
          @add="addToneOverride"
          @remove="removeToneOverride"
          @update="updateToneOverride"
        />
      </aside>
      
      <section class="main-content">
        <PhonePreview :roles="currentTheme.colorRoles" />
        <ThemePreview
          :roles="currentTheme.colorRoles"
          :is-dark="isDark"
          :custom-colors="customColorsWithRoles"
          @toggle-mode="toggleDarkMode"
        />
        <PalettePreview
          :palettes="currentTheme.palettes"
          :displayed-tones="displayedTones"
        />
      </section>
      
      <aside class="sidebar right-sidebar">
        <ExportPanel :theme="fullTheme" />
      </aside>
    </main>
    
    <footer class="app-footer">
      <p>使用 <a href="https://www.npmjs.com/package/@ktibow/material-color-utilities-nightly" target="_blank">@ktibow/material-color-utilities-nightly</a> 构建</p>
    </footer>
  </div>
</template>

<script setup>
import { watch, computed } from 'vue'
import { useTheme } from './composables/useTheme'
import ColorPicker from './components/ColorPicker.vue'
import ContrastSlider from './components/ContrastSlider.vue'
import SpecVersionSelector from './components/SpecVersionSelector.vue'
import PlatformSelector from './components/PlatformSelector.vue'
import VariantSelector from './components/VariantSelector.vue'
import KeyColorEditor from './components/KeyColorEditor.vue'
import ToneOverridePanel from './components/ToneOverridePanel.vue'
import CustomColorEditor from './components/CustomColorEditor.vue'
import PhonePreview from './components/PhonePreview.vue'
import ThemePreview from './components/ThemePreview.vue'
import PalettePreview from './components/PalettePreview.vue'
import ExportPanel from './components/ExportPanel.vue'

const {
  sourceColor,
  contrastLevel,
  isDark,
  variant,
  specVersion,
  platform,
  customColors,
  keyColorOverrides,
  toneOverrides,
  displayedTones,
  currentTheme,
  fullTheme,
  toggleDarkMode,
  addCustomColor,
  removeCustomColor,
  setKeyColorOverride,
  addToneOverride,
  removeToneOverride,
  updateToneOverride
} = useTheme()

// 合并自定义颜色配置和生成的颜色角色
const customColorsWithRoles = computed(() => {
  const themeCustomColors = currentTheme.value.customColors || []
  return customColors.value.map(color => {
    const generated = themeCustomColors.find(c => c.name === color.name)
    return {
      ...color,
      roles: generated?.roles || null
    }
  })
})

// 动态更新 CSS 变量
watch(currentTheme, (theme) => {
  const root = document.documentElement
  
  // 1. 标准 color roles
  for (const [key, value] of Object.entries(theme.colorRoles)) {
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVarName, value)
  }
  
  // 2. 自定义颜色 roles
  if (theme.customColors) {
    for (const customColor of theme.customColors) {
      const baseName = customColor.name.toLowerCase().replace(/\s+/g, '-')
      if (customColor.roles) {
        for (const [roleKey, colorVal] of Object.entries(customColor.roles)) {
          let varName = ''
          if (roleKey === 'color') {
            varName = `--${baseName}`
          } else if (roleKey === 'onColor') {
            varName = `--on-${baseName}`
          } else if (roleKey === 'colorContainer') {
            varName = `--${baseName}-container`
          } else if (roleKey === 'onColorContainer') {
            varName = `--on-${baseName}-container`
          }
          
          if (varName && colorVal) {
            root.style.setProperty(varName, colorVal)
          }
        }
      }
    }
  }
}, { immediate: true })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  /* 默认 M3 颜色变量 - 会被 JS 动态覆盖 */
  --primary: #6750A4;
  --on-primary: #FFFFFF;
  --primary-container: #EADDFF;
  --on-primary-container: #21005D;
  --secondary: #625B71;
  --on-secondary: #FFFFFF;
  --secondary-container: #E8DEF8;
  --on-secondary-container: #1D192B;
  --tertiary: #7D5260;
  --on-tertiary: #FFFFFF;
  --tertiary-container: #FFD8E4;
  --on-tertiary-container: #31111D;
  --error: #B3261E;
  --on-error: #FFFFFF;
  --error-container: #F9DEDC;
  --on-error-container: #410E0B;
  --background: #FFFBFE;
  --on-background: #1C1B1F;
  --surface: #FFFBFE;
  --on-surface: #1C1B1F;
  --surface-variant: #E7E0EC;
  --on-surface-variant: #49454F;
  --surface-container: #F3EDF7;
  --surface-container-high: #ECE6F0;
  --surface-container-highest: #E6E0E9;
  --surface-container-low: #F7F2FA;
  --surface-container-lowest: #FFFFFF;
  --outline: #79747E;
  --outline-variant: #CAC4D0;
  --inverse-surface: #313033;
  --inverse-on-surface: #F4EFF4;
  --inverse-primary: #D0BCFF;
  --shadow: #000000;
  --scrim: #000000;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--background);
  color: var(--on-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background);
  transition: background 0.3s, color 0.3s;
  overflow: hidden;
}

.app-header {
  padding: 24px 32px;
  background: linear-gradient(135deg, var(--primary-container), var(--tertiary-container));
  border-bottom: 1px solid var(--outline-variant);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
}

.app-title {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--on-primary-container);
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 32px;
}

.app-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--on-primary-container);
  opacity: 0.8;
}

.app-main {
  flex: 1;
  min-height: 0; /* 允许 flex 子元素收缩 */
  display: grid;
  grid-template-columns: 320px 1fr 360px;
  gap: 24px;
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
}

/* 自定义滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--outline-variant);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--outline);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--outline-variant);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--outline);
}

.app-footer {
  padding: 16px 32px;
  text-align: center;
  background: var(--surface-container);
  border-top: 1px solid var(--outline-variant);
}

.app-footer p {
  margin: 0;
  font-size: 13px;
  color: var(--on-surface-variant);
}

.app-footer a {
  color: var(--primary);
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 1280px) {
  .app-main {
    grid-template-columns: 280px 1fr 320px;
    padding: 16px;
    gap: 16px;
  }
}

@media (max-width: 1024px) {
  .app-main {
    grid-template-columns: 1fr;
    max-width: 720px;
  }
  
  .left-sidebar,
  .right-sidebar {
    order: 0;
  }
  
  .main-content {
    order: 1;
  }
}
</style>
