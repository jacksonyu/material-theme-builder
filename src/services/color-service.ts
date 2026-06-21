/**
 * 颜色服务层 - 封装 @ktibow/material-color-utilities-nightly
 */
import {
  argbFromHex,
  hexFromArgb,
  TonalPalette,
  Hct,
  Blend,
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
  type Platform,
  SchemeCmf,
} from '@ktibow/material-color-utilities-nightly'

// =====================
// 类型定义
// =====================

export const SpecVersion = {
  SPEC_2021: 'spec2021',
  SPEC_2025: 'spec2025',
  SPEC_2026: 'spec2026'
} as const

export type SpecVersionType = typeof SpecVersion[keyof typeof SpecVersion]

export const SPEC_VERSION_INFO: Record<SpecVersionType, { name: string; description: string }> = {
  [SpecVersion.SPEC_2021]: {
    name: 'Spec 2021',
    description: '支持低对比度（对比度 < 0）'
  },
  [SpecVersion.SPEC_2025]: {
    name: 'Spec 2025',
    description: '2025 规范，不支持低对比度'
  },
  [SpecVersion.SPEC_2026]: {
    name: 'Spec 2026',
    description: '最新 2026 规范，不支持低对比度'
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
  RAINBOW: 'rainbow',
  CMF: 'cmf'
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
  },
  [SchemeVariant.CMF]: {
    name: 'CMF',
    description: 'CMF 配色方案，适用于硬件产品与工业设计'
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
  'primary', 'primaryDim', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  // Secondary 系列
  'secondary', 'secondaryDim', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  // Tertiary 系列
  'tertiary', 'tertiaryDim', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
  // Error 系列
  'error', 'errorDim', 'onError', 'errorContainer', 'onErrorContainer',
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
  primary: 'primary', primaryDim: 'primary', onPrimary: 'primary', primaryContainer: 'primary', onPrimaryContainer: 'primary',
  primaryFixed: 'primary', primaryFixedDim: 'primary', onPrimaryFixed: 'primary', onPrimaryFixedVariant: 'primary',
  inversePrimary: 'primary',
  // Secondary
  secondary: 'secondary', secondaryDim: 'secondary', onSecondary: 'secondary', secondaryContainer: 'secondary', onSecondaryContainer: 'secondary',
  secondaryFixed: 'secondary', secondaryFixedDim: 'secondary', onSecondaryFixed: 'secondary', onSecondaryFixedVariant: 'secondary',
  // Tertiary
  tertiary: 'tertiary', tertiaryDim: 'tertiary', onTertiary: 'tertiary', tertiaryContainer: 'tertiary', onTertiaryContainer: 'tertiary',
  tertiaryFixed: 'tertiary', tertiaryFixedDim: 'tertiary', onTertiaryFixed: 'tertiary', onTertiaryFixedVariant: 'tertiary',
  // Error
  error: 'error', errorDim: 'error', onError: 'error', errorContainer: 'error', onErrorContainer: 'error',
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
  platform?: Platform
  customColors?: CustomColor[]
  keyColorOverrides?: KeyColorOverrides
  toneOverrides?: ToneOverrides
}

export interface Theme {
  source: string
  isDark: boolean
  contrastLevel: number
  platform: Platform
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
  specVersion: SpecVersionType,
  platform: Platform = 'phone'
): DynamicScheme {
  let specVersionStr: '2021' | '2025' | '2026' = '2025'
  if (specVersion === SpecVersion.SPEC_2021) {
    specVersionStr = '2021'
  } else if (specVersion === SpecVersion.SPEC_2026) {
    specVersionStr = '2026'
  }
  
  const adjustedContrastLevel = (specVersion === SpecVersion.SPEC_2025 || specVersion === SpecVersion.SPEC_2026) && contrastLevel < 0 
    ? 0 
    : contrastLevel

  switch (variant) {
    case SchemeVariant.TONAL_SPOT:
      return new SchemeTonalSpot(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.CONTENT:
      return new SchemeContent(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.EXPRESSIVE:
      return new SchemeExpressive(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.FIDELITY:
      return new SchemeFidelity(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.MONOCHROME:
      return new SchemeMonochrome(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.NEUTRAL:
      return new SchemeNeutral(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.FRUIT_SALAD:
      return new SchemeFruitSalad(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.RAINBOW:
      return new SchemeRainbow(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    case SchemeVariant.CMF:
      return new SchemeCmf(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
    default:
      return new SchemeTonalSpot(sourceColorHct, isDark, adjustedContrastLevel, specVersionStr, platform)
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
    case SchemeVariant.CMF:
      return Variant.CMF
    default:
      return Variant.TONAL_SPOT
  }
}

function extractColorRoles(scheme: DynamicScheme): Record<string, string> {
  const roles: Record<string, string> = {}
  // DynamicScheme 实例直接暴露 scheme[role] 属性返回 ARGB 值
  const schemeAny = scheme as unknown as Record<string, number>
  for (const role of ALL_COLOR_ROLES) {
    const argbValue = schemeAny[role]
    if (typeof argbValue === 'number') {
      roles[role] = hexFromArgb(argbValue)
    }
  }
  return roles
}

function extractPalettes(scheme: DynamicScheme): Record<string, Record<number, string>> {
  const tones = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
  
  const extractTones = (palette: TonalPalette): Record<number, string> => {
    const result: Record<number, string> = {}
    for (const tone of tones) {
      result[tone] = hexFromArgb(palette.tone(tone))
    }
    return result
  }
  
  return {
    primary: extractTones(scheme.primaryPalette),
    secondary: extractTones(scheme.secondaryPalette),
    tertiary: extractTones(scheme.tertiaryPalette),
    neutral: extractTones(scheme.neutralPalette),
    neutralVariant: extractTones(scheme.neutralVariantPalette),
    error: extractTones(scheme.errorPalette)
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

/**
 * 生成自定义颜色的 UI 角色
 * 遵循 MCU 笔记中的协调 -> 建系 -> 映射流程
 */
function generateCustomColorRoles(
  customColors: CustomColor[],
  sourceColorArgb: number,
  isDark: boolean,
  isMonochrome: boolean
): CustomColorRole[] {
  return customColors.map(customColor => {
    const customArgb = argbFromHex(customColor.value)
    
    // 步骤 1: 协调（可选）
    const harmonizedArgb = customColor.harmonize
      ? Blend.harmonize(customArgb, sourceColorArgb)
      : customArgb
    const harmonizedHct = Hct.fromInt(harmonizedArgb)
    
    // 步骤 2: 生成高保真色板
    const palette = TonalPalette.fromHueAndChroma(harmonizedHct.hue, harmonizedHct.chroma)
    
    // 步骤 3: 映射 UI 角色
    return {
      name: customColor.name,
      value: customColor.value,
      roles: {
        color: hexFromArgb(palette.tone(isDark ? 80 : 40)),
        onColor: hexFromArgb(palette.tone(isDark ? 20 : 100)),
        colorContainer: hexFromArgb(palette.tone(isDark ? 30 : 90)),
        onColorContainer: hexFromArgb(palette.tone(isDark ? 90 : (isMonochrome ? 10 : 30)))
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
  scheme: DynamicScheme,
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
    
    if (paletteKey) {
      let tonalPalette: TonalPalette | undefined
      switch (paletteKey) {
        case 'primary':
          tonalPalette = scheme.primaryPalette
          break
        case 'secondary':
          tonalPalette = scheme.secondaryPalette
          break
        case 'tertiary':
          tonalPalette = scheme.tertiaryPalette
          break
        case 'neutral':
          tonalPalette = scheme.neutralPalette
          break
        case 'neutralVariant':
          tonalPalette = scheme.neutralVariantPalette
          break
        case 'error':
          tonalPalette = scheme.errorPalette
          break
      }
      
      if (tonalPalette) {
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
    platform = 'phone',
    customColors = [],
    keyColorOverrides,
    toneOverrides
  } = options
  
  const sourceColorArgb = argbFromHex(sourceColorHex)
  const sourceColorHct = Hct.fromInt(sourceColorArgb)
  const isMonochrome = variant === SchemeVariant.MONOCHROME
  
  // 创建基础 scheme
  const baseScheme = createScheme(sourceColorHct, isDark, contrastLevel, variant, specVersion, platform)
  
  // 从 DynamicScheme 提取基础色板
  let palettes = extractPalettes(baseScheme)
  
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
  let targetScheme = baseScheme
  
  if (keyColorOverrides && Object.keys(keyColorOverrides).length > 0) {
    // 使用自定义 palette 创建新的 DynamicScheme
    let specVersionStr: '2021' | '2025' | '2026' = '2025'
    if (specVersion === SpecVersion.SPEC_2021) {
      specVersionStr = '2021'
    } else if (specVersion === SpecVersion.SPEC_2026) {
      specVersionStr = '2026'
    }
    
    const adjustedContrastLevel = (specVersion === SpecVersion.SPEC_2025 || specVersion === SpecVersion.SPEC_2026) && contrastLevel < 0 
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
      platform,
      primaryPalette,
      secondaryPalette,
      tertiaryPalette,
      neutralPalette,
      neutralVariantPalette,
      errorPalette,
      specVersion: specVersionStr
    })
    
    targetScheme = customScheme
    colorRoles = extractColorRoles(customScheme)
  } else {
    // 无覆盖，直接使用基础 scheme
    colorRoles = extractColorRoles(baseScheme)
  }
  
  // 应用 Tone 改写
  // 注意：需要先生成 customColorRoles 以支持拓展颜色的 tone 改写
  let customColorRoles = generateCustomColorRoles(customColors, sourceColorArgb, isDark, isMonochrome)
  colorRoles = applyToneOverrides(colorRoles, targetScheme, toneOverrides, isDark, customColorRoles)
  
  // 应用拓展颜色的 Tone 改写
  customColorRoles = applyCustomColorToneOverrides(customColorRoles, toneOverrides, isDark)
  
  return {
    source: sourceColorHex,
    isDark,
    contrastLevel,
    platform,
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
 * 将主题导出为 JSON 格式（旧格式，保留兼容）
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

// =====================
// 官方格式导出
// =====================

/**
 * 官方 tone 列表
 */
const OFFICIAL_TONES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100]

/**
 * 官方格式导出选项
 */
export interface OfficialExportOptions {
  sourceColor: string
  variant?: SchemeVariantType
  specVersion?: SpecVersionType
  platform?: Platform
  customColors?: CustomColor[]
  keyColorOverrides?: KeyColorOverrides
  toneOverrides?: ToneOverrides
}

/**
 * 生成符合官方 Theme Builder 格式 the scheme
 */
function generateSchemeForContrast(
  sourceColorHex: string,
  isDark: boolean,
  contrastLevel: number,
  options: OfficialExportOptions
): Record<string, string> {
  const theme = generateThemeFromColor(sourceColorHex, {
    contrastLevel,
    isDark,
    variant: options.variant || SchemeVariant.TONAL_SPOT,
    specVersion: options.specVersion || SpecVersion.SPEC_2025,
    platform: options.platform || 'phone',
    customColors: options.customColors || [],
    keyColorOverrides: options.keyColorOverrides,
    toneOverrides: options.toneOverrides
  })
  
  // 添加 surfaceTint = primary
  const roles = { ...theme.colorRoles }
  roles.surfaceTint = roles.primary
  
  return roles
}

/**
 * 提取官方格式调色板（使用官方 tone 列表）
 */
function extractOfficialPalettes(scheme: DynamicScheme): Record<string, Record<number, string>> {
  const extractTones = (palette: TonalPalette): Record<number, string> => {
    const result: Record<number, string> = {}
    for (const tone of OFFICIAL_TONES) {
      result[tone] = hexFromArgb(palette.tone(tone))
    }
    return result
  }
  
  return {
    primary: extractTones(scheme.primaryPalette),
    secondary: extractTones(scheme.secondaryPalette),
    tertiary: extractTones(scheme.tertiaryPalette),
    neutral: extractTones(scheme.neutralPalette),
    'neutral-variant': extractTones(scheme.neutralVariantPalette)
  }
}

/**
 * 将主题导出为官方 Material Theme Builder JSON 格式
 */
export function exportThemeToOfficialJson(options: OfficialExportOptions): string {
  const { 
    sourceColor, 
    customColors = [], 
    variant = SchemeVariant.TONAL_SPOT, 
    specVersion = SpecVersion.SPEC_2025, 
    platform = 'phone',
    keyColorOverrides 
  } = options
  
  const sourceColorArgb = argbFromHex(sourceColor)
  const sourceColorHct = Hct.fromInt(sourceColorArgb)
  
  // 创建提取官方 palettes 的原始 scheme
  let schemeToExtract = createScheme(sourceColorHct, false, 0, variant, specVersion, platform)
  
  // 如果有关键色覆盖，使用应用覆盖色后的自定义 DynamicScheme 实例来提取调色板
  if (keyColorOverrides && Object.keys(keyColorOverrides).length > 0) {
    let specVersionStr: '2021' | '2025' | '2026' = '2025'
    if (specVersion === SpecVersion.SPEC_2021) {
      specVersionStr = '2021'
    } else if (specVersion === SpecVersion.SPEC_2026) {
      specVersionStr = '2026'
    }
    
    const primaryPalette = keyColorOverrides.primary 
      ? createFidelityPalette(keyColorOverrides.primary)
      : schemeToExtract.primaryPalette
    const secondaryPalette = keyColorOverrides.secondary
      ? createFidelityPalette(keyColorOverrides.secondary)
      : schemeToExtract.secondaryPalette
    const tertiaryPalette = keyColorOverrides.tertiary
      ? createFidelityPalette(keyColorOverrides.tertiary)
      : schemeToExtract.tertiaryPalette
    const neutralPalette = keyColorOverrides.neutral
      ? createFidelityPalette(keyColorOverrides.neutral)
      : schemeToExtract.neutralPalette
    const neutralVariantPalette = keyColorOverrides.neutralVariant
      ? createFidelityPalette(keyColorOverrides.neutralVariant)
      : schemeToExtract.neutralVariantPalette
    const errorPalette = keyColorOverrides.error
      ? createFidelityPalette(keyColorOverrides.error)
      : schemeToExtract.errorPalette
      
    schemeToExtract = new DynamicScheme({
      sourceColorHct,
      variant: getVariantEnum(variant),
      isDark: false,
      contrastLevel: 0,
      platform,
      primaryPalette,
      secondaryPalette,
      tertiaryPalette,
      neutralPalette,
      neutralVariantPalette,
      errorPalette,
      specVersion: specVersionStr
    })
  }
  
  // 获取当前时间戳
  const now = new Date()
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  
  const output: any = {
    description: `TYPE: CUSTOM\nMaterial Theme Builder export ${timestamp}`,
    seed: sourceColor,
    coreColors: {
      primary: sourceColor
    }
  }
  
  // 转换 extendedColors 为官方格式
  if (customColors.length > 0) {
    output.extendedColors = customColors.map(c => ({
      name: c.name.toLowerCase().replace(/\s+/g, ''),
      color: c.value,
      description: '',
      harmonized: c.harmonize
    }))
  }
  
  // 生成 6 种 schemes 变体
  output.schemes = {
    'light': generateSchemeForContrast(sourceColor, false, 0, options),
    'light-medium-contrast': generateSchemeForContrast(sourceColor, false, 0.5, options),
    'light-high-contrast': generateSchemeForContrast(sourceColor, false, 1, options),
    'dark': generateSchemeForContrast(sourceColor, true, 0, options),
    'dark-medium-contrast': generateSchemeForContrast(sourceColor, true, 0.5, options),
    'dark-high-contrast': generateSchemeForContrast(sourceColor, true, 1, options)
  }
  
  // 生成官方格式调色板
  output.palettes = extractOfficialPalettes(schemeToExtract)
  
  return JSON.stringify(output, null, 4)
}

/**
 * HEX 颜色验证
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export { hexFromArgb, argbFromHex }

