import { defineStore } from "pinia";
import { getProfile, logout } from "~/api/userApi";

interface UserProfile {
  userId: string;
  username: string | null;
  email: string | null;
  phone: string | null;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserProfile | null>(null);
  const loaded = ref(false);
  const loading = ref(false);
  let pendingPromise: Promise<UserProfile | null> | null = null;

  const isAuthenticated = computed(() => Boolean(user.value?.userId));

  const clear = () => {
    user.value = null;
    loaded.value = false;
    pendingPromise = null;
  };

  const fetchProfile = async (force = false) => {
    if (!force && pendingPromise) {
      return pendingPromise;
    }

    if (!force && loaded.value) {
      return user.value;
    }

    loading.value = true;

    pendingPromise = getProfile()
      .then((profile) => {
        user.value = profile;
        loaded.value = true;
        return profile;
      })
      .catch(() => {
        user.value = null;
        loaded.value = true;
        return null;
      })
      .finally(() => {
        loading.value = false;
        pendingPromise = null;
      });

    return pendingPromise;
  };

  const ensureProfile = async () => await fetchProfile();

  const signOut = async () => {
    await logout().catch(() => undefined);
    clear();
  };

  return {
    clear,
    ensureProfile,
    fetchProfile,
    isAuthenticated,
    loaded,
    loading,
    signOut,
    user,
  };
});
