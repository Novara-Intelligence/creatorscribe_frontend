import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/constants/config";
import { APP_ROUTES, AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES } from "@/constants/routes";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get(APP_CONFIG.accessTokenCookieName)?.value;
  const isAuthenticated = Boolean(token);

  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // verify-otp requires the otp_pending cookie set by register
  if (pathname === APP_ROUTES.AUTH.VERIFY_OTP) {
    const otpPending = request.cookies.get(APP_CONFIG.otpPendingCookieName)?.value;
    if (!otpPending) {
      return NextResponse.redirect(new URL(APP_ROUTES.AUTH.SIGN_UP, request.url));
    }
  }

  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL(APP_ROUTES.AUTH.SIGN_IN, request.url);
    signInUrl.searchParams.set("redirect", pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""));
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.APP.ROOT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
