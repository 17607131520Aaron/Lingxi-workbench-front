import type { H3Event } from "h3";

const TOKEN_COOKIE_KEY = "token";
type FetchOptions<T> = NonNullable<Parameters<typeof $fetch<T>>[1]>;

const getTokenFromCookie = (event: H3Event) => {
  const token = getCookie(event, TOKEN_COOKIE_KEY);

  return typeof token === "string" && token ? token : "";
};

export const createBffHeaders = (
  event: H3Event,
  initHeaders?: HeadersInit,
) => {
  const headers = new Headers(initHeaders);
  const token = getTokenFromCookie(event);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export const bffFetch = <T>(
  event: H3Event,
  url: string,
  options: Omit<FetchOptions<T>, "headers" | "baseURL"> & {
    headers?: HeadersInit;
  } = {},
) => {
  const config = useRuntimeConfig(event);

  return $fetch<T>(url, {
    ...options,
    baseURL: config.public.apiBase,
    headers: createBffHeaders(event, options.headers),
  });
};
