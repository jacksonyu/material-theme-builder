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
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeFruitSalad,
  SchemeRainbow,
  DynamicScheme,
  Variant,
} from '@ktibow/material-color-utilities-nightly'

// =====================
// 类型定义
// =====================

export const SpecVersion = {
  SPEC_2021: 'spec2021',
  SPEC_2025: 'spec2025'
} as const

export type SpecVersionType = typeof SpecVersion[keyof typeof SpecVersion]

export const SPEC_VERSION_INFO: Record<SpecVersionType, { name: string; description: string }> = {
  [SpecVersion.SPEC_2021]: {
    name: 'Spec 2021',
    description: '支持低对比度（对比度 < 0）'
  },
  [SpecVersion.SPEC_2025]: {
    name: 'Spec 2025',
    description: '最新规范，不支持低对比度'
  }
}

export const SchemeVariant = {
  CONTENT: 'content',
  TONAL_SPOT: 'tonalSpot',
  EXPRESSIVE: 'expressive',
  FIDELITY: 'fidelity',
  MONOCHROME: 'monochrome',
  NEUTRAL: 'neutral',
  FRUIT_SALAD: 'fruitSalad',
  RAINBOW: 'rainbow'
} as const

export type SchemeVariantType = typeof SchemeVariant[keyof typeof SchemeVariant]

