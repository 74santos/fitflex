// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;
  const pathname = request.nextUrl.pathname;

  const protectedPaths = [
    "/cart",
    "/checkout",
    "/shipping-address",
    "/payment-method",
    "/place-order",
    "/profile",
    "/user",
    "/order",
  ];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isAuthPage = pathname.startsWith("/sign-in");

  // ✅ Redirect logged-in users away from sign-in page
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Require login for protected paths
  if (!isAuth && isProtected) {
    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
    );
  }

  // ✅ Optional: admin-only route (e.g., /admin) — leave for later
  // if (pathname.startsWith("/admin") && token?.role !== "admin") {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/shipping-address/:path*",
    "/payment-method/:path*",
    "/place-order/:path*",
    "/profile/:path*",
    "/user/:path*",
    "/order/:path*",
    "/sign-in", // so we can redirect logged-in users away
  ],
};
