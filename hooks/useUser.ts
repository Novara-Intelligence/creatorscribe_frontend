"use client";

import useUserStore from "@/store/userStore";

export function useUser() {
  const profile = useUserStore((s) => s.profile);
  const isLoading = useUserStore((s) => s.isLoading);
  const error = useUserStore((s) => s.error);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const clearProfile = useUserStore((s) => s.clearProfile);

  return { profile, isLoading, error, fetchProfile, updateProfile, clearProfile };
}
