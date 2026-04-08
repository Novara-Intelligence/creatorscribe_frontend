import axiosInstance from "@/lib/axios";
import type { CaptionSession, SessionsMeta, SessionJob } from "@/types/caption";

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

  async renameSession(session_id: string, title: string): Promise<{ success: boolean; message: string; data: CaptionSession }> {
    const { data } = await axiosInstance.patch(`caption-studio/sessions/${session_id}/`, { title });
    return data;
  },

  async createSession(client_id: number, title?: string): Promise<{ success: boolean; message: string; data: CaptionSession }> {
    const { data } = await axiosInstance.post("caption-studio/sessions/", { client_id, ...(title ? { title } : {}) });
    return data;
  },

  async getSessionJobs(session_id: string): Promise<{ success: boolean; message: string; data: SessionJob[] }> {
    const { data } = await axiosInstance.get(`caption-studio/sessions/${session_id}/jobs/`);
    return data;
  },
};

export default captionService;
