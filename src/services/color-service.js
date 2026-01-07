/**
 * 颜色服务层 - 封装 @ktibow/material-color-utilities-nightly
 */
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  TonalPalette,
  Hct,
  Blend,
  MaterialDynamicColors,
  SchemeContent,
  SchemeTonalSpot,
  SchemeVibrant,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeFruitSalad,
  SchemeRainbow,
  DynamicScheme,
} from '@ktibow/material-color-utilities-nightly'

/**
 * SpecVersion 枚举
 */
export const SpecVersion = {
  SPEC_2021: 'spec2021',
  SPEC_2025: 'spec2025'
}

/**
 * SpecVersion 信息映射
 */
export const SPEC_VERSION_INFO = {
  [SpecVersion.SPEC_2021]: {
    name: 'Spec 2021',
    description: '支持低对比度（对比度 < 0）'
  },
  [SpecVersion.SPEC_2025]: {
    name: 'Spec 2025',
    description: '最新规范，不支持低对比度'
  }
}

/**
 * Scheme 变体枚举
 */
export const SchemeVariant = {
  CONTENT: 'content',
  TONAL_SPOT: 'tonalSpot',
  VIBRANT: 'vibrant',
  EXPRESSIVE: 'expressive',
  FIDELITY: 'fidelity',
  MONOCHROME: 'monochrome',
  NEUTRAL: 'neutral',
  FRUIT_SALAD: 'fruitSalad',
  RAINBOW: 'rainbow'
}

/**
 * 变体信息映射
 */
export const SCHEME_VARIANT_INFO = {
  [SchemeVariant.TONAL_SPOT]: {
    name: 'Tonal Spot',
    description: '默认 M3 配色方案，平衡且通用'
  },
  [SchemeVariant.CONTENT]: {
    name: 'Content',
    description: '将源颜色放入 primaryContainer，适合内容优先的界面'
  },
  [SchemeVariant.VIBRANT]: {
    name: 'Vibrant',
    description: '更鲜艳饱和的颜色，适合活力四射的界面'
  },
  [SchemeVariant.EXPRESSIVE]: {
    name: 'Expressive',
    description: '更具表现力的颜色组合，适合创意应用'
  },
  [SchemeVariant.FIDELITY]: {
    name: 'Fidelity',
    description: '忠实于源颜色，最大程度保留原始色调'
  },
  [SchemeVariant.MONOCHROME]: {
    name: 'Monochrome',
    description: '单色方案，仅使用灰度色调'
  },
  [SchemeVariant.NEUTRAL]: {
    name: 'Neutral',
    description: '中性柔和的颜色，适合低调的界面'
  },
  [SchemeVariant.FRUIT_SALAD]: {
    name: 'Fruit Salad',
    description: '多彩的颜色组合，适合趣味性应用'
  },
  [SchemeVariant.RAINBOW]: {
    name: 'Rainbow',
    description: '彩虹色调，适合多样化的视觉效果'
  }
}

/**
 * 根据变体类型创建 Scheme 实例
 */
