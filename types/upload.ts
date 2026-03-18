export interface Upload {
  id: number;
  original_name: string;
  file_url: string;
  file_type: string;
  size: number;
  created_at: string;
}

export interface UploadListParams {
  client_id: number;
  name?: string;
  page?: number;
  limit?: number;
}
