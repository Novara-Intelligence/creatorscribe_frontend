import axiosInstance from "@/lib/axios";
import type { UserProfile } from "@/types/user";

const userService = {
  async getProfile(): Promise<{ success: boolean; message: string; data: UserProfile }> {
    const { data } = await axiosInstance.get("auth/profile");
    return data;
  },
};

export default userService;
