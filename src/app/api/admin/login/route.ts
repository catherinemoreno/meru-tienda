import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { createAdminSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { user, password } = await req.json();

  if (user === env.admin.user && password === env.admin.password) {
    await createAdminSessionCookie();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
}
