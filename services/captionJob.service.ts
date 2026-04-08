import axiosInstance from "@/lib/axios";
import { API_BASE_URL } from "@/constants/config";

export type AudioReadyData = {
  audio_url: string;
  duration: number;
  language: string;
};

export type TranscriptionSegment = {
  text: string;
  startSecond: number;
  endSecond: number;
};

export type TranscriptionReadyData = {
  full_text: string;
  srt: string;
  segments: TranscriptionSegment[];
};

export type CaptionReadyData = {
  title: string;
  description: string;
  tags: string[];
};

interface JobStreamCallbacks {
  onAudioReady?: (data: AudioReadyData) => void;
  onTranscriptionReady?: (data: TranscriptionReadyData) => void;
  onCaptionReady?: (data: CaptionReadyData) => void;
  onError?: (message: string) => void;
}

const captionJobService = {
  async submitJob(params: {
    session_id: string;
    file_id?: number;
    prompt?: string;
  }): Promise<{ job_id: string; status: string; turn_index: number }> {
    const { data } = await axiosInstance.post("caption-studio/jobs/", params);
    return data.data;
  },

  streamJob(job_id: string, callbacks: JobStreamCallbacks): () => void {
    const url = `${API_BASE_URL}/caption-studio/jobs/${job_id}/stream/`;
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "audio_ready") {
          callbacks.onAudioReady?.(data);
        } else if (type === "transcription_ready") {
          callbacks.onTranscriptionReady?.(data);
        } else if (type === "caption_ready") {
          callbacks.onCaptionReady?.(data);
          es.close();
        } else if (type === "error") {
          callbacks.onError?.(data.message);
          es.close();
        }
      } catch {
        // ignore malformed events
      }
    };

    es.onerror = () => {
      callbacks.onError?.("Stream connection lost");
      es.close();
    };

    return () => es.close();
  },
};

export default captionJobService;
