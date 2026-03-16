"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import authService from "@/services/auth.service";
import { AppError } from "@/types/api";
import { APP_CONFIG } from "@/constants/config";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload, VerifyOtpPayload, VerifyResetOtpPayload } from "@/types/user";

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  googleLogin: (code: string) => Promise<void>;
  facebookLogin: (accessToken: string) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  resendOtp: (payload: { email: string; otp_type: "registration" | "password_reset" }) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<void>;
  verifyResetOtp: (payload: VerifyResetOtpPayload) => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,

      googleLogin: async (accessToken) => {
        set({ isLoading: true, error: null });
        try {
          const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }).then((r) => r.json());

          const res = await authService.oauthSignIn({
            provider: "google",
            email: userInfo.email,
            full_name: userInfo.name,
            image: userInfo.picture,
            oauth_id: userInfo.sub,
            access_token: accessToken,
          });
          Cookies.set(APP_CONFIG.accessTokenCookieName, res.data.access_token, { sameSite: "lax" });
          Cookies.set(APP_CONFIG.refreshTokenCookieName, res.data.refresh_token, { sameSite: "lax" });
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Google sign-in failed.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      facebookLogin: async (accessToken) => {
        set({ isLoading: true, error: null });
        try {
          const userInfo = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
          ).then((r) => r.json());

          const res = await authService.oauthSignIn({
            provider: "facebook",
            email: userInfo.email ?? "",
            full_name: userInfo.name,
            image: userInfo.picture?.data?.url ?? "",
            oauth_id: userInfo.id,
            access_token: accessToken,
          });
          Cookies.set(APP_CONFIG.accessTokenCookieName, res.data.access_token, { sameSite: "lax" });
          Cookies.set(APP_CONFIG.refreshTokenCookieName, res.data.refresh_token, { sameSite: "lax" });
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Facebook sign-in failed.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login(payload);
          Cookies.set(APP_CONFIG.accessTokenCookieName, res.data.access_token, { sameSite: "lax" });
          Cookies.set(APP_CONFIG.refreshTokenCookieName, res.data.refresh_token, { sameSite: "lax" });
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Login failed.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        const refresh_token = Cookies.get(APP_CONFIG.refreshTokenCookieName) ?? "";
        try {
          await authService.logout({ refresh_token });
        } catch {
          // always clear locally even if API fails
        } finally {
          Cookies.remove(APP_CONFIG.accessTokenCookieName);
          Cookies.remove(APP_CONFIG.refreshTokenCookieName);
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(payload);
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Registration failed.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      resendOtp: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resendOtp(payload);
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Failed to resend OTP.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      resetPassword: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(payload);
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Failed to send OTP.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      verifyOtp: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.verifyOtp(payload);
          Cookies.set(APP_CONFIG.accessTokenCookieName, res.data.access_token, { sameSite: "lax" });
          Cookies.set(APP_CONFIG.refreshTokenCookieName, res.data.refresh_token, { sameSite: "lax" });
          Cookies.remove(APP_CONFIG.otpPendingCookieName);
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "OTP verification failed.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      verifyResetOtp: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authService.verifyResetOtp(payload);
          Cookies.remove(APP_CONFIG.otpPendingCookieName);
          Cookies.remove(APP_CONFIG.resetOtpCookieName);
          set({ isLoading: false });
        } catch (err) {
          const message = err instanceof AppError ? err.message : "Failed to reset password.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "cs-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
