import { cookies, headers } from "next/headers";

import emulateUserFetch from "./emulateUserFetch";
// import { getCsrfToken } from "next-auth/react";

async function getCsrfToken(): Promise<[any, string]> {
  const hdrs = new Headers(headers());
  hdrs.set("content-type", "application/json");
  hdrs.delete("content-length");
  const [response, newCookies] = await emulateUserFetch(process.env.NEXTAUTH_SELF_ORIGIN + "/api/auth/csrf", hdrs.get("cookie") || "", {
    headers: hdrs,
    redirect: "manual",
  });

  return [await response.json(), newCookies];
}

async function createFormData(payload: Record<string, string>): Promise<[FormData, string]> {
  const data = new FormData();

  const [csrfToken, newCookies] = await getCsrfToken();

  if (!csrfToken) throw new Error("no token");

  data.set("csrfToken", csrfToken.csrfToken);
  for (const key in payload) {
    data.set(key, payload[key]);
  }
  return [data, newCookies];
}

export async function authRequest(url: string, payload: Record<string, string>) {


  const [body, newCookies] = await createFormData({
    ...payload,
  });

  const bodyStr = new URLSearchParams(body as any).toString();

  const hdrs = new Headers(headers());

  hdrs.set("content-type", "application/x-www-form-urlencoded");
  hdrs.delete("content-length");
  hdrs.set("cookie", newCookies);

  const [result] = await emulateUserFetch(process.env.NEXTAUTH_SELF_ORIGIN + url, newCookies, {
    headers: hdrs,
    method: "POST",
    body: bodyStr,
    redirect: "manual",
  });
  return result;
}

export async function logout() {
  await authRequest("/api/auth/signout", {});
}

export async function loginCredentials(username: string, password: string) {
  const result = await authRequest("/api/auth/callback/credentials", {
    redirect: "false",
    callbackUrl: "/",
    json: "true",
    username,
    password,
  });

  if (result.status == 200) {
    try {
      const resJSON = await result.json();
      if (resJSON.url) return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

