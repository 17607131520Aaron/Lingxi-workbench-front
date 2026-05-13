import type { FormInstance, FormRules } from "element-plus";
import { login } from "~/api/userApi";
import { request } from "~/utils/request";

type AuthMode = "login" | "register";

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const register = (payload: RegisterPayload) =>
  request("/auth/register", {
    method: "POST",
    body: payload,
  });

export const useLogin = () => {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  const loading = ref(false);
  const mode = ref<AuthMode>("login");
  const loginFormRef = ref<FormInstance>();
  const registerFormRef = ref<FormInstance>();

  const tabs = [
    { value: "login", label: "登录" },
    { value: "register", label: "注册" },
  ] as const;

  const loginForm = reactive({
    username: "admin",
    password: "",
    remember: false,
  });

  const registerForm = reactive({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loginRules: FormRules<typeof loginForm> = {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  };

  const registerRules: FormRules<typeof registerForm> = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      { min: 3, message: "用户名至少3个字符", trigger: "blur" },
    ],
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      { type: "email", message: "请输入有效邮箱", trigger: ["blur", "change"] },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 6, message: "密码至少6个字符", trigger: "blur" },
    ],
    confirmPassword: [
      { required: true, message: "请确认密码", trigger: "blur" },
      {
        validator: (_rule, value, callback) => {
          if (!value || value === registerForm.password) {
            callback();
            return;
          }
          callback(new Error("两次密码不一致"));
        },
        trigger: "blur",
      },
    ],
  };

  const handleLogin = async () => {
    const isValid = await loginFormRef.value?.validate().catch(() => false);
    if (!isValid) {
      return;
    }

    try {
      loading.value = true;
      await login({
        username: loginForm.username,
        password: loginForm.password,
        rememberMe: loginForm.remember,
      });
      await authStore.fetchProfile(true);

      ElMessage.success("登录成功");
      const redirect =
        typeof route.query.redirect === "string" &&
        route.query.redirect.startsWith("/")
          ? route.query.redirect
          : "/";
      await router.push(redirect);
    } catch {
    } finally {
      loading.value = false;
    }
  };

  const handleRegister = async () => {
    const isValid = await registerFormRef.value?.validate().catch(() => false);
    if (!isValid) {
      return;
    }

    try {
      loading.value = true;
      await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      });
      ElMessage.success("注册成功，请登录");
      mode.value = "login";
      loginForm.username = registerForm.username;
      loginForm.password = "";
    } catch {
    } finally {
      loading.value = false;
    }
  };

  const handleLogout = async () => {
    await authStore.signOut();
    await router.push("/login");
  };

  return {
    handleLogin,
    handleLogout,
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
  };
};
