import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const COOKIE_NAME = "meru_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (cookie !== env.admin.sessionSecret) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
