# Material Theme Builder

基于 Material Design 3 动态颜色系统的主题构建器，帮助开发者快速创建符合 Material Design 3 规范的配色方案。

## 功能特性

### 核心功能
- **动态颜色生成**: 从单个源颜色自动生成完整的 Material Design 3 主题
- **多种配色方案**: 支持 8 种不同的配色方案变体
  - Tonal Spot（默认，平衡通用）
  - Content（内容优先）
  - Expressive（富有表现力）
  - Fidelity（忠实于源颜色）
  - Monochrome（单色方案）
  - Neutral（中性柔和）
  - Fruit Salad（多彩组合）
  - Rainbow（彩虹色调）

### 高级定制
- **对比度调节**: 支持 -1 到 1 的对比度级别调整
- **亮暗模式**: 实时预览亮色和暗色主题
- **自定义颜色**: 添加额外的品牌色并自动协调
- **关键色覆盖**: 手动指定关键色板的源颜色
- **Tone 改写**: 精确控制各个颜色角色的色调级别

### 预览与导出
- **实时预览**: 手机预览和主题预览组件
- **调色板展示**: 查看所有色板的完整色调范围
- **主题导出**: 导出为 JSON 格式，支持自定义导出选项
- **剪贴板复制**: 一键复制主题配置

## 技术栈

- **Vue 3**: 使用 Composition API 和 `<script setup>` 语法
- **TypeScript**: 完整的类型支持
- **Vite**: 快速的开发构建工具
- **@ktibow/material-color-utilities-nightly**: Material Design 3 颜色工具库

## 项目结构

```
src/
├── components/           # Vue 组件
│   ├── ColorPicker.vue          # 颜色选择器
│   ├── ContrastSlider.vue       # 对比度滑块
│   ├── SpecVersionSelector.vue  # Spec 版本选择器
│   ├── VariantSelector.vue      # 配色方案变体选择器
│   ├── KeyColorEditor.vue       # 关键色编辑器
│   ├── ToneOverridePanel.vue    # Tone 改写面板
│   ├── CustomColorEditor.vue    # 自定义颜色编辑器
│   ├── PhonePreview.vue         # 手机预览
│   ├── ThemePreview.vue         # 主题预览
│   ├── PalettePreview.vue      # 调色板预览
│   ├── ExportPanel.vue          # 导出面板
│   └── ColorRoleCard.vue        # 颜色角色卡片
├── composables/          # 组合式函数
│   └── useTheme.ts              # 主题状态管理
├── services/             # 服务层
│   └── color-service.ts         # 颜色服务（封装 M3 工具库）
├── App.vue               # 主应用组件
└── main.ts               # 应用入口
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用指南

### 1. 选择源颜色
使用左侧的颜色选择器选择你的品牌色或主题色，系统会自动生成对应的 Material Design 3 主题。

### 2. 调整配色方案
在左侧面板选择不同的配色方案变体，找到最适合你应用的设计风格。

### 3. 调节对比度
使用对比度滑块调整主题的对比度级别，确保内容在不同环境下都清晰可读。

### 4. 预览主题
在中间区域可以实时预览主题效果：
- **手机预览**: 查看在移动设备上的实际效果
- **主题预览**: 查看所有颜色角色的实际应用
- **调色板预览**: 查看完整色板的色调分布

### 5. 自定义颜色
添加自定义颜色以扩展品牌色系，系统会自动协调这些颜色与主题的和谐性。

### 6. 导出主题
在右侧面板导出主题配置，支持：
- 选择导出亮色/暗色主题
- 选择是否包含调色板
- 选择是否包含自定义颜色
- 下载 JSON 文件或复制到剪贴板

## Color Roles

Material Design 3 定义了以下颜色角色：

### Primary 系列
- `primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`
- `primaryFixed`, `primaryFixedDim`, `onPrimaryFixed`, `onPrimaryFixedVariant`

### Secondary 系列
- `secondary`, `onSecondary`, `secondaryContainer`, `onSecondaryContainer`
- `secondaryFixed`, `secondaryFixedDim`, `onSecondaryFixed`, `onSecondaryFixedVariant`

### Tertiary 系列
- `tertiary`, `onTertiary`, `tertiaryContainer`, `onTertiaryContainer`
- `tertiaryFixed`, `tertiaryFixedDim`, `onTertiaryFixed`, `onTertiaryFixedVariant`

### Error 系列
- `error`, `onError`, `errorContainer`, `onErrorContainer`

### Surface 系列
- `surface`, `onSurface`, `surfaceVariant`, `onSurfaceVariant`
- `surfaceDim`, `surfaceBright`
- `surfaceContainerLowest`, `surfaceContainerLow`, `surfaceContainer`
- `surfaceContainerHigh`, `surfaceContainerHighest`

### Outline 系列
- `outline`, `outlineVariant`

### 其他
- `inverseSurface`, `inverseOnSurface`, `inversePrimary`
- `shadow`, `scrim`, `background`, `onBackground`

## Spec 版本

- **Spec 2021**: 支持低对比度（对比度 < 0）
- **Spec 2025**: 最新规范，不支持低对比度

## 导出格式

导出的 JSON 采用官方 Material Theme Builder 格式，包含以下结构：

```json
{
  "description": "TYPE: CUSTOM\nMaterial Theme Builder export 2026-01-08 12:34:56",
  "seed": "#6750A4",
  "coreColors": {
    "primary": "#6750A4"
  },
  "extendedColors": [
    {
      "name": "customcolor",
      "color": "#FF6B6B",
      "description": "",
      "harmonized": true
    }
  ],
  "schemes": {
    "light": {
      "primary": "#6750A4",
      "onPrimary": "#FFFFFF",
      "primaryContainer": "#EADDFF",
      "onPrimaryContainer": "#21005D",
      ...
    },
    "light-medium-contrast": {
      "primary": "#4A3C7A",
      ...
    },
    "light-high-contrast": {
      "primary": "#281B4E",
      ...
    },
    "dark": {
      "primary": "#D0BCFF",
      "onPrimary": "#381E72",
      ...
    },
    "dark-medium-contrast": {
      "primary": "#D6C2FF",
      ...
    },
    "dark-high-contrast": {
      "primary": "#FFFFFF",
      ...
    }
  },
  "palettes": {
    "primary": {
      "0": "#000000",
      "5": "#1D1B26",
      "10": "#322F3D",
      ...
    },
    "secondary": {
      "0": "#000000",
      ...
    },
    "tertiary": {
      "0": "#000000",
      ...
    },
    "neutral": {
      "0": "#000000",
      ...
    },
    "neutral-variant": {
      "0": "#000000",
      ...
    }
  }
}
```

### 格式说明

- **description**: 导出描述，包含类型和时间戳
- **seed**: 源颜色（种子颜色）
- **coreColors**: 核心颜色配置
- **extendedColors**: 扩展颜色（自定义颜色）数组
- **schemes**: 包含 6 种配色方案变体
  - `light`: 标准亮色主题
  - `light-medium-contrast`: 中等对比度亮色主题
  - `light-high-contrast`: 高对比度亮色主题
  - `dark`: 标准暗色主题
  - `dark-medium-contrast`: 中等对比度暗色主题
  - `dark-high-contrast`: 高对比度暗色主题
- **palettes**: 完整的调色板，包含以下 tone 级别：0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT

## 相关资源

- [Material Design 3 官方文档](https://m3.material.io/)
- [Material Color Utilities](https://www.npmjs.com/package/@ktibow/material-color-utilities-nightly)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
