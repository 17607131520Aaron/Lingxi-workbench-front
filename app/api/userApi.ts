import { get } from "@/utils/request";

interface LoginChallenge {
  username: string;
  password: string;
}

export const login = async (payload: LoginChallenge): Promise<boolean> =>
  await get("/api/user/login");
