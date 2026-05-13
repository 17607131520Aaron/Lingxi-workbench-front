export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.auth === true;
  const isLoginPage = to.path === "/login";

  await authStore.ensureProfile();

  if (isLoginPage) {
    if (authStore.isAuthenticated) {
      return navigateTo("/home");
    }

    return;
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    const redirect = to.fullPath && to.fullPath !== "/" ? `?redirect=${encodeURIComponent(to.fullPath)}` : "";

    return navigateTo(`/login${redirect}`);
  }
});
