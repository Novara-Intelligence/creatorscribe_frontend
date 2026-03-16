import axiosInstance from "@/lib/axios";
import type { RegisterPayload } from "@/types/user";

const authService = {
  async register(payload: RegisterPayload): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post<{ success: boolean; message: string }>("/auth/register", payload);
    return data;
  },
};

export default authService;