export const SCHEME_VARIANT_INFO: Record<SchemeVariantType, { name: string; description: string }> = {
  [SchemeVariant.TONAL_SPOT]: {
    name: 'Tonal Spot',
    description: '默认 M3 配色方案，平衡且通用'
  },
  [SchemeVariant.CONTENT]: {
    name: 'Content',
    description: '将源颜色放入 primaryContainer，适合内容优先的界面'
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

export interface CustomColor {
  id: number
  name: string
  value: string
  harmonize: boolean
}

export interface CustomColorRole {
  name: string
  value: string
  roles: {
    color: string
    onColor: string
    colorContainer: string
    onColorContainer: string
  }
}

/**
 * 关键色覆盖 - 用于手动指定关键色板的源颜色
 * 使用高保真策略生成色板（保留输入颜色的 Hue 和 Chroma）
 */
export interface KeyColorOverrides {
  primary?: string      // hex
  secondary?: string
  tertiary?: string
  neutral?: string
  neutralVariant?: string
  error?: string
}

/**
 * 单个 Tone 改写配置
 */
export interface ToneOverride {
  role: string    // color role 名称
  tone: number    // 0-100
}

/**
 * Tone 改写配置（按亮暗模式区分）
 */
export interface ToneOverrides {
  light: ToneOverride[]
  dark: ToneOverride[]
}

/**
 * 所有标准 Color Role 名称
 */
export const ALL_COLOR_ROLES = [
  // Primary 系列
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  // Secondary 系列
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  // Tertiary 系列
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
  // Error 系列
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  // Surface 系列
  'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
  'surfaceDim', 'surfaceBright',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer',
  'surfaceContainerHigh', 'surfaceContainerHighest',
  // Outline 系列
  'outline', 'outlineVariant',
  // 其他
  'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  'shadow', 'scrim', 'background', 'onBackground'
] as const

export type ColorRoleName = typeof ALL_COLOR_ROLES[number]

/**
 * Color Role 到 Palette 的映射
 * 用于在 Tone 改写时确定从哪个色板取色
 */
export const ROLE_TO_PALETTE: Record<string, 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutralVariant' | 'error'> = {
  // Primary
  primary: 'primary', onPrimary: 'primary', primaryContainer: 'primary', onPrimaryContainer: 'primary',
  primaryFixed: 'primary', primaryFixedDim: 'primary', onPrimaryFixed: 'primary', onPrimaryFixedVariant: 'primary',
  inversePrimary: 'primary',
  // Secondary
  secondary: 'secondary', onSecondary: 'secondary', secondaryContainer: 'secondary', onSecondaryContainer: 'secondary',
  secondaryFixed: 'secondary', secondaryFixedDim: 'secondary', onSecondaryFixed: 'secondary', onSecondaryFixedVariant: 'secondary',
  // Tertiary
  tertiary: 'tertiary', onTertiary: 'tertiary', tertiaryContainer: 'tertiary', onTertiaryContainer: 'tertiary',
  tertiaryFixed: 'tertiary', tertiaryFixedDim: 'tertiary', onTertiaryFixed: 'tertiary', onTertiaryFixedVariant: 'tertiary',
  // Error
  error: 'error', onError: 'error', errorContainer: 'error', onErrorContainer: 'error',
  // Neutral
  surface: 'neutral', onSurface: 'neutral', surfaceDim: 'neutral', surfaceBright: 'neutral',
  surfaceContainerLowest: 'neutral', surfaceContainerLow: 'neutral', surfaceContainer: 'neutral',
  surfaceContainerHigh: 'neutral', surfaceContainerHighest: 'neutral',
  inverseSurface: 'neutral', inverseOnSurface: 'neutral',
  background: 'neutral', onBackground: 'neutral',
  shadow: 'neutral', scrim: 'neutral',
  // NeutralVariant
  surfaceVariant: 'neutralVariant', onSurfaceVariant: 'neutralVariant',
  outline: 'neutralVariant', outlineVariant: 'neutralVariant'
}

export interface GenerateThemeOptions {
  contrastLevel?: number
  isDark?: boolean
  variant?: SchemeVariantType
  specVersion?: SpecVersionType
  customColors?: CustomColor[]
  keyColorOverrides?: KeyColorOverrides
  toneOverrides?: ToneOverrides
}

export interface Theme {
  source: string
  isDark: boolean
  contrastLevel: number
  colorRoles: Record<string, string>
  palettes: Record<string, Record<number, string>>
  customColors: CustomColorRole[]
}

// =====================
// 内部函数
// =====================

function createScheme(
  sourceColorHct: Hct,
  isDark: boolean,
  contrastLevel: number,
  variant: SchemeVariantType,
  specVersion: SpecVersionType
): DynamicScheme {
  const specVersionStr = specVersion === SpecVersion.SPEC_2021 ? '2021' : '2025'
  const adjustedContrastLevel = specVersion === SpecVersion.SPEC_2025 && contrastLevel < 0 
    ? 0 
    : contrastLevel

  switch (variant) {
    case SchemeVariant.TONAL_SPOT:
      return new SchemeTonalSpot(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
    case SchemeVariant.CONTENT:
      return new SchemeContent(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr)
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
 * 将字符串类型的 variant 转换为 Variant 枚举
 */
function getVariantEnum(variant: SchemeVariantType): Variant {
  switch (variant) {
    case SchemeVariant.TONAL_SPOT:
      return Variant.TONAL_SPOT
    case SchemeVariant.CONTENT:
      return Variant.CONTENT
    case SchemeVariant.EXPRESSIVE:
      return Variant.EXPRESSIVE
    case SchemeVariant.FIDELITY:
      return Variant.FIDELITY
    case SchemeVariant.MONOCHROME:
      return Variant.MONOCHROME
    case SchemeVariant.NEUTRAL:
      return Variant.NEUTRAL
    case SchemeVariant.FRUIT_SALAD:
      return Variant.FRUIT_SALAD
    case SchemeVariant.RAINBOW:
      return Variant.RAINBOW
    default:
      return Variant.TONAL_SPOT
  }
}

function extractColorRoles(scheme: DynamicScheme): Record<string, string> {
  const roles: Record<string, string> = {}
  
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

function extractPalettes(theme: any): Record<string, Record<number, string>> {
  const tones = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
  
  const extractTones = (palette: any): Record<number, string> => {
    const result: Record<number, string> = {}
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
 * 从 HCT 色彩创建高保真 TonalPalette
 */
function createFidelityPalette(hex: string): TonalPalette {
  const hct = Hct.fromInt(argbFromHex(hex))
  return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma)
}

/**
 * 从 TonalPalette 提取 tone 值映射表
 */
function tonalPaletteToRecord(palette: TonalPalette): Record<number, string> {
  const tones = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
  const result: Record<number, string> = {}
  for (const tone of tones) {
    result[tone] = hexFromArgb(palette.tone(tone))
  }
  return result
}

function extractCustomColors(theme: any, isDark: boolean): CustomColorRole[] {
  if (!theme.customColors || theme.customColors.length === 0) {
    return []
  }
  
  return theme.customColors.map((customColor: any) => {
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
 * 应用 Tone 改写
 * @param colorRoles 基础颜色角色
 * @param palettes 调色板（用于取色）
 * @param toneOverrides 改写配置
 * @param isDark 是否暗色模式
 * @param customColorRoles 自定义颜色角色（可选，用于拓展颜色 tone 改写）
 */
function applyToneOverrides(
  colorRoles: Record<string, string>,
  palettes: Record<string, Record<number, string>>,
  toneOverrides: ToneOverrides | undefined,
  isDark: boolean,
  customColorRoles?: CustomColorRole[]
): Record<string, string> {
  if (!toneOverrides) return colorRoles
  
  const overrides = isDark ? toneOverrides.dark : toneOverrides.light
  if (!overrides || overrides.length === 0) return colorRoles
  
  const result = { ...colorRoles }
  
  for (const override of overrides) {
    const { role, tone } = override
    const paletteKey = ROLE_TO_PALETTE[role]
    
    if (paletteKey && palettes[paletteKey]) {
      // 标准 role：从对应调色板中取指定 tone 的颜色
      const palette = palettes[paletteKey]
      if (palette[tone] !== undefined) {
        result[role] = palette[tone]
      } else {
        // 如果调色板中没有该 tone，需要从 TonalPalette 重新计算
        const hct = Hct.fromInt(argbFromHex(palette[50]))
        const tonalPalette = TonalPalette.fromHueAndChroma(hct.hue, hct.chroma)
        result[role] = hexFromArgb(tonalPalette.tone(tone))
      }
    } else if (customColorRoles && customColorRoles.length > 0) {
      // 检查是否是自定义颜色的 role
      for (const customColor of customColorRoles) {
        const baseName = customColor.name.toLowerCase().replace(/\s+/g, '')
        const capitalizedName = baseName.charAt(0).toUpperCase() + baseName.slice(1)
        
        // 检查是否匹配自定义颜色的 role 名称
        const customRoleNames = [
          baseName,                    // color
          `on${capitalizedName}`,       // onColor
          `${baseName}Container`,       // colorContainer
          `on${capitalizedName}Container` // onColorContainer
        ]
        
        if (customRoleNames.includes(role)) {
          // 从自定义颜色的原始值创建调色板并取 tone
          const customHct = Hct.fromInt(argbFromHex(customColor.value))
          const customPalette = TonalPalette.fromHueAndChroma(customHct.hue, customHct.chroma)
          result[role] = hexFromArgb(customPalette.tone(tone))
          break
        }
      }
    }
  }
  
  return result
}

/**
 * 应用拓展颜色（自定义颜色）的 Tone 改写
 * @param customColorRoles 自定义颜色角色
 * @param toneOverrides 改写配置
 * @param isDark 是否暗色模式
 */
function applyCustomColorToneOverrides(
  customColorRoles: CustomColorRole[],
  toneOverrides: ToneOverrides | undefined,
  isDark: boolean
): CustomColorRole[] {
  if (!toneOverrides || customColorRoles.length === 0) return customColorRoles
  
  const overrides = isDark ? toneOverrides.dark : toneOverrides.light
  if (!overrides || overrides.length === 0) return customColorRoles
  
  return customColorRoles.map(customColor => {
    const baseName = customColor.name.toLowerCase().replace(/\s+/g, '')
    const capitalizedName = baseName.charAt(0).toUpperCase() + baseName.slice(1)
    
    // 从原始颜色创建调色板
    const customHct = Hct.fromInt(argbFromHex(customColor.value))
    const customPalette = TonalPalette.fromHueAndChroma(customHct.hue, customHct.chroma)
    
    // 创建 role 名称到属性名的映射
    const roleMapping: Record<string, keyof typeof customColor.roles> = {
      [baseName]: 'color',
      [`on${capitalizedName}`]: 'onColor',
      [`${baseName}Container`]: 'colorContainer',
      [`on${capitalizedName}Container`]: 'onColorContainer'
    }
    
    // 检查是否有改写
    const newRoles = { ...customColor.roles }
    for (const override of overrides) {
      const roleKey = roleMapping[override.role]
      if (roleKey) {
        newRoles[roleKey] = hexFromArgb(customPalette.tone(override.tone))
      }
    }
    
    return {
      ...customColor,
      roles: newRoles
    }
  })
}

// =====================
// 公开 API
// =====================

/**
 * 从源颜色生成完整的 M3 主题
 */
export function generateThemeFromColor(sourceColorHex: string, options: GenerateThemeOptions = {}): Theme {
  const { 
    contrastLevel = 0, 
    isDark = false, 
    variant = SchemeVariant.TONAL_SPOT,
    specVersion = SpecVersion.SPEC_2025,
    customColors = [],
    keyColorOverrides,
    toneOverrides
  } = options
  
  const sourceColorArgb = argbFromHex(sourceColorHex)
  const sourceColorHct = Hct.fromInt(sourceColorArgb)
  
  // 使用 themeFromSourceColor 处理自定义颜色（包含 harmonization）
  const theme = themeFromSourceColor(sourceColorArgb, customColors.map(c => ({
    name: c.name,
    value: argbFromHex(c.value),
    blend: c.harmonize ?? true
  })))
  
  // 创建基础 scheme
  const baseScheme = createScheme(sourceColorHct, isDark, contrastLevel, variant, specVersion)
  
  // 提取基础色板（from themeFromSourceColor）
  let palettes = extractPalettes(theme)
  
  // 如果有关键色覆盖，应用高保真策略生成新色板
  if (keyColorOverrides) {
    if (keyColorOverrides.primary) {
      palettes.primary = tonalPaletteToRecord(createFidelityPalette(keyColorOverrides.primary))
    }
    if (keyColorOverrides.secondary) {
      palettes.secondary = tonalPaletteToRecord(createFidelityPalette(keyColorOverrides.secondary))
    }
    if (keyColorOverrides.tertiary) {
      palettes.tertiary = tonalPaletteToRecord(createFidelityPalette(keyColorOverrides.tertiary))
    }
    if (keyColorOverrides.neutral) {
      palettes.neutral = tonalPaletteToRecord(createFidelityPalette(keyColorOverrides.neutral))
    }
    if (keyColorOverrides.neutralVariant) {
      palettes.neutralVariant = tonalPaletteToRecord(createFidelityPalette(keyColorOverrides.neutralVariant))
    }
    if (keyColorOverrides.error) {
      palettes.error = tonalPaletteToRecord(createFidelityPalette(keyColorOverrides.error))
    }
  }
  
  // 创建用于生成 colorRoles 的 scheme
  // 如果有关键色覆盖，需要创建一个注入了自定义 palette 的 DynamicScheme
  let colorRoles: Record<string, string>
  
  if (keyColorOverrides && Object.keys(keyColorOverrides).length > 0) {
    // 使用自定义 palette 创建新的 DynamicScheme
    const specVersionStr = specVersion === SpecVersion.SPEC_2021 ? '2021' : '2025'
    const adjustedContrastLevel = specVersion === SpecVersion.SPEC_2025 && contrastLevel < 0 
      ? 0 
      : contrastLevel
    
    // 创建 TonalPalette 对象用于 DynamicScheme
    // 重要：fallback 使用 baseScheme 的 palette，而不是 theme.palettes
    // 因为 baseScheme 使用正确的 variant，而 theme 总是使用 Tonal Spot
    const primaryPalette = keyColorOverrides.primary 
      ? createFidelityPalette(keyColorOverrides.primary)
      : baseScheme.primaryPalette
    const secondaryPalette = keyColorOverrides.secondary
      ? createFidelityPalette(keyColorOverrides.secondary)
      : baseScheme.secondaryPalette
    const tertiaryPalette = keyColorOverrides.tertiary
      ? createFidelityPalette(keyColorOverrides.tertiary)
      : baseScheme.tertiaryPalette
    const neutralPalette = keyColorOverrides.neutral
      ? createFidelityPalette(keyColorOverrides.neutral)
      : baseScheme.neutralPalette
    const neutralVariantPalette = keyColorOverrides.neutralVariant
      ? createFidelityPalette(keyColorOverrides.neutralVariant)
      : baseScheme.neutralVariantPalette
    const errorPalette = keyColorOverrides.error
      ? createFidelityPalette(keyColorOverrides.error)
      : baseScheme.errorPalette
    
    // 创建自定义 DynamicScheme
    const customScheme = new DynamicScheme({
      sourceColorHct,
      variant: getVariantEnum(variant),
      isDark,
      contrastLevel: adjustedContrastLevel,
      primaryPalette,
      secondaryPalette,
      tertiaryPalette,
      neutralPalette,
      neutralVariantPalette,
      errorPalette,
      specVersion: specVersionStr
    })
    
    colorRoles = extractColorRoles(customScheme)
  } else {
    // 无覆盖，直接使用基础 scheme
    colorRoles = extractColorRoles(baseScheme)
  }
  
  // 应用 Tone 改写
  // 注意：需要先提取 customColorRoles 以支持拓展颜色的 tone 改写
  let customColorRoles = extractCustomColors(theme, isDark)
  colorRoles = applyToneOverrides(colorRoles, palettes, toneOverrides, isDark, customColorRoles)
  
  // 应用拓展颜色的 Tone 改写
  customColorRoles = applyCustomColorToneOverrides(customColorRoles, toneOverrides, isDark)
  
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
 * 生成单个色调调色板
 */
export function generateTonalPalette(hue: number, chroma: number): Record<number, string> {
  const palette = TonalPalette.fromHueAndChroma(hue, chroma)
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100]
  
  const result: Record<number, string> = {}
  for (const tone of tones) {
    result[tone] = hexFromArgb(palette.tone(tone))
  }
  
  return result
}

/**
 * 将颜色与源颜色协调
 */
export function harmonizeColor(colorHex: string, sourceHex: string): string {
  const colorArgb = argbFromHex(colorHex)
  const sourceArgb = argbFromHex(sourceHex)
  const harmonizedArgb = Blend.harmonize(colorArgb, sourceArgb)
  return hexFromArgb(harmonizedArgb)
}

export interface ExportOptions {
  includeLight?: boolean
  includeDark?: boolean
  includePalettes?: boolean
  includeCustomColors?: boolean
  selectedRoles?: string[] | null
}

/**
 * 将主题导出为 JSON 格式
 */
export function exportThemeToJson(theme: any, options: ExportOptions = {}): string {
  const {
    includeLight = true,
    includeDark = true,
    includePalettes = true,
    includeCustomColors = true,
    selectedRoles = null
  } = options
  
  const output: any = {
    source: theme.source,
    contrastLevel: theme.contrastLevel
  }
  
  if (includePalettes) {
    output.palettes = theme.palettes
  }
  
  const filterRoles = (roles: Record<string, string>): Record<string, string> => {
    if (!selectedRoles) return roles
    const filtered: Record<string, string> = {}
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
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export { hexFromArgb, argbFromHex }
