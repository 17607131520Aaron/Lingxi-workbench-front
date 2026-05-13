<template>
  <div class="ai-page">
    <header class="ai-header">
      <div>
        <div class="ai-kicker">AI 对话模块</div>
        <h1>灵犀 AI 对话</h1>
        <p>用于提问、拆解任务、沉淀结论的统一对话空间。</p>
      </div>

      <div class="ai-header-actions">
        <el-button @click="navigateTo('/')">返回模块列表</el-button>
        <el-button type="primary" @click="navigateTo('/home')">回到控制台</el-button>
      </div>
    </header>

    <main class="ai-main">
      <section class="conversation-panel">
        <div class="panel-head">
          <h2>对话记录</h2>
          <el-tag type="success">在线</el-tag>
        </div>

        <div class="message-list">
          <article
            v-for="message in messages"
            :key="message.id"
            class="message-item"
            :class="message.role"
          >
            <div class="message-role">{{ message.role === "assistant" ? "AI" : "你" }}</div>
            <div class="message-bubble">{{ message.content }}</div>
          </article>
        </div>

        <div class="composer">
          <el-input
            v-model="draft"
            type="textarea"
            :rows="4"
            resize="none"
            placeholder="输入你的问题或任务目标"
          />
          <div class="composer-actions">
            <span class="composer-hint">当前为静态演示页，可继续接真实对话接口。</span>
            <el-button type="primary" @click="appendDraft">发送</el-button>
          </div>
        </div>
      </section>

      <aside class="context-panel">
        <div class="context-block">
          <h3>推荐场景</h3>
          <ul>
            <li>需求拆解</li>
            <li>接口设计讨论</li>
            <li>会议纪要整理</li>
          </ul>
        </div>

        <div class="context-block">
          <h3>当前状态</h3>
          <div class="context-metric">
            <span>会话主题</span>
            <strong>产品与研发协作</strong>
          </div>
          <div class="context-metric">
            <span>活跃用户</span>
            <strong>{{ authStore.user?.username || "当前用户" }}</strong>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: true,
});

const authStore = useAuthStore();

const draft = ref("");
const messages = ref([
  {
    id: 1,
    role: "assistant",
    content: "你好，我可以帮你梳理需求、拆解任务，或者直接生成一份初版方案。",
  },
  {
    id: 2,
    role: "user",
    content: "帮我整理一个 AI 模块首页，需要包含登录态和模块列表。",
  },
  {
    id: 3,
    role: "assistant",
    content: "可以，建议将页面分成顶部状态栏、中部模块网格和底部动态信息带三部分。",
  },
]);

const appendDraft = () => {
  const value = draft.value.trim();

  if (!value) {
    return;
  }

  messages.value.push({
    id: Date.now(),
    role: "user",
    content: value,
  });

  draft.value = "";
};
</script>

<style scoped lang="scss">
.ai-page {
  display: grid;
  min-height: 100vh;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(180deg, #f7fafc 0%, #edf3f8 100%);
}

.ai-header,
.conversation-panel,
.context-block {
  border: 1px solid rgba(23, 33, 43, 0.08);
  background: rgba(255, 255, 255, 0.86);
}

.ai-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  border-radius: 14px;
}

.ai-kicker {
  margin-bottom: 8px;
  color: #1f7a5b;
  font-size: 13px;
  font-weight: 600;
}

.ai-header h1,
.panel-head h2,
.context-block h3 {
  margin: 0;
  font-weight: 600;
}

.ai-header p,
.composer-hint,
.context-block li,
.context-metric span {
  color: #607080;
}

.ai-header-actions {
  display: flex;
  gap: 12px;
}

.ai-main {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 320px;
  gap: 20px;
  min-height: 0;
}

.conversation-panel {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 0;
  padding: 20px;
  border-radius: 14px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.message-list {
  display: grid;
  gap: 16px;
  min-height: 360px;
  max-height: 56vh;
  padding-right: 4px;
  overflow: auto;
}

.message-item {
  display: grid;
  gap: 8px;
}

.message-role {
  font-size: 12px;
  font-weight: 600;
  color: #607080;
}

.message-bubble {
  max-width: min(100%, 720px);
  padding: 14px 16px;
  border-radius: 12px;
  line-height: 1.7;
  background: #f4f8fb;
}

.message-item.user {
  justify-items: end;
}

.message-item.user .message-bubble {
  background: #dff1ff;
}

.composer {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.composer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.context-panel {
  display: grid;
  gap: 20px;
  align-content: start;
}

.context-block {
  padding: 20px;
  border-radius: 14px;
}

.context-block ul {
  margin: 14px 0 0;
  padding-left: 18px;
}

.context-block li + li,
.context-metric + .context-metric {
  margin-top: 10px;
}

.context-metric {
  display: grid;
  gap: 6px;
  margin-top: 14px;
}

.context-metric strong {
  color: #17212b;
  font-size: 15px;
}

@media (max-width: 960px) {
  .ai-page {
    padding: 16px;
  }

  .ai-header,
  .ai-main {
    grid-template-columns: 1fr;
  }

  .ai-header {
    flex-direction: column;
  }

  .ai-header-actions,
  .composer-actions {
    flex-wrap: wrap;
  }
}
</style>
