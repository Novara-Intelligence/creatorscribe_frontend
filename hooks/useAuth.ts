"use client";

import useAuthStore from "@/store/authStore";

export function useAuth() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const register = useAuthStore((s) => s.register);
  const clearError = useAuthStore((s) => s.clearError);

  return { isLoading, error, register, clearError };
}
