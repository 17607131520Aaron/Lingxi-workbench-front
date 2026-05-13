export const TOKEN_COOKIE_KEY = "token";
export const TOKEN_STORAGE_KEY = "token";

const getTokenCookie = () => useCookie<string | null>(TOKEN_COOKIE_KEY);

export const getTokenFromCookie = () => getTokenCookie().value;

export const getTokenFromStorage = () => {
  if (import.meta.server) {
    return null;
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getToken = () => getTokenFromCookie() || getTokenFromStorage();

export const setToken = (token: string) => {
  getTokenCookie().value = token;

  if (import.meta.client) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

export const clearToken = () => {
  getTokenCookie().value = null;

  if (import.meta.client) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const pickTokenValue = (payload: unknown): string | null => {
  if (typeof payload === "string" && payload) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  for (const key of ["token", "accessToken", "access_token"]) {
    const value = record[key];

    if (typeof value === "string" && value) {
      return value;
    }
  }

  return null;
};

export const syncTokenFromResponse = (payload: unknown) => {
  const token = pickTokenValue(payload);

  if (token) {
    setToken(token);
  }

  return token;
};
