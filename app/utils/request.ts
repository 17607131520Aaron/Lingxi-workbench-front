export type ApiResponse<T> = {
  code: number | string;
  data: T;
  messages?: string | string[] | null;
};

const SUCCESS_CODES = new Set([0, "0"]);

const createBaseRequest = () => {
  const { public: publicConfig } = useRuntimeConfig();

  return $fetch.create({
    baseURL: publicConfig.apiBase,
    credentials: "include",
    onRequest({ options }) {
      const headers = new Headers(options.headers);

      if (import.meta.server) {
        const { cookie } = useRequestHeaders(["cookie"]);

        if (cookie && !headers.has("cookie")) {
          headers.set("cookie", cookie);
        }
      }

      options.headers = headers;
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo("/login");
      }
    },
  });
};

type BaseRequestOptions = NonNullable<Parameters<ReturnType<typeof createBaseRequest>>[1]>;

export type RequestOptions = BaseRequestOptions & {
  cancelKey?: string;
  withMeta?: boolean;
  showError?: boolean;
};

export type RequestDataOptions = Omit<RequestOptions, "withMeta"> & {
  withMeta?: false;
};

export type RequestMetaOptions = Omit<RequestOptions, "withMeta"> & {
  withMeta: true;
};

export type RequestCancelController = {
  abort: (reason?: string) => void;
  signal: AbortSignal;
};

const pendingRequests = new Map<string, AbortController>();

