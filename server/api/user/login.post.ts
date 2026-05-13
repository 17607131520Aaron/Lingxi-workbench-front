type LoginPayload = {
  username?: string;
  password?: string;
  rememberMe?: boolean;
};

type UpstreamResponse<T> = {
  code?: number | string;
  data?: T;
  message?: string;
  messages?: string | string[] | null;
};

type AuthSession = {
  token?: string;
  expiresIn?: number;
};

type BffResponse<T> = {
  code: number | string;
  data: T;
  message: string;
};

const SUCCESS_CODES = new Set([0, "0"]);
const TOKEN_COOKIE_KEY = "token";

const success = <T>(data: T, message = "success"): BffResponse<T> => ({
  code: 0,
  data,
  message,
});

const failure = (code: number, message: string): BffResponse<null> => ({
  code,
  data: null,
  message,
});

const pickMessage = (payload: UpstreamResponse<unknown>) => {
  if (Array.isArray(payload.messages)) {
    return payload.messages.filter(Boolean).join("，");
  }

  return payload.messages || payload.message || "登录失败";
};

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginPayload>(event);

  if (!body?.username || !body?.password) {
    return failure(400, "用户名和密码不能为空");
  }

  const response = await bffFetch<UpstreamResponse<AuthSession>>(event, "/web/auth/login", {
    method: "POST",
    body: {
      username: body.username,
      password: body.password,
      rememberMe: body.rememberMe ?? false,
    },
  }).catch((error: {
    data?: UpstreamResponse<unknown>;
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  }) => {
    const message =
      (error.data && pickMessage(error.data)) ||
      error.statusMessage ||
      error.message ||
      "登录失败";

    return failure(error.statusCode || 500, message);
  });

  if ("data" in response && response.data === null && !SUCCESS_CODES.has(response.code ?? 0)) {
    return response;
  }

  if (!response || !SUCCESS_CODES.has(response.code ?? 0) || !response.data?.token) {
    return failure(500, pickMessage(response ?? {}));
  }

  setCookie(event, TOKEN_COOKIE_KEY, response.data.token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: body.rememberMe ? response.data.expiresIn : undefined,
  });

  return success(true);
});
