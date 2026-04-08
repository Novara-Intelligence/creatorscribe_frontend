export interface UserMessage {
  id: string;
  role: "user";
  text: string;
  imageUrl?: string;
  mediaType?: string;
}

export interface TranscriptionSegment {
  text: string;
  startSecond: number;
  endSecond: number;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  isStreaming: boolean;
  reasoningText: string;
  // audio_ready
  audioUrl?: string;
  audioDuration?: number;
  // transcription_ready
  segments?: TranscriptionSegment[];
  // caption_ready
  title?: string;
  description?: string;
  tags?: string[];
  // error
  errorMessage?: string;
}

export type ChatMessage = UserMessage | AssistantMessage;

export const REASONING = {
  video: {
    start: "Converting video to audio...",
    audio: "Converting video to audio... ✓\n\nTranscribing audio...",
    transcription: "Converting video to audio... ✓\n\nTranscribing audio... ✓\n\nGenerating captions...",
    done: "Converting video to audio... ✓\n\nTranscribing audio... ✓\n\nGenerating captions... ✓",
  },
  image: {
    start: "Generating captions...",
    done: "Generating captions... ✓",
  },
};
