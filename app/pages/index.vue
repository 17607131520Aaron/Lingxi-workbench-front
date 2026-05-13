<template>
  <div class="portal-page">
    <header class="portal-topbar">
      <div class="brand-block">
        <div class="brand-mark">LX</div>
        <div class="brand-copy">
          <div class="brand-title">灵犀控制台</div>
          <div class="brand-subtitle">
            统一接入工作流、AI 工具与团队协作模块
          </div>
        </div>
      </div>

      <div class="topbar-actions">
        <div class="user-panel">
          <template v-if="authStore.isAuthenticated">
            <!-- <el-button @click="goWorkbench">控制台</el-button> -->
            <el-popover placement="bottom-end" :width="220" trigger="hover" popper-class="user-popover">
              <template #reference>
                <button type="button" class="user-summary user-trigger">
                  <div class="user-avatar">{{ userInitial }}</div>
                  <div class="user-meta">
                    <div class="user-name">{{ displayName }}</div>
                    <div class="user-id">
                      {{
                        authStore.user?.email ||
                        authStore.user?.phone ||
                        "已登录"
                      }}
                    </div>
                  </div>
                </button>
              </template>

              <div class="user-menu">
                <div class="user-menu-head">
                  <div class="user-avatar large">{{ userInitial }}</div>
                  <div class="user-meta">
                    <div class="user-name">{{ displayName }}</div>
                    <div class="user-id">
                      {{
                        authStore.user?.email ||
                        authStore.user?.phone ||
                        "已登录"
                      }}
                    </div>
                  </div>
                </div>
                <div class="user-menu-summary">
                  <el-icon>
                    <Iphone />
                  </el-icon>
                  <span>{{ maskedContact }}</span>
                </div>
                <div class="user-menu-divider" />
                <button type="button" class="user-menu-item">
                  <span class="user-menu-item-main">
                    <el-icon>
                      <Lock />
                    </el-icon>
                    <span>修改密码</span>
                  </span>
                  <el-icon>
                    <Right />
                  </el-icon>
                </button>
                <button type="button" class="user-menu-item">
                  <span class="user-menu-item-main">
                    <el-icon>
                      <Iphone />
                    </el-icon>
                    <span>换绑手机</span>
                  </span>
                  <el-icon>
                    <Right />
                  </el-icon>
                </button>
                <button type="button" class="user-menu-item danger" @click="handleLogout">
                  <span class="user-menu-item-main">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    <span>退出登录</span>
                  </span>
                </button>
              </div>
            </el-popover>
          </template>
          <template v-else>
            <el-button type='primary' text='primary' link @click="goLogin">登录</el-button>
          </template>
        </div>
      </div>
    </header>

    <main class="portal-main">
      <section class="module-section">
        <div class="module-grid">
          <button v-for="module in modules" :key="module.path" type="button" class="module-card"
            @click="openModule(module.path)">
            <div class="module-badge">{{ module.badge }}</div>

            <div class="module-card-top">
              <h3>{{ module.title }}</h3>
            </div>

            <div class="module-card-body">
              <p>{{ module.description }}</p>
              <div class="module-tags">
                <span v-for="tag in module.tags" :key="tag" class="module-tag">{{ tag }}</span>
              </div>
            </div>

            <div class="module-card-foot">
              <span>{{ module.entry }}</span>
              <el-icon>
                <ArrowRight />
              </el-icon>
            </div>
          </button>
        </div>
      </section>
    </main>

    <footer class="ticker-band" aria-label="系统动态">
      <div class="ticker-track">
        <div class="ticker-group">
          <span v-for="item in tickerItems" :key="`a-${item}`" class="ticker-item">{{ item }}</span>
        </div>
        <div class="ticker-group" aria-hidden="true">
          <span v-for="item in tickerItems" :key="`b-${item}`" class="ticker-item">{{ item }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Iphone,
  Lock,
  Right,
  SwitchButton,
} from "@element-plus/icons-vue";

const authStore = useAuthStore();
const {
  displayName,
  userInitial,
  maskedContact,
  goLogin,
  goWorkbench,
  openModule,
  handleLogout,
  modules,
  tickerItems,
} = useApp();
</script>

<style scoped lang="scss">
.portal-page {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
  background: #0b1422;
  color: #e7edf6;
}

.portal-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(126, 145, 176, 0.14);
  background: #0d1727;
}

.brand-block,
.topbar-actions,
.user-panel,
.user-summary,
.hero-stats,
.module-card-top,
.module-card-foot,
.ticker-group {
  display: flex;
  align-items: center;
}

.brand-block,
.topbar-actions,
.user-panel,
.user-summary,
.hero-stats {
  gap: 16px;
}

.brand-mark {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #17c3c8 0%, #2f80ed 100%);
  color: #fff;
  font-weight: 700;
}

.brand-title,
.hero-copy h1,
.module-card-body h3,
.stat-item strong {
  margin: 0;
  font-weight: 600;
}

.brand-title {
  font-size: 18px;
}

