/**
 * 主题状态管理 Composable
 */
import { ref, computed } from 'vue'
import { 
  generateThemeFromColor, 
  exportThemeToJson,
  exportThemeToOfficialJson,
  SchemeVariant, 
  SCHEME_VARIANT_INFO, 
  SpecVersion, 
  SPEC_VERSION_INFO,
  ALL_COLOR_ROLES,
  type CustomColor,
  type SchemeVariantType,
  type SpecVersionType,
  type ExportOptions,
  type KeyColorOverrides,
  type ToneOverrides,
  type Platform
} from '../services/color-service'

// 全局状态
const sourceColor = ref<string>('#6750A4') // M3 默认紫色
const contrastLevel = ref<number>(0) // -1 到 1
const isDark = ref<boolean>(false)
const variant = ref<SchemeVariantType>(SchemeVariant.TONAL_SPOT) // Scheme 变体
const specVersion = ref<SpecVersionType>(SpecVersion.SPEC_2025) // Spec 版本
const platform = ref<Platform>('phone') // 平台：手机还是手表
const customColors = ref<CustomColor[]>([])

// 关键色覆盖状态
const keyColorOverrides = ref<KeyColorOverrides>({})

// Tone 改写状态
const toneOverrides = ref<ToneOverrides>({ light: [], dark: [] })

// 显示的色调级别
const displayedTones = ref<number[]>([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100])

