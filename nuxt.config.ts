// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: Number(process.env.NUXT_DEV_SERVER_PORT || 8000),
  },
  modules: [
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@nuxt/eslint",
  ],
  // Element Plus 配置
  elementPlus: {
    icon: "el-icon",
    themes: ["dark"],
  },
  // 服务端渲染优化（管理系统专用）
  app: {
    head: {
      title: "灵犀工作台",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  runtimeConfig: {
    public: {
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || "test",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://120.53.227.126:9999",
    },
  },
  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: {
          interaction: true,
        },
      },
    },
  },
});
