import axiosInstance from "@/lib/axios";
import type { Pagination } from "@/types/api";
import type { Upload, UploadListParams } from "@/types/upload";

const uploadService = {
  async uploadFile(
    file: File,
    clientId: number,
    onProgress?: (pct: number) => void
  ): Promise<{ success: boolean; message: string; data: Upload }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("original_name", file.name);
    formData.append("client_id", String(clientId));
    const { data } = await axiosInstance.post("uploads/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    });
    return data;
  },

  async getUploads(params: UploadListParams): Promise<{ success: boolean; message: string; data: Upload[]; pagination: Pagination }> {
    const { data } = await axiosInstance.get("uploads/", { params });
    return data;
  },
};

export default uploadService;
