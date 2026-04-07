export interface CaptionSession {
  id: string;
  client_id: number;
  title: string;
  thumbnail: string;
  job_count: number;
  last_caption: { title: string } | null;
  created_at: string;
  updated_at: string;
}
