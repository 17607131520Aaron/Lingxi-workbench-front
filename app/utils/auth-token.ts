export const TOKEN_COOKIE_KEY = "token";
export const TOKEN_STORAGE_KEY = "token";

export const getTokenFromStorage = () => {
  if (import.meta.server) {
    return null;
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getToken = () => getTokenFromStorage();

export const clearToken = () => {
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

  return token;
};
