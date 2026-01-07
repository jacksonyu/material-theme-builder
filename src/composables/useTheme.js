/**
 * 主题状态管理 Composable
 */
import { ref, computed, watch } from 'vue'
import { generateThemeFromColor, exportThemeToJson, SchemeVariant, SCHEME_VARIANT_INFO, SpecVersion, SPEC_VERSION_INFO } from '../services/color-service'

// 全局状态
const sourceColor = ref('#6750A4') // M3 默认紫色
const contrastLevel = ref(0) // -1 到 1
const isDark = ref(false)
const variant = ref(SchemeVariant.TONAL_SPOT) // Scheme 变体
const specVersion = ref(SpecVersion.SPEC_2025) // Spec 版本
const customColors = ref([])

// 显示的色调级别
const displayedTones = ref([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100])

// 导出选项
const exportOptions = ref({
  includeLight: true,
  includeDark: true,
  includePalettes: true,
  includeCustomColors: true,
  selectedRoles: null
})

export function useTheme() {
  // Light 模式主题
  const lightTheme = computed(() => {
    return generateThemeFromColor(sourceColor.value, {
      contrastLevel: contrastLevel.value,
      isDark: false,
      variant: variant.value,
      specVersion: specVersion.value,
      customColors: customColors.value
    })
  })
  
  // Dark 模式主题
  const darkTheme = computed(() => {
    return generateThemeFromColor(sourceColor.value, {
      contrastLevel: contrastLevel.value,
      isDark: true,
      variant: variant.value,
      specVersion: specVersion.value,
      customColors: customColors.value
    })
  })
  
  // 当前活动主题
  const currentTheme = computed(() => {
    return isDark.value ? darkTheme.value : lightTheme.value
  })
  
  // 完整主题（包含 light 和 dark）
  const fullTheme = computed(() => {
    return {
      source: sourceColor.value,
      contrastLevel: contrastLevel.value,
      palettes: lightTheme.value.palettes,
      lightRoles: lightTheme.value.colorRoles,
      darkRoles: darkTheme.value.colorRoles,
      customColors: isDark.value ? darkTheme.value.customColors : lightTheme.value.customColors
    }
  })
  
  // 设置源颜色
  function setSourceColor(hex) {
    sourceColor.value = hex
  }
  
  // 设置对比度级别
  function setContrastLevel(level) {
    contrastLevel.value = Math.max(-1, Math.min(1, level))
  }
  
  // 切换暗色模式
  function toggleDarkMode() {
    isDark.value = !isDark.value
  }
  
  // 设置 Scheme 变体
  function setVariant(v) {
    variant.value = v
  }
  
  // 添加自定义颜色
  function addCustomColor(name, value, harmonize = true) {
    customColors.value = [
      ...customColors.value,
      { id: Date.now(), name, value, harmonize }
    ]
  }
  
  // 更新自定义颜色
  function updateCustomColor(id, updates) {
    customColors.value = customColors.value.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
  }
  
  // 删除自定义颜色
  function removeCustomColor(id) {
    customColors.value = customColors.value.filter(c => c.id !== id)
  }
  
  // 导出主题 JSON
  function exportTheme(options = {}) {
    const mergedOptions = { ...exportOptions.value, ...options }
    return exportThemeToJson(fullTheme.value, mergedOptions)
  }
  
  // 下载主题 JSON
  function downloadTheme(filename = 'material-theme.json') {
    const json = exportTheme()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // 复制到剪贴板
  async function copyThemeToClipboard() {
    const json = exportTheme()
    await navigator.clipboard.writeText(json)
  }
  
  return {
    // 状态
    sourceColor,
    contrastLevel,
    isDark,
    variant,
    specVersion,
    customColors,
    displayedTones,
    exportOptions,
    
    // 计算属性
    lightTheme,
    darkTheme,
    currentTheme,
    fullTheme,
    
    // 方法
    setSourceColor,
    setContrastLevel,
    toggleDarkMode,
    setVariant,
    addCustomColor,
    updateCustomColor,
    removeCustomColor,
    exportTheme,
    downloadTheme,
    copyThemeToClipboard,
    
    // 常量
    SchemeVariant,
    SCHEME_VARIANT_INFO,
    SpecVersion,
    SPEC_VERSION_INFO
  }
}
