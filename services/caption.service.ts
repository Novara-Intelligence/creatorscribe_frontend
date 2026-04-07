import axiosInstance from "@/lib/axios";
import type { CaptionSession, SessionsMeta } from "@/types/caption";

const captionService = {
  async getSessions(
    client_id: number,
    params?: { search?: string; page?: number; limit?: number },
  ): Promise<{ success: boolean; message: string; data: CaptionSession[]; meta: SessionsMeta }> {
    const { data } = await axiosInstance.get("caption-studio/sessions/", {
      params: { client_id, ...params },
    });
    return data;
  },

  async createSession(client_id: number, title?: string): Promise<{ success: boolean; message: string; data: CaptionSession }> {
    const { data } = await axiosInstance.post("caption-studio/sessions/", { client_id, ...(title ? { title } : {}) });
    return data;
  },
};

export default captionService;
