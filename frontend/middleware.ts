import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/summarize"];
const publicRoutes = ["/signin"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = (await cookies()).get("token")?.value;

  let isUserLoggedIn = false;

  if (token) {
    isUserLoggedIn = true;
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isPublicRoute && token) {
    if (path === "/signin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  if (isPublicRoute && token) {
    if (!path.startsWith("/summarize")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-User-Authenticated", String(isUserLoggedIn));

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
