"use client";

import useAuthStore from "@/store/authStore";

export function useAuth() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const register = useAuthStore((s) => s.register);
  const resendOtp = useAuthStore((s) => s.resendOtp);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const verifyResetOtp = useAuthStore((s) => s.verifyResetOtp);
  const clearError = useAuthStore((s) => s.clearError);

  return { isLoading, error, login, logout, register, resendOtp, resetPassword, verifyOtp, verifyResetOtp, clearError };
}
