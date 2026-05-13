<template>
  <div class="page-stack">
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="今日请求数" :value="1280" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="在线会话" :value="84" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="待处理任务" :value="17" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>工作台</span>
          <div class="header-actions">
            <el-button @click="handleLogout">退出登录</el-button>
            <el-button type="primary">新建任务</el-button>
          </div>
        </div>
      </template>
      <el-table :data="tasks">
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="owner" label="负责人" width="140" />
        <el-table-column prop="status" label="状态" width="140">
          <template #default="{ row }">
            <el-tag :type="row.statusType">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { clearToken } from "~/utils/auth-token";

const router = useRouter();

const handleLogout = async () => {
  clearToken();
  await router.push("/login");
};

const tasks = [
  { name: "接入统一请求层", owner: "你", status: "进行中", statusType: "warning", updatedAt: "今天 21:10" },
  { name: "登录页基础搭建", owner: "Codex", status: "已完成", statusType: "success", updatedAt: "今天 21:08" },
  { name: "首页信息卡片", owner: "Codex", status: "已完成", statusType: "success", updatedAt: "今天 21:06" }
];
</script>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 12px;
}
</style>
