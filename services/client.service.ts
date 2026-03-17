import axiosInstance from "@/lib/axios";
import type { Client, TeamMember, ClientInvite } from "@/types/client";

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

  async acceptInvite(clientId: number): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post(`clients/${clientId}/members/accept`);
    return data;
  },

  async rejectInvite(clientId: number): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post(`clients/${clientId}/members/reject`);
    return data;
  },

  async leaveClient(clientId: number): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post(`clients/${clientId}/leave`);
    return data;
  },

  async getMyInvites(): Promise<{ success: boolean; message: string; data: ClientInvite[]; count: number }> {
    const { data } = await axiosInstance.get("clients/my-invites");
    return data;
  },

  async inviteMembers(clientId: number, emails: string[], role: string): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post(`clients/${clientId}/members/invite`, { emails, role });
    return data;
  },

  async removeMember(clientId: number, memberId: number): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.delete(`clients/${clientId}/members/${memberId}`);
    return data;
  },

  async deleteClient(clientId: number): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.delete(`clients/${clientId}/delete`);
    return data;
  },

  async editClient(clientId: number, payload: { client_name?: string; brand_logo?: File | null }): Promise<{ success: boolean; message: string; data: Client }> {
    const formData = new FormData();
    if (payload.client_name) formData.append("client_name", payload.client_name);
    if (payload.brand_logo) formData.append("brand_logo", payload.brand_logo);
    const { data } = await axiosInstance.patch(`clients/${clientId}/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async addClient(payload: { client_name: string; brand_logo?: File | null; invite_emails?: string[] }): Promise<{ success: boolean; message: string; data: Client }> {
    const formData = new FormData();
    formData.append("client_name", payload.client_name);
    if (payload.brand_logo) formData.append("brand_logo", payload.brand_logo);
    if (payload.invite_emails?.length) formData.append("invite_emails", JSON.stringify(payload.invite_emails));
    const { data } = await axiosInstance.post("clients/add-client", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export default clientService;
