export const APP_ROUTES = {
  AUTH: {
    SIGN_IN: "/app/auth/sign-in",
    SIGN_UP: "/app/auth/sign-up",
    VERIFY_OTP: "/app/auth/verify-otp",
    RESET_PASSWORD: "/app/auth/reset-password",
  },
  APP: {
    ROOT: "/app/home",
    HOME: "/app/home",
    ANALYTICS: "/app/analytics",
    CONTENT_CALENDAR: "/app/content-calendar",
    ADDONS: "/app/addons",
    FAQ: "/app/faq",
  },
} as const;

export const PUBLIC_ROUTES: string[] = ["/", "/terms", "/privacy"];

export const AUTH_ROUTES: string[] = [
  APP_ROUTES.AUTH.SIGN_IN,
  APP_ROUTES.AUTH.SIGN_UP,
  APP_ROUTES.AUTH.VERIFY_OTP,
  APP_ROUTES.AUTH.RESET_PASSWORD,
];

export const PROTECTED_ROUTE_PREFIXES: string[] = ["/app/home", "/app/analytics", "/app/content-calendar", "/app/addons", "/app/faq"];
