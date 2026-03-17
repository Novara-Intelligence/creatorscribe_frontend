import axiosInstance from "@/lib/axios";
import type { Client, TeamMember } from "@/types/client";

const clientService = {
  async getMyClients(): Promise<{ success: boolean; message: string; data: Client[] }> {
    const { data } = await axiosInstance.get("clients/my-clients");
    return data;
  },

  async getMembers(clientId: number, search?: string): Promise<{ success: boolean; message: string; data: TeamMember[]; count: number }> {
    const { data } = await axiosInstance.get(`clients/${clientId}/members`, {
      params: search ? { search } : undefined,
    });
    return data;
  },

  async updateMemberRole(clientId: number, memberId: number, role: string): Promise<{ success: boolean; message: string; data: TeamMember }> {
    const { data } = await axiosInstance.patch(`clients/${clientId}/members/${memberId}/role`, { role });
    return data;
  },
};

export default clientService;
