<template>
  <div class="phone-preview">
    <h3 class="section-title">App Preview</h3>
    
    <div class="phones-container">
      <!-- 列表页面 -->
      <div class="phone-frame">
        <div class="phone-screen" :style="screenStyle">
          <!-- 状态栏 -->
          <div class="status-bar" :style="{ color: roles.onSurface }">
            <span class="time">9:41</span>
            <div class="status-icons">
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>
          
          <!-- 顶部标题 -->
          <div class="app-bar">
            <h1 class="page-title" :style="{ color: roles.onSurface }">Today</h1>
            <button class="icon-btn" :style="iconBtnStyle">
              <span>👤</span>
            </button>
          </div>
          
          <!-- 提示卡片 -->
          <div class="tip-card" :style="tipCardStyle">
            <span class="tip-icon" :style="{ color: roles.onPrimaryContainer }">💡</span>
            <p class="tip-text" :style="{ color: roles.onPrimaryContainer }">
              冬季植物生长减缓，需要减少浇水频率。
            </p>
          </div>
          
          <!-- 房间列表 -->
          <div class="room-cards">
            <div class="room-card" :style="cardStyle">
              <h3 class="room-title" :style="{ color: roles.tertiary }">客厅</h3>
              <div class="task-item">
                <span class="checkbox" :style="checkboxStyle">✓</span>
                <div class="task-info">
                  <span class="task-name" :style="{ color: roles.onSurface }">浇水</span>
                  <span class="plant-name" :style="{ color: roles.onSurfaceVariant }">球兰</span>
                </div>
              </div>
              <div class="task-item">
                <span class="checkbox" :style="checkboxStyle">✓</span>
                <div class="task-info">
                  <span class="task-name" :style="{ color: roles.onSurface }">施肥</span>
                  <span class="plant-name" :style="{ color: roles.onSurfaceVariant }">龟背竹</span>
                </div>
              </div>
              <div class="plant-illustration">🌿</div>
            </div>
            
            <div class="room-card" :style="cardStyle">
              <h3 class="room-title" :style="{ color: roles.tertiary }">厨房</h3>
              <div class="task-item">
                <span class="checkbox" :style="checkboxStyle">✓</span>
                <div class="task-info">
                  <span class="task-name" :style="{ color: roles.onSurface }">浇水</span>
                  <span class="plant-name" :style="{ color: roles.onSurfaceVariant }">镜面草</span>
                </div>
              </div>
              <div class="plant-illustration">🪴</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 详情页面 -->
      <div class="phone-frame">
        <div class="phone-screen" :style="screenStyle">
          <!-- 状态栏 -->
          <div class="status-bar" :style="{ color: roles.onSurface }">
            <span class="time">9:41</span>
            <div class="status-icons">
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>
          
          <!-- 顶部导航 -->
          <div class="app-bar">
            <button class="back-btn" :style="{ color: roles.onSurface }">←</button>
            <div class="spacer"></div>
            <button class="icon-btn-sm" :style="{ color: roles.onSurface }">⋮</button>
          </div>
          
          <!-- 植物标题 -->
          <h1 class="detail-title" :style="{ color: roles.primary }">
            龟背竹
          </h1>
          
          <!-- 图片区域 -->
          <div class="image-placeholder" :style="imagePlaceholderStyle">
            <span class="plant-emoji">🌱</span>
          </div>
          
          <!-- 标签卡片 -->
          <div class="tag-cards">
            <div class="tag-card" :style="tagCardStyle">
              <span class="tag-icon">✨</span>
              <span class="tag-title" :style="{ color: roles.onSecondaryContainer }">热门推荐</span>
              <span class="tag-desc" :style="{ color: roles.onSecondaryContainer }">最受欢迎的植物</span>
            </div>
            <div class="tag-card" :style="tagCardStyle">
              <span class="tag-icon">📋</span>
              <span class="tag-title" :style="{ color: roles.onSecondaryContainer }">易于养护</span>
              <span class="tag-desc" :style="{ color: roles.onSecondaryContainer }">适合新手种植</span>
            </div>
          </div>
          
          <!-- 护理信息 -->
          <div class="care-section">
            <h3 class="section-label" :style="{ color: roles.onSurface }">养护</h3>
            <div class="care-item">
              <span class="care-icon" :style="{ color: roles.primary }">💧</span>
              <span class="care-text" :style="{ color: roles.onSurface }">每周二浇水</span>
            </div>
            <div class="care-item">
              <span class="care-icon" :style="{ color: roles.primary }">🌼</span>
              <span class="care-text" :style="{ color: roles.onSurface }">每月施肥一次</span>
            </div>
          </div>
          
          <!-- 关于信息 -->
          <div class="about-section">
            <h3 class="section-label" :style="{ color: roles.onSurface }">关于</h3>
            <div class="care-item">
              <span class="care-icon" :style="{ color: roles.primary }">☀️</span>
              <span class="care-text" :style="{ color: roles.onSurface }">需要中等光照</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  roles: {
    type: Object,
    required: true
  }
})

const screenStyle = computed(() => ({
  background: props.roles.surface
}))

const cardStyle = computed(() => ({
  background: props.roles.surfaceContainerLow,
  borderColor: props.roles.outlineVariant
}))

const tipCardStyle = computed(() => ({
  background: props.roles.primaryContainer
}))

const checkboxStyle = computed(() => ({
  background: props.roles.primary,
  color: props.roles.onPrimary
}))

const iconBtnStyle = computed(() => ({
  background: props.roles.surfaceContainerHigh,
  color: props.roles.onSurfaceVariant
}))

const tagCardStyle = computed(() => ({
  background: props.roles.secondaryContainer
}))

const imagePlaceholderStyle = computed(() => ({
  background: props.roles.surfaceContainerHigh
}))
</script>

<style scoped>
.phone-preview {
  padding: 16px;
  background: var(--surface-container);
  border-radius: 16px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.phones-container {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.phone-frame {
  width: 240px;
  height: 480px;
  background: #1a1a1a;
  border-radius: 32px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 10px;
  font-weight: 600;
}

.status-icons {
  display: flex;
  gap: 4px;
  font-size: 10px;
}

.app-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 400;
  font-family: serif;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}

.icon-btn-sm {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.back-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.spacer {
  flex: 1;
}

.tip-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  margin-bottom: 12px;
}

.tip-icon {
  font-size: 14px;
}

.tip-text {
  margin: 0;
  font-size: 10px;
  line-height: 1.3;
}

.room-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.room-card {
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid;
  position: relative;
  overflow: hidden;
}

.room-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 400;
  font-family: serif;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-name {
  font-size: 11px;
  font-weight: 500;
}

.plant-name {
  font-size: 9px;
}

.plant-illustration {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 32px;
  opacity: 0.8;
}

.detail-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 400;
  font-family: serif;
  text-align: center;
  line-height: 1.2;
}

.image-placeholder {
  width: 100%;
  height: 100px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.plant-emoji {
  font-size: 48px;
}

.tag-cards {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
}

.tag-card {
  min-width: 90px;
  padding: 8px 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tag-icon {
  font-size: 12px;
}

.tag-title {
  font-size: 10px;
  font-weight: 600;
}

.tag-desc {
  font-size: 8px;
  opacity: 0.8;
  line-height: 1.2;
}

.care-section,
.about-section {
  margin-bottom: 10px;
}

.section-label {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 400;
  font-family: serif;
}

.care-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.care-icon {
  font-size: 12px;
}

.care-text {
  font-size: 10px;
}
</style>