function createScheme(sourceColorHct, isDark, contrastLevel, variant, specVersion = SpecVersion.SPEC_2025) {
  // 使用字符串格式的年份
  const specVersionStr = specVersion === SpecVersion.SPEC_2021 ? '2021' : '2025'
  
  // 如果是 SPEC_2025，低对比度不可用，自动调整为 0
  const adjustedContrastLevel = specVersion === SpecVersion.SPEC_2025 && contrastLevel < 0 
    ? 0 
    : contrastLevel
  
  switch (variant) {
    case SchemeVariant.TONAL_SPOT:
      return new SchemeTonalSpot(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.CONTENT:
      return new SchemeContent(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.VIBRANT:
      return new SchemeVibrant(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.EXPRESSIVE:
      return new SchemeExpressive(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.FIDELITY:
      return new SchemeFidelity(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.MONOCHROME:
      return new SchemeMonochrome(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.NEUTRAL:
      return new SchemeNeutral(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.FRUIT_SALAD:
      return new SchemeFruitSalad(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.RAINBOW:
      return new SchemeRainbow(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    default:
      return new SchemeTonalSpot(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
  }
}

/**
 * 从源颜色生成完整的 M3 主题
 * @param {string} sourceColorHex - 源颜色 HEX 值
 * @param {Object} options - 配置选项
 * @param {number} options.contrastLevel - 对比度级别 (-1 到 1)
 * @param {boolean} options.isDark - 是否为暗色模式
 * @param {string} options.variant - Scheme 变体类型
 * @param {Array} options.customColors - 自定义颜色列表
 * @returns {Object} 完整的主题对象
 */
export function generateThemeFromColor(sourceColorHex, options = {}) {
  const { 
    contrastLevel = 0, 
    isDark = false, 
    variant = SchemeVariant.TONAL_SPOT,
    specVersion = SpecVersion.SPEC_2025,
    customColors = [] 
  } = options
  
  const sourceColorArgb = argbFromHex(sourceColorHex)
  const sourceColorHct = Hct.fromInt(sourceColorArgb)
  
  // 使用 themeFromSourceColor 生成基础主题（用于调色板和自定义颜色）
  const theme = themeFromSourceColor(sourceColorArgb, customColors.map(c => ({
    name: c.name,
    value: argbFromHex(c.value),
    blend: c.harmonize ?? true
  })))
  
  // 根据选择的变体创建 Scheme
  const scheme = createScheme(sourceColorHct, isDark, contrastLevel, variant, specVersion)
  
  // 提取所有 M3 颜色角色
  const colorRoles = extractColorRoles(scheme)
  
  // 生成调色板
  const palettes = extractPalettes(theme)
  
  // 处理自定义颜色
  const customColorRoles = extractCustomColors(theme, isDark, contrastLevel)
  
  return {
    source: sourceColorHex,
    isDark,
    contrastLevel,
    colorRoles,
    palettes,
    customColors: customColorRoles
  }
}

/**
 * 提取所有 M3 颜色角色
 */
function extractColorRoles(scheme) {
  const roles = {}
  
  // Primary 系列
  roles.primary = hexFromArgb(MaterialDynamicColors.primary.getArgb(scheme))
  roles.onPrimary = hexFromArgb(MaterialDynamicColors.onPrimary.getArgb(scheme))
  roles.primaryContainer = hexFromArgb(MaterialDynamicColors.primaryContainer.getArgb(scheme))
  roles.onPrimaryContainer = hexFromArgb(MaterialDynamicColors.onPrimaryContainer.getArgb(scheme))
  roles.primaryFixed = hexFromArgb(MaterialDynamicColors.primaryFixed.getArgb(scheme))
  roles.primaryFixedDim = hexFromArgb(MaterialDynamicColors.primaryFixedDim.getArgb(scheme))
  roles.onPrimaryFixed = hexFromArgb(MaterialDynamicColors.onPrimaryFixed.getArgb(scheme))
  roles.onPrimaryFixedVariant = hexFromArgb(MaterialDynamicColors.onPrimaryFixedVariant.getArgb(scheme))
  
  // Secondary 系列
  roles.secondary = hexFromArgb(MaterialDynamicColors.secondary.getArgb(scheme))
  roles.onSecondary = hexFromArgb(MaterialDynamicColors.onSecondary.getArgb(scheme))
  roles.secondaryContainer = hexFromArgb(MaterialDynamicColors.secondaryContainer.getArgb(scheme))
  roles.onSecondaryContainer = hexFromArgb(MaterialDynamicColors.onSecondaryContainer.getArgb(scheme))
  roles.secondaryFixed = hexFromArgb(MaterialDynamicColors.secondaryFixed.getArgb(scheme))
  roles.secondaryFixedDim = hexFromArgb(MaterialDynamicColors.secondaryFixedDim.getArgb(scheme))
  roles.onSecondaryFixed = hexFromArgb(MaterialDynamicColors.onSecondaryFixed.getArgb(scheme))
  roles.onSecondaryFixedVariant = hexFromArgb(MaterialDynamicColors.onSecondaryFixedVariant.getArgb(scheme))
  
  // Tertiary 系列
  roles.tertiary = hexFromArgb(MaterialDynamicColors.tertiary.getArgb(scheme))
  roles.onTertiary = hexFromArgb(MaterialDynamicColors.onTertiary.getArgb(scheme))
  roles.tertiaryContainer = hexFromArgb(MaterialDynamicColors.tertiaryContainer.getArgb(scheme))
  roles.onTertiaryContainer = hexFromArgb(MaterialDynamicColors.onTertiaryContainer.getArgb(scheme))
  roles.tertiaryFixed = hexFromArgb(MaterialDynamicColors.tertiaryFixed.getArgb(scheme))
  roles.tertiaryFixedDim = hexFromArgb(MaterialDynamicColors.tertiaryFixedDim.getArgb(scheme))
  roles.onTertiaryFixed = hexFromArgb(MaterialDynamicColors.onTertiaryFixed.getArgb(scheme))
  roles.onTertiaryFixedVariant = hexFromArgb(MaterialDynamicColors.onTertiaryFixedVariant.getArgb(scheme))
  
  // Error 系列
  roles.error = hexFromArgb(MaterialDynamicColors.error.getArgb(scheme))
  roles.onError = hexFromArgb(MaterialDynamicColors.onError.getArgb(scheme))
  roles.errorContainer = hexFromArgb(MaterialDynamicColors.errorContainer.getArgb(scheme))
  roles.onErrorContainer = hexFromArgb(MaterialDynamicColors.onErrorContainer.getArgb(scheme))
  
  // Surface 系列
  roles.surface = hexFromArgb(MaterialDynamicColors.surface.getArgb(scheme))
  roles.onSurface = hexFromArgb(MaterialDynamicColors.onSurface.getArgb(scheme))
  roles.surfaceVariant = hexFromArgb(MaterialDynamicColors.surfaceVariant.getArgb(scheme))
  roles.onSurfaceVariant = hexFromArgb(MaterialDynamicColors.onSurfaceVariant.getArgb(scheme))
  roles.surfaceDim = hexFromArgb(MaterialDynamicColors.surfaceDim.getArgb(scheme))
  roles.surfaceBright = hexFromArgb(MaterialDynamicColors.surfaceBright.getArgb(scheme))
  roles.surfaceContainerLowest = hexFromArgb(MaterialDynamicColors.surfaceContainerLowest.getArgb(scheme))
  roles.surfaceContainerLow = hexFromArgb(MaterialDynamicColors.surfaceContainerLow.getArgb(scheme))
  roles.surfaceContainer = hexFromArgb(MaterialDynamicColors.surfaceContainer.getArgb(scheme))
  roles.surfaceContainerHigh = hexFromArgb(MaterialDynamicColors.surfaceContainerHigh.getArgb(scheme))
  roles.surfaceContainerHighest = hexFromArgb(MaterialDynamicColors.surfaceContainerHighest.getArgb(scheme))
  
  // Outline 系列
  roles.outline = hexFromArgb(MaterialDynamicColors.outline.getArgb(scheme))
  roles.outlineVariant = hexFromArgb(MaterialDynamicColors.outlineVariant.getArgb(scheme))
  
  // 其他
  roles.inverseSurface = hexFromArgb(MaterialDynamicColors.inverseSurface.getArgb(scheme))
  roles.inverseOnSurface = hexFromArgb(MaterialDynamicColors.inverseOnSurface.getArgb(scheme))
  roles.inversePrimary = hexFromArgb(MaterialDynamicColors.inversePrimary.getArgb(scheme))
  roles.shadow = hexFromArgb(MaterialDynamicColors.shadow.getArgb(scheme))
  roles.scrim = hexFromArgb(MaterialDynamicColors.scrim.getArgb(scheme))
  roles.background = hexFromArgb(MaterialDynamicColors.background.getArgb(scheme))
  roles.onBackground = hexFromArgb(MaterialDynamicColors.onBackground.getArgb(scheme))
  
  return roles
}

/**
 * 提取调色板信息
 */
function extractPalettes(theme) {
  const tones = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
  
  const extractTones = (palette) => {
    const result = {}
    for (const tone of tones) {
      result[tone] = hexFromArgb(palette.tone(tone))
    }
    return result
  }
  
  return {
    primary: extractTones(theme.palettes.primary),
    secondary: extractTones(theme.palettes.secondary),
    tertiary: extractTones(theme.palettes.tertiary),
    neutral: extractTones(theme.palettes.neutral),
    neutralVariant: extractTones(theme.palettes.neutralVariant),
    error: extractTones(theme.palettes.error)
  }
}

/**
 * 提取自定义颜色角色
 */
function extractCustomColors(theme, isDark, contrastLevel) {
  if (!theme.customColors || theme.customColors.length === 0) {
    return []
  }
  
  return theme.customColors.map(customColor => {
    const scheme = isDark ? customColor.dark : customColor.light
    return {
      name: customColor.color.name,
      value: hexFromArgb(customColor.color.value),
      roles: {
        color: hexFromArgb(scheme.color),
        onColor: hexFromArgb(scheme.onColor),
        colorContainer: hexFromArgb(scheme.colorContainer),
        onColorContainer: hexFromArgb(scheme.onColorContainer)
      }
    }
  })
}

/**
 * 生成单个色调调色板
 * @param {number} hue - 色相 (0-360)
 * @param {number} chroma - 色度
 * @returns {Object} 色调调色板
 */
export function generateTonalPalette(hue, chroma) {
  const palette = TonalPalette.fromHueAndChroma(hue, chroma)
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100]
  
  const result = {}
  for (const tone of tones) {
    result[tone] = hexFromArgb(palette.tone(tone))
  }
  
  return result
}

/**
 * 将颜色与源颜色协调
 * @param {string} colorHex - 要协调的颜色
 * @param {string} sourceHex - 源颜色
 * @returns {string} 协调后的颜色
 */
export function harmonizeColor(colorHex, sourceHex) {
  const colorArgb = argbFromHex(colorHex)
  const sourceArgb = argbFromHex(sourceHex)
  const harmonizedArgb = Blend.harmonize(colorArgb, sourceArgb)
  return hexFromArgb(harmonizedArgb)
}

/**
 * 将主题导出为 JSON 格式
 * @param {Object} theme - 主题对象
 * @param {Object} options - 导出选项
 * @returns {string} JSON 字符串
 */
export function exportThemeToJson(theme, options = {}) {
  const {
    includeLight = true,
    includeDark = true,
    includePalettes = true,
    includeCustomColors = true,
    selectedRoles = null // null 表示全部
  } = options
  
  const output = {
    source: theme.source,
    contrastLevel: theme.contrastLevel
  }
  
  if (includePalettes) {
    output.palettes = theme.palettes
  }
  
  const filterRoles = (roles) => {
    if (!selectedRoles) return roles
    const filtered = {}
    for (const role of selectedRoles) {
      if (roles[role]) {
        filtered[role] = roles[role]
      }
    }
    return filtered
  }
  
  if (includeLight || includeDark) {
    output.schemes = {}
    if (includeLight) {
      output.schemes.light = filterRoles(theme.lightRoles || theme.colorRoles)
    }
    if (includeDark) {
      output.schemes.dark = filterRoles(theme.darkRoles || theme.colorRoles)
    }
  }
  
  if (includeCustomColors && theme.customColors?.length > 0) {
    output.customColors = theme.customColors
  }
  
  return JSON.stringify(output, null, 2)
}

/**
 * HEX 颜色验证
 */
export function isValidHex(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

/**
 * ARGB 转 HEX
 */
export { hexFromArgb, argbFromHex }
