<template>
  <el-card shadow="never">
    <template #header>
      <div class="hero-header">
        <div>
          <div class="hero-title">项目已经可以正常开发了</div>
          <div class="hero-subtitle">路由、布局和 Element Plus 基础能力都已经接上。</div>
        </div>
        <el-space>
          <NuxtLink to="/home">
            <el-button type="primary">进入工作台</el-button>
          </NuxtLink>
          <NuxtLink to="/login">
            <el-button>查看登录页</el-button>
          </NuxtLink>
        </el-space>
      </div>
    </template>

    <el-row :gutter="16">
      <el-col :span="8" v-for="item in features" :key="item.title">
        <el-card shadow="hover" class="feature-card">
          <div class="feature-title">{{ item.title }}</div>
          <div class="feature-text">{{ item.text }}</div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
const features = [
  { title: "页面路由", text: "使用 app/pages 目录自动生成，首页是 /，登录页是 /login。" },
  { title: "UI 组件", text: "Element Plus 已接入，可以直接使用 ElButton、ElTable 等组件。" },
  { title: "后续开发", text: "下一步适合补请求层、状态管理和真实业务页面。" }
];
</script>

<style scoped>
.hero-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hero-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.hero-subtitle {
  margin-top: 8px;
  color: #606266;
}

.feature-card {
  min-height: 140px;
}

.feature-title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.feature-text {
  line-height: 1.6;
  color: #606266;
}
</style>
