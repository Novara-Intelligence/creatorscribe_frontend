import axiosInstance from "@/lib/axios";
import type { UserProfile } from "@/types/user";

const userService = {
  async getProfile(): Promise<{ success: boolean; message: string; data: UserProfile }> {
    const { data } = await axiosInstance.get("auth/profile");
    return data;
  },

  async checkUser(email: string, clientId?: number): Promise<{ found: boolean; email?: string; full_name?: string; profile_pic?: string; already_in_client?: boolean | null; message?: string }> {
    const params: Record<string, unknown> = { email };
    if (clientId !== undefined) params.client_id = clientId;
    const { data } = await axiosInstance.get("auth/check-user", { params });
    return data;
  },

  async updateProfile(payload: { full_name?: string; profile_pic?: File | null }): Promise<{ success: boolean; message: string; data: UserProfile }> {
    const formData = new FormData();
    if (payload.full_name !== undefined) formData.append("full_name", payload.full_name);
    if (payload.profile_pic !== undefined && payload.profile_pic !== null) formData.append("profile_pic", payload.profile_pic);
    const { data } = await axiosInstance.patch("auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.delete("auth/delete-account");
    return data;
  },
};

export default userService;
