export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "809145740841-12ukchbqlo42nnhlkvobh4nisp64udka.apps.googleusercontent.com";

export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "1149043733491282";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

export const APP_CONFIG = {
  appName: "CreatorScribe",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  accessTokenCookieName: "cs_access_token",
  refreshTokenCookieName: "cs_refresh_token",
  otpPendingCookieName: "cs_otp_pending",
  resetOtpCookieName: "cs_reset_otp",
  tokenRefreshBuffer: 60,
  otpExpirySeconds: 59,
} as const;
