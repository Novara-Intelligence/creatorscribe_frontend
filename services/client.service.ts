import axiosInstance from "@/lib/axios";
import type { Client } from "@/types/client";

const clientService = {
  async getMyClients(): Promise<{ success: boolean; message: string; data: Client[] }> {
    const { data } = await axiosInstance.get("clients/my-clients");
    return data;
  },
};

export default clientService;