const extractMessage = (payload: unknown) => {
  if (typeof payload === "string") {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  const { message, messages, statusMessage } = payload as {
    message?: string;
    messages?: string | string[] | null;
    statusMessage?: string;
  };

  if (Array.isArray(messages)) {
    return messages.filter(Boolean).join("，");
  }

  return messages || message || statusMessage || "";
};

const showRequestError = (message: string) => {
  if (!message || !import.meta.client) {
    return;
  }

  ElMessage.error(message);
};

const createAbortError = () =>
  new DOMException("The operation was aborted.", "AbortError");

const isAbortError = (error: unknown) => {
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return error.name === "AbortError" || error.message === "The operation was aborted.";
};

const mergeSignals = (signals: Array<AbortSignal | null | undefined>) => {
  const availableSignals = signals.filter((signal): signal is AbortSignal => Boolean(signal));

  if (availableSignals.length <= 1) {
    return availableSignals[0];
  }

  const controller = new AbortController();
  const abort = () => controller.abort(createAbortError());

  for (const signal of availableSignals) {
    if (signal.aborted) {
      abort();
      break;
    }

    signal.addEventListener("abort", abort, { once: true });
  }

  return controller.signal;
};

const normalizeError = (error: unknown, showError: boolean) => {
  if (isAbortError(error)) {
    return error instanceof Error ? error : createAbortError();
  }

  const responseData =
    typeof error === "object" && error !== null && "data" in error
      ? Reflect.get(error, "data")
      : undefined;
  const errorMessage =
    (typeof error === "object" && error !== null && "message" in error
      ? Reflect.get(error, "message")
      : "") || "";
  const message =
    extractMessage(responseData) ||
    (typeof errorMessage === "string" ? errorMessage : "") ||
    "请求失败";

  if (showError) {
    showRequestError(message);
  }

  return new Error(message);
};

const resolveRequestOptions = (options: RequestOptions) => {
  const { cancelKey, signal, ...fetchOptions } = options;

  if (!cancelKey) {
    return {
      cleanup: () => {},
      fetchOptions,
    };
  }

  const controller = new AbortController();
  pendingRequests.set(cancelKey, controller);

  return {
    cleanup: () => {
      if (pendingRequests.get(cancelKey) === controller) {
        pendingRequests.delete(cancelKey);
      }
    },
    fetchOptions: {
      ...fetchOptions,
      signal: mergeSignals([signal, controller.signal]),
    },
  };
};

export const createRequestController = (): RequestCancelController => {
  const controller = new AbortController();

  return {
    abort(reason) {
      controller.abort(reason);
    },
    signal: controller.signal,
  };
};

export const cancelRequest = (cancelKey: string, reason?: string) => {
  const controller = pendingRequests.get(cancelKey);

  if (!controller) {
    return;
  }

  controller.abort(reason);
  pendingRequests.delete(cancelKey);
};

export const isRequestCanceled = isAbortError;

export function request<T = unknown>(
  url: string,
  options?: RequestDataOptions,
): Promise<T>;
export function request<T = unknown>(
  url: string,
  options: RequestMetaOptions,
): Promise<ApiResponse<T>>;
export async function request<T = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<T | ApiResponse<T>> {
  const { withMeta = false, showError = true, ...requestOptions } = options;
  const { cleanup, fetchOptions } = resolveRequestOptions(requestOptions);
  const baseRequest = createBaseRequest();

  try {
    const response = await baseRequest<ApiResponse<T>>(url, fetchOptions);

    if (!response || typeof response !== "object" || !("code" in response)) {
      return response as T;
    }

    if (!SUCCESS_CODES.has(response.code)) {
      const message = extractMessage(response) || "请求失败";

      if (showError) {
        showRequestError(message);
      }

      throw new Error(message);
    }

    return withMeta ? response : response.data;
  } catch (error) {
    throw normalizeError(error, showError);
  } finally {
    cleanup();
  }
}

export function get<T = unknown>(
  url: string,
  options?: RequestDataOptions,
): Promise<T>;
export function get<T = unknown>(
  url: string,
  options: RequestMetaOptions,
): Promise<ApiResponse<T>>;
export function get<T = unknown>(url: string, options: RequestOptions = {}) {
  if (options.withMeta) {
    return request<T>(url, { ...options, method: "GET", withMeta: true });
  }

  return request<T>(url, { ...options, method: "GET", withMeta: false });
}

export function post<T = unknown>(
  url: string,
  options?: RequestDataOptions,
): Promise<T>;
export function post<T = unknown>(
  url: string,
  options: RequestMetaOptions,
): Promise<ApiResponse<T>>;
export function post<T = unknown>(url: string, options: RequestOptions = {}) {
  if (options.withMeta) {
    return request<T>(url, { ...options, method: "POST", withMeta: true });
  }

  return request<T>(url, { ...options, method: "POST", withMeta: false });
}

export function put<T = unknown>(
  url: string,
  options?: RequestDataOptions,
): Promise<T>;
export function put<T = unknown>(
  url: string,
  options: RequestMetaOptions,
): Promise<ApiResponse<T>>;
export function put<T = unknown>(url: string, options: RequestOptions = {}) {
  if (options.withMeta) {
    return request<T>(url, { ...options, method: "PUT", withMeta: true });
  }

  return request<T>(url, { ...options, method: "PUT", withMeta: false });
}

export function patch<T = unknown>(
  url: string,
  options?: RequestDataOptions,
): Promise<T>;
export function patch<T = unknown>(
  url: string,
  options: RequestMetaOptions,
): Promise<ApiResponse<T>>;
export function patch<T = unknown>(url: string, options: RequestOptions = {}) {
  if (options.withMeta) {
    return request<T>(url, { ...options, method: "PATCH", withMeta: true });
  }

  return request<T>(url, { ...options, method: "PATCH", withMeta: false });
}

export function del<T = unknown>(
  url: string,
  options?: RequestDataOptions,
): Promise<T>;
export function del<T = unknown>(
  url: string,
  options: RequestMetaOptions,
): Promise<ApiResponse<T>>;
export function del<T = unknown>(url: string, options: RequestOptions = {}) {
  if (options.withMeta) {
    return request<T>(url, { ...options, method: "DELETE", withMeta: true });
  }

  return request<T>(url, { ...options, method: "DELETE", withMeta: false });
}
