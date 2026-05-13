export const useApp = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const modules = [
    {
      title: "SenseNova · LLM API 服务平台",
      description: "SenseNova · LLM API 服务平台。",
      entry: "打开模块",
      path: "/modules/ai-chat",
      badge: "站点",
      tags: ["站点", "外部"],
    },
    {
      title: "AI 聊天(服务端版本)",
      description:
        "基于 SenseNova · LLM API 服务平台实现 + nest.js 服务的 AI 对话平台。",
      entry: "进入模块",
      path: "/ai-chat",
      badge: "工具",
      tags: ["AI", "聊天"],
    },
  ];

  const tickerItems = [
    "统一身份认证",
    "BFF 安全代理",
    "AI 能力接入",
    "模块化应用编排",
    "权限与访问控制",
    "平台能力持续演进",
  ];

  const displayName = computed(() => authStore.user?.username || "访客");
  const userInitial = computed(() =>
    displayName.value.slice(0, 1).toUpperCase(),
  );
  const maskedContact = computed(() => {
    const value = authStore.user?.phone || authStore.user?.email || "";

    if (!value) {
      return "暂未绑定";
    }

    if (value.includes("@")) {
      const [name, domain] = value.split("@");
      const safeName = name || "";
      const safeDomain = domain || "";

      return `${safeName.slice(0, 2)}****@${safeDomain}`;
    }

    if (value.length >= 7) {
      return `${value.slice(0, 3)}****${value.slice(-4)}`;
    }

    return value;
  });

  const goLogin = async () => {
    await router.push("/login");
  };

  const goWorkbench = async () => {
    await router.push(
      authStore.isAuthenticated ? "/home" : "/login?redirect=%2Fhome",
    );
  };

  const openModule = async (path: string) => {
    if (!authStore.isAuthenticated) {
      await router.push(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }

    await router.push(path);
  };

  const handleLogout = async () => {
    await authStore.signOut();
    await router.push("/");
  };

  return {
    displayName,
    userInitial,
    maskedContact,
    goLogin,
    goWorkbench,
    openModule,
    handleLogout,
    modules,
    tickerItems,
  };
};
