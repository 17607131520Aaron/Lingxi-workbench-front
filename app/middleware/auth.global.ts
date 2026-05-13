export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const isLoginPage = to.path === "/login";

  await authStore.ensureProfile();

  if (isLoginPage) {
    if (authStore.isAuthenticated) {
      return navigateTo("/home");
    }

    return;
  }

  if (!authStore.isAuthenticated) {
    const redirect = to.fullPath && to.fullPath !== "/" ? `?redirect=${encodeURIComponent(to.fullPath)}` : "";

    return navigateTo(`/login${redirect}`);
  }
});