// 导出选项
const exportOptions = ref<ExportOptions>({
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
      platform: platform.value,
      customColors: customColors.value,
      keyColorOverrides: keyColorOverrides.value,
      toneOverrides: toneOverrides.value
    })
  })
  
  // Dark 模式主题
  const darkTheme = computed(() => {
    return generateThemeFromColor(sourceColor.value, {
      contrastLevel: contrastLevel.value,
      isDark: true,
      variant: variant.value,
      specVersion: specVersion.value,
      platform: platform.value,
      customColors: customColors.value,
      keyColorOverrides: keyColorOverrides.value,
      toneOverrides: toneOverrides.value
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
  
  // 获取所有可用的 color role 名称（包含自定义颜色 role）
  const availableColorRoles = computed(() => {
    const roles = [...ALL_COLOR_ROLES]
    
    // 添加自定义颜色的 role
    for (const customColor of customColors.value) {
      const baseName = customColor.name.toLowerCase().replace(/\s+/g, '')
      roles.push(
        `${baseName}` as any,
        `on${baseName.charAt(0).toUpperCase() + baseName.slice(1)}` as any,
        `${baseName}Container` as any,
        `on${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Container` as any
      )
    }
    
    return roles
  })
  
  // 设置源颜色
  function setSourceColor(hex: string) {
    sourceColor.value = hex
  }
  
  // 设置对比度级别
  function setContrastLevel(level: number) {
    contrastLevel.value = Math.max(-1, Math.min(1, level))
  }
  
  // 切换暗色模式
  function toggleDarkMode() {
    isDark.value = !isDark.value
  }
  
  // 设置 Scheme 变体
  function setVariant(v: SchemeVariantType) {
    variant.value = v
  }
  
  // 设置平台
  function setPlatform(p: Platform) {
    platform.value = p
  }
  
  // 设置关键色覆盖
  function setKeyColorOverride(key: keyof KeyColorOverrides, hex: string | null) {
    if (hex) {
      keyColorOverrides.value = { ...keyColorOverrides.value, [key]: hex }
    } else {
      const newOverrides = { ...keyColorOverrides.value }
      delete newOverrides[key]
      keyColorOverrides.value = newOverrides
    }
  }
  
  // 清除所有关键色覆盖
  function clearKeyColorOverrides() {
    keyColorOverrides.value = {}
  }
  
  // 添加 Tone 改写
  function addToneOverride(mode: 'light' | 'dark', role: string, tone: number) {
    const overrides = [...toneOverrides.value[mode]]
    const existingIndex = overrides.findIndex(o => o.role === role)
    
    if (existingIndex >= 0) {
      overrides[existingIndex] = { role, tone }
    } else {
      overrides.push({ role, tone })
    }
    
    toneOverrides.value = {
      ...toneOverrides.value,
      [mode]: overrides
    }
  }
  
  // 删除 Tone 改写
  function removeToneOverride(mode: 'light' | 'dark', role: string) {
    toneOverrides.value = {
      ...toneOverrides.value,
      [mode]: toneOverrides.value[mode].filter(o => o.role !== role)
    }
  }
  
  // 更新 Tone 改写
  function updateToneOverride(mode: 'light' | 'dark', role: string, tone: number) {
    addToneOverride(mode, role, tone) // 复用添加逻辑
  }
  
  // 清除所有 Tone 改写
  function clearToneOverrides() {
    toneOverrides.value = { light: [], dark: [] }
  }
  
  // 添加自定义颜色
  function addCustomColor(name: string, value: string, harmonize: boolean = true) {
    customColors.value = [
      ...customColors.value,
      { id: Date.now(), name, value, harmonize }
    ]
  }
  
  // 更新自定义颜色
  function updateCustomColor(id: number, updates: Partial<CustomColor>) {
    customColors.value = customColors.value.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
  }
  
  // 删除自定义颜色
  function removeCustomColor(id: number) {
    customColors.value = customColors.value.filter(c => c.id !== id)
  }
  
  // 导出主题 JSON（旧格式）
  function exportTheme(options: Partial<ExportOptions> = {}) {
    const mergedOptions = { ...exportOptions.value, ...options }
    return exportThemeToJson(fullTheme.value, mergedOptions)
  }
  
  // 导出主题 JSON（官方格式）
  function exportThemeOfficial() {
    return exportThemeToOfficialJson({
      sourceColor: sourceColor.value,
      variant: variant.value,
      specVersion: specVersion.value,
      platform: platform.value,
      customColors: customColors.value,
      keyColorOverrides: keyColorOverrides.value,
      toneOverrides: toneOverrides.value,
      contrastLevel: contrastLevel.value,
      isDark: isDark.value
    })
  }

  // 导入原有主题以恢复编辑状态
  function importTheme(jsonStr: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonStr)
      
      // 1. 高级模式：带有完整的 mtbConfig 配置
      if (data.mtbConfig) {
        const config = data.mtbConfig
        
        if (config.sourceColor) sourceColor.value = config.sourceColor
        if (config.variant) variant.value = config.variant
        if (config.specVersion) specVersion.value = config.specVersion
        if (config.platform) platform.value = config.platform
        
        // 恢复自定义颜色列表，重新映射以防 id 丢失
        if (Array.isArray(config.customColors)) {
          customColors.value = config.customColors.map((c: any) => ({
            id: c.id || Date.now() + Math.random(),
            name: c.name,
            value: c.value,
            harmonize: c.harmonize !== undefined ? c.harmonize : true
          }))
        } else {
          customColors.value = []
        }
        
        if (config.keyColorOverrides) keyColorOverrides.value = config.keyColorOverrides
        if (config.toneOverrides) {
          toneOverrides.value = {
            light: Array.isArray(config.toneOverrides.light) ? config.toneOverrides.light : [],
            dark: Array.isArray(config.toneOverrides.dark) ? config.toneOverrides.dark : []
          }
        }
        if (config.contrastLevel !== undefined) contrastLevel.value = config.contrastLevel
        if (config.isDark !== undefined) isDark.value = config.isDark
        
        return { success: true }
      }
      
      // 2. 兼容模式：处理不带 mtbConfig 的普通/官方 M3 JSON
      const mainColor = data.seed || (data.coreColors && data.coreColors.primary)
      if (!mainColor) {
        return { success: false, error: '无效的主题 JSON：未找到种子颜色 (seed/coreColors.primary)' }
      }
      
      sourceColor.value = mainColor
      
      // 兼容自定义颜色恢复
      if (Array.isArray(data.extendedColors)) {
        customColors.value = data.extendedColors.map((c: any, index: number) => ({
          id: Date.now() + index,
          name: c.name || `custom_${index}`,
          value: c.color || '#000000',
          harmonize: c.harmonized !== undefined ? c.harmonized : true
        }))
      } else {
        customColors.value = []
      }
      
      // 重置微调状态，确保回到默认干净状态
      keyColorOverrides.value = {}
      toneOverrides.value = { light: [], dark: [] }
      contrastLevel.value = 0
      
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : '解析 JSON 发生错误' }
    }
  }
  
  // 下载主题 JSON
  function downloadTheme(filename: string = 'material-theme.json') {
    const json = exportThemeOfficial()
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
    const json = exportThemeOfficial()
    await navigator.clipboard.writeText(json)
  }
  
  return {
    // 状态
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
    exportOptions,
    
    // 计算属性
    lightTheme,
    darkTheme,
    currentTheme,
    fullTheme,
    availableColorRoles,
    
    // 方法
    setSourceColor,
    setContrastLevel,
    toggleDarkMode,
    setVariant,
    setPlatform,
    setKeyColorOverride,
    clearKeyColorOverrides,
    addToneOverride,
    removeToneOverride,
    updateToneOverride,
    clearToneOverrides,
    addCustomColor,
    updateCustomColor,
    removeCustomColor,
    exportTheme,
    exportThemeOfficial,
    downloadTheme,
    copyThemeToClipboard,
    importTheme,
    
    // 常量
    SchemeVariant,
    SCHEME_VARIANT_INFO,
    SpecVersion,
    SPEC_VERSION_INFO,
    ALL_COLOR_ROLES
  }
}
