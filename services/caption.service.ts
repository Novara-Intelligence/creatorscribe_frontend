import axiosInstance from "@/lib/axios";
import type { CaptionSession } from "@/types/caption";

const captionService = {
  async createSession(client_id: number, title?: string): Promise<{ success: boolean; message: string; data: CaptionSession }> {
    const { data } = await axiosInstance.post("caption-studio/sessions/", { client_id, ...(title ? { title } : {}) });
    return data;
  },
};

export default captionService;
