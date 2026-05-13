type UpstreamProfile = {
  userId: string;
  username: string | null;
  email: string | null;
  phone: string | null;
};

type UpstreamResponse<T> = {
  code?: number | string;
  data?: T;
  message?: string;
  messages?: string | string[] | null;
};

type BffResponse<T> = {
  code: number | string;
  data: T;
  message: string;
};

const SUCCESS_CODES = new Set([0, "0"]);

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

  return payload.messages || payload.message || "获取用户信息失败";
};

export default defineEventHandler(async (event) => {
  const response = await bffFetch<UpstreamResponse<UpstreamProfile>>(
    event,
    "/app/auth/profile",
    {
      method: "GET",
    },
  ).catch(
    (error: {
      data?: UpstreamResponse<unknown>;
      statusCode?: number;
      statusMessage?: string;
      message?: string;
    }) => {
      const message =
        (error.data && pickMessage(error.data)) ||
        error.statusMessage ||
        error.message ||
        "获取用户信息失败";

      return failure(error.statusCode || 500, message);
    },
  );

  if (
    "data" in response &&
    response.data === null &&
    !SUCCESS_CODES.has(response.code ?? 0)
  ) {
    return response;
  }

  if (!response || !SUCCESS_CODES.has(response.code ?? 0) || !response.data) {
    return failure(500, pickMessage(response ?? {}));
  }

  return success(response.data);
});
