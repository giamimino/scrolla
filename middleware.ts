import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;
  const path = request.nextUrl.pathname;

  if (!sessionId && path === "/upload") {
    return NextResponse.redirect(new URL("/auth/signup", request.url));
  }

  if (!sessionId && path.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/auth/signup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload", "/profile/:path*"],
};