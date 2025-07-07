// middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith("/login")
  

  if (token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (isAuthPage && isAuth) {
    // Already logged in, redirect to home
    return NextResponse.redirect(new URL("/", request.url))
  }

  const isProtectedPath = ["/cart", "/checkout"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (!isAuth && isProtectedPath) {
    // Not logged in, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/login"],
}