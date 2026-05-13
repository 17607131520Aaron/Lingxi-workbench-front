import { request } from "~/utils/request";

interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface UserProfile {
  userId: string;
  username: string | null;
  email: string | null;
  phone: string | null;
}

export const login = async (payload: LoginPayload): Promise<boolean> =>
  await request("/api/user/login", {
    baseURL: "",
    method: "POST",
    body: payload,
  });

export const getProfile = async (): Promise<UserProfile> =>
  await request("/api/user/profile", {
    baseURL: "",
    method: "GET",
    showError: false,
  });

export const logout = async (): Promise<boolean> =>
  await request("/api/user/logout", {
    baseURL: "",
    method: "POST",
    showError: false,
  });
