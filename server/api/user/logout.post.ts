type BffResponse<T> = {
  code: number | string;
  data: T;
  message: string;
};

const TOKEN_COOKIE_KEY = "token";

const success = <T>(data: T, message = "success"): BffResponse<T> => ({
  code: 0,
  data,
  message,
});

export default defineEventHandler(async (event) => {
  deleteCookie(event, TOKEN_COOKIE_KEY, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return success(true);
});
