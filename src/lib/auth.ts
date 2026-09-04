import { cookies } from "next/headers";
import { env } from "@/config/env";

const COOKIE_NAME = "meru_admin_session";

export async function createAdminSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, env.admin.sessionSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 3, // 3 días
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return value === env.admin.sessionSecret;
}
