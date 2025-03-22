import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "./lib/verify-token";

const protectedRoutes = ["/summarize"];
const publicRoutes = ["/signin"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const response = NextResponse.next();

  const token = (await cookies()).get("token")?.value;
  const verifiedToken = await verifyToken(token!!);

  let isUserLoggedIn = false;

  if (verifiedToken) {
    isUserLoggedIn = true;
  }

  if (isProtectedRoute && !verifiedToken) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isPublicRoute && verifiedToken) {
    if (path === "/signin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  if (isPublicRoute && verifiedToken) {
    if (!path.startsWith("/summarize")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  response.headers.set(
    "X-User-Authenticated",
    String(isUserLoggedIn && verifiedToken)
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
