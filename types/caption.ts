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

export interface SessionsMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface SessionJobAudio {
  audio_url: string;
  duration: number;
  language: string;
}

export interface SessionJobTranscription {
  full_text: string;
  srt: string;
  segments: { text: string; startSecond: number; endSecond: number }[];
}

export interface SessionJobCaption {
  title: string;
  description: string;
  tags: string[];
}

export interface SessionJobUploadedFile {
  id: number;
  original_name: string;
  file_url: string;
  file_type: string;
  size: number;
}

export interface SessionJob {
  id: string;
  turn_index: number;
  status: string;
  media_type: "video" | "image" | "none";
  prompt: string;
  created_at: string;
  uploaded_file: SessionJobUploadedFile | null;
  audio: SessionJobAudio | null;
  transcription: SessionJobTranscription | null;
  caption: SessionJobCaption | null;
}
