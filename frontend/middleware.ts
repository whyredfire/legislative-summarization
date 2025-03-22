import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "./lib/verify-token";

const protectedRoutes = ["/summarize"];
const publicRoutes = ["/signin"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = (await cookies()).get("token")?.value;

  let verifiedToken = null;
  if (token) {
    verifiedToken = verifyToken(token);
  }

  const isUserLoggedIn = Boolean(verifiedToken);

  if (isProtectedRoute && !isUserLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isPublicRoute && isUserLoggedIn) {
    if (path === "/signin") {
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