.brand-subtitle,
.section-head p,
.module-card-body p,
.user-id,
.ticker-item {
  color: #90a0b7;
}

.user-panel {
  justify-content: flex-end;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.user-avatar {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  background: rgba(47, 128, 237, 0.18);
  color: #c6defc;
  font-weight: 600;
}

.user-avatar.large {
  width: 42px;
  height: 42px;
}

.user-name {
  color: #eef4fb;
  font-size: 14px;
  font-weight: 600;
}

.user-id {
  font-size: 12px;
}

.user-menu {
  display: grid;
  gap: 16px;
  padding: 6px;
}

.user-menu-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-menu-head .user-name {
  color: #1b2740;
  font-size: 18px;
}

.user-menu-head .user-id {
  color: #7b8798;
  font-size: 13px;
}

.user-menu-summary,
.user-menu-plan,
.user-menu-item-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-menu-summary,
.user-menu-plan {
  color: #58667d;
  font-size: 15px;
}

.user-menu-summary .el-icon,
.user-menu-item-main .el-icon {
  color: #90a0b7;
  font-size: 20px;
}

.user-menu-plan strong {
  color: #6b4eff;
  font-size: 16px;
}

.user-menu-divider {
  height: 1px;
  background: #e8edf6;
}

.user-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: #253247;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}

.user-menu-item:hover {
  color: #6b4eff;
}

.user-menu-item.danger {
  color: #ff5a1f;
}

.user-menu-item.danger .el-icon {
  color: inherit;
}

:deep(.user-popover.el-popper) {
  padding: 18px 22px;
  border: 1px solid #e5eaf2;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 22px 48px rgba(27, 39, 64, 0.14);
}

:deep(.user-popover.el-popper .el-popper__arrow::before) {
  border-color: #e5eaf2;
}

.portal-main {
  display: grid;
  gap: 24px;
  padding: 18px 22px 20px;
  overflow: auto;
}

.module-section {
  border-radius: 12px;
}

.section-head {
  margin-bottom: 16px;
}

.section-head h2 {
  margin: 0;
  color: #f0f5fb;
  font-size: 20px;
  font-weight: 600;
}

.section-head p {
  margin: 8px 0 0;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.module-card {
  position: relative;
  display: grid;
  gap: 16px;
  min-height: 212px;
  padding: 24px 28px 22px;
  border: 1px solid rgba(126, 145, 176, 0.18);
  border-radius: 12px;
  background: #1a2432;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.module-card:hover {
  border-color: rgba(86, 171, 255, 0.36);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.24);
  transform: translateY(-2px);
}

.module-badge {
  position: absolute;
  top: 8px;
  right: -8px;
  height: 28px;
  padding: 0 12px;
  border-radius: 4px 4px 0 4px;
  background: #18d0d2;
  color: #fff;
  font-size: 14px;
  line-height: 28px;
}

.module-badge::after {
  position: absolute;
  right: 0;
  bottom: -8px;
  width: 0;
  height: 0;
  border-top: 8px solid #0c8f96;
  border-left: 8px solid transparent;
  content: "";
}

.module-card-top,
.module-card-foot {
  justify-content: space-between;
}

.module-card-top h3 {
  color: #eef4fb;
  font-size: 18px;
}

.module-card-body p {
  margin: 0;
  line-height: 1.65;
}

.module-tags {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.module-tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(126, 145, 176, 0.24);
  border-radius: 6px;
  background: rgba(126, 145, 176, 0.08);
  color: #c4d0df;
  font-size: 14px;
}

.module-card-foot {
  padding-top: 18px;
  border-top: 1px solid rgba(126, 145, 176, 0.14);
  color: #86b7ff;
  font-size: 15px;
  font-weight: 600;
}

.ticker-band {
  overflow: hidden;
  border-top: 1px solid rgba(15, 23, 36, 0.18);
  background: linear-gradient(180deg, #f4f4f5 0%, #d8dde5 100%);
}

.ticker-track {
  display: flex;
  width: max-content;
  min-width: 100%;
  animation: ticker-scroll 24s linear infinite;
}

.ticker-group {
  gap: 24px;
  padding: 14px 0;
}

.ticker-item {
  white-space: nowrap;
  padding: 0 6px;
  color: #202a36;
  font-size: 14px;
}

.ticker-item::before {
  display: none;
  content: "";
}

@keyframes ticker-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 960px) {

  .portal-topbar,
  .portal-main {
    padding-right: 20px;
    padding-left: 20px;
  }

  .portal-topbar,
  .topbar-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions,
  .user-panel {
    width: 100%;
  }

  .user-panel {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .module-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .portal-main {
    gap: 20px;
    padding-top: 20px;
  }

  .module-section {
    padding: 0;
  }

  .brand-block,
  .user-summary {
    align-items: flex-start;
  }

  .brand-title {
    font-size: 16px;
  }

  .module-card {
    min-height: 196px;
    padding: 22px 20px 20px;
  }
}
</style>
