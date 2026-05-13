<template>
  <div class="auth-container">
    <section class="auth-left">
      <div class="auth-brand">
        <div class="auth-logo">
          <div class="auth-logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#grad1)" />
              <path
                d="M2 17L12 22L22 17"
                stroke="url(#grad2)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="url(#grad2)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#6366f1" />
                  <stop offset="1" stop-color="#8b5cf6" />
                </linearGradient>
                <linearGradient id="grad2" x1="2" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#818cf8" />
                  <stop offset="1" stop-color="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="auth-logo-text">灵犀 AI</span>
        </div>

        <h1 class="auth-hero-title">
          探索 AI 的
          <br />
          <span class="auth-gradient-text">无限可能</span>
        </h1>
        <p class="auth-hero-desc">连接思维与智能，开启下一代 AI 交互体验</p>

        <div class="auth-features">
          <div class="auth-feature">
            <div class="auth-feature-dot" />
            <span>智能对话与深度思考</span>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-dot" />
            <span>多模态内容生成</span>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-dot" />
            <span>个性化知识管理</span>
          </div>
        </div>
      </div>

      <div class="auth-left-bg">
        <div class="auth-orb auth-orb-1" />
        <div class="auth-orb auth-orb-2" />
        <div class="auth-orb auth-orb-3" />
      </div>
    </section>

    <section class="auth-right">
      <div class="auth-card">
        <div class="auth-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="auth-tab"
            :class="{ active: mode === tab.value }"
            @click="mode = tab.value"
          >
            {{ tab.label }}
          </button>
          <div
            class="auth-tab-indicator"
            :style="{ transform: mode === 'login' ? 'translateX(0)' : 'translateX(100%)' }"
          />
        </div>

        <div class="auth-form-wrapper">
          <div class="auth-form-slider" :class="{ slide: mode === 'register' }">
            <div class="auth-form-panel">
              <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                label-position="top"
                hide-required-asterisk
                @submit.prevent="handleLogin"
              >
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" class="auth-input" placeholder="账号">
                    <template #prefix>
                      <el-icon class="auth-input-icon"><User /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <el-input
                    v-model="loginForm.password"
                    class="auth-input"
                    type="password"
                    show-password
                    placeholder="密码"
                  >
                    <template #prefix>
                      <el-icon class="auth-input-icon"><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <div class="auth-options">
                  <label class="auth-remember">
                    <input v-model="loginForm.remember" type="checkbox" />
                    <span>记住我</span>
                  </label>
                  <a class="auth-forgot" href="/" @click.prevent>忘记密码？</a>
                </div>

                <el-button class="auth-submit" type="primary" native-type="submit" :loading="loading">
                  登录
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </el-form>

              <div class="auth-divider">
                <span>或使用以下方式</span>
              </div>

              <div class="auth-socials">
                <button class="auth-social-btn" type="button" aria-label="GitHub 登录">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </button>
                <button class="auth-social-btn" type="button" aria-label="Google 登录">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>
                <button class="auth-social-btn" type="button" aria-label="Apple 登录">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.01-.18-.04-.56-.04-.95 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.22.05.45.05.71zm2.522 17.44c-.18.4-.39.78-.65 1.14-.47.66-.96 1.13-1.57 1.5-.57.33-1.18.56-1.86.63-.71.07-1.4-.04-2.04-.35-.64-.31-1.2-.76-1.68-1.34-.52-.63-.94-1.35-1.26-2.16-.34-.87-.51-1.77-.53-2.69.01-.92.18-1.82.52-2.67.31-.77.75-1.45 1.3-2.02.53-.55 1.15-.98 1.85-1.27.68-.28 1.42-.42 2.18-.39.72.02 1.41.16 2.04.45.01.17.02.34.02.51 0 .17-.01.34-.03.51-.65-.13-1.33-.16-1.99-.03-.67.13-1.3.41-1.83.83-.52.41-.93.94-1.22 1.55-.3.63-.46 1.32-.49 2.04.02.71.18 1.4.48 2.04.29.62.7 1.16 1.21 1.59.5.42 1.09.72 1.73.88.65.16 1.33.18 1.99.05.01.18.02.35.02.52 0 .18-.01.35-.03.52z" />
                  </svg>
                </button>
              </div>

              <div class="auth-hint">默认账号: admin / 123456</div>
            </div>

            <div class="auth-form-panel">
              <el-form
                ref="registerFormRef"
                :model="registerForm"
                :rules="registerRules"
                label-position="top"
                hide-required-asterisk
                @submit.prevent="handleRegister"
              >
                <el-form-item prop="username">
                  <el-input v-model="registerForm.username" class="auth-input" placeholder="用户名">
                    <template #prefix>
                      <el-icon class="auth-input-icon"><User /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="email">
                  <el-input v-model="registerForm.email" class="auth-input" placeholder="邮箱地址">
                    <template #prefix>
                      <el-icon class="auth-input-icon"><Message /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <el-input
                    v-model="registerForm.password"
                    class="auth-input"
                    type="password"
                    show-password
                    placeholder="设置密码"
                  >
                    <template #prefix>
                      <el-icon class="auth-input-icon"><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="confirmPassword">
                  <el-input
                    v-model="registerForm.confirmPassword"
                    class="auth-input"
                    type="password"
                    show-password
                    placeholder="确认密码"
                  >
                    <template #prefix>
                      <el-icon class="auth-input-icon"><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-button class="auth-submit" type="primary" native-type="submit" :loading="loading">
                  创建账号
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Lock, Message, User } from "@element-plus/icons-vue";

definePageMeta({
  layout: false,
});

const {
  handleLogin,
  handleRegister,
  loading,
  loginForm,
  loginFormRef,
  loginRules,
  mode,
  registerForm,
  registerFormRef,
  registerRules,
  tabs,
} = useLogin();

</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  background: #0a0a0f;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.auth-left {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 60px;
  background: linear-gradient(135deg, #0a0a1a 0%, #0f0f23 100%);

  @media (max-width: 768px) {
    min-height: auto;
    padding: 40px 24px;
  }
}

.auth-left-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.auth-orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  filter: blur(80px);
  animation: float 20s ease-in-out infinite;
}

.auth-orb-1 {
  top: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  background: #6366f1;
}

.auth-orb-2 {
  right: -50px;
  bottom: -50px;
  width: 300px;
  height: 300px;
  background: #8b5cf6;
  animation-delay: -7s;
}

.auth-orb-3 {
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background: #06b6d4;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -30px) scale(1.05);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

.auth-brand {
  position: relative;
  z-index: 1;
  max-width: 480px;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
}

.auth-logo-icon {
  width: 40px;
  height: 40px;
}

.auth-logo-icon svg {
  width: 100%;
  height: 100%;
}

.auth-logo-text {
  color: #e2e8f0;
  font-size: 20px;
  font-weight: 600;
}

.auth-hero-title {
  margin: 0 0 20px;
  color: #e2e8f0;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.auth-gradient-text {
  background: linear-gradient(135deg, #818cf8, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.auth-hero-desc {
  margin: 0 0 40px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  line-height: 1.6;
}

.auth-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.auth-feature-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 12px #6366f1;
}

.auth-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 24px;
  }
}

.auth-tabs {
  position: relative;
  display: flex;
  margin-bottom: 32px;
  padding: 4px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
}

.auth-tab {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 10px 0;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  font-weight: 500;
}

.auth-tab.active {
  color: #e2e8f0;
}

.auth-tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-form-wrapper {
  overflow: hidden;
}

.auth-form-slider {
  display: flex;
  width: 200%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-form-slider.slide {
  transform: translateX(-50%);
}

.auth-form-panel {
  width: 50%;
  flex-shrink: 0;
}

:deep(.auth-input .el-input__wrapper) {
  height: 48px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

:deep(.auth-input .el-input__wrapper:hover),
:deep(.auth-input .el-input__wrapper.is-focus) {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12) inset,
    0 0 0 2px rgba(99, 102, 241, 0.1);
}

:deep(.auth-input .el-input__inner) {
  color: #e2e8f0;
}

:deep(.auth-input .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-input__prefix-inner) {
  display: flex;
  align-items: center;
}

.auth-input-icon {
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
}

.auth-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.auth-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.auth-remember input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #6366f1;
}

.auth-forgot {
  color: #818cf8;
  font-size: 13px;
  text-decoration: none;
}

.auth-submit {
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  font-size: 15px;
  font-weight: 500;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}

.auth-divider::before,
.auth-divider::after {
  height: 1px;
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  content: "";
}

.auth-divider span {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  white-space: nowrap;
}

.auth-socials {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.auth-social-btn {
  display: flex;
  height: 44px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.6);
}

.auth-social-btn svg {
  width: 20px;
  height: 20px;
}

.auth-hint {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  text-align: center;
}

:deep(.el-form-item__error) {
  padding-top: 4px;
  font-size: 12px;
}
</style>
