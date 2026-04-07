export interface UserMessage {
  id: string;
  role: "user";
  text: string;
  imageUrl?: string;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  isStreaming: boolean;
  reasoningText: string;
  showAudio: boolean;
  showTranscription: boolean;
  showCaptions: boolean;
}

export type ChatMessage = UserMessage | AssistantMessage;

export const SAMPLE_AUDIO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

export const SAMPLE_SEGMENTS = [
  { text: "Capturing", startSecond: 0, endSecond: 0.6 },
  { text: "the", startSecond: 0.6, endSecond: 0.8 },
  { text: "moment", startSecond: 0.8, endSecond: 1.3 },
  { text: "when", startSecond: 1.3, endSecond: 1.6 },
  { text: "light", startSecond: 1.6, endSecond: 2.0 },
  { text: "meets", startSecond: 2.0, endSecond: 2.4 },
  { text: "shadow,", startSecond: 2.4, endSecond: 3.0 },
  { text: "the", startSecond: 3.0, endSecond: 3.2 },
  { text: "world", startSecond: 3.2, endSecond: 3.6 },
  { text: "holds", startSecond: 3.6, endSecond: 4.0 },
  { text: "its", startSecond: 4.0, endSecond: 4.2 },
  { text: "breath.", startSecond: 4.2, endSecond: 5.0 },
];

export const SAMPLE_TITLE = "Golden Hour — When Light Meets Shadow";
export const SAMPLE_DESCRIPTION =
  "A cinematic moment captured at dusk, where the interplay of light and shadow tells a story beyond words. Perfect for travel, lifestyle, and nature content.";
export const SAMPLE_TAGS =
  "#GoldenHour #CinematicVibes #NaturePhotography #SunsetMoment #VisualStorytelling";

export const REASONING_STEPS = [
  "Converting video to audio...",
  "Converting video to audio... ✓\n\nTranscribing audio in original language...",
  "Converting video to audio... ✓\n\nTranscribing audio... ✓\n\nGenerating title, description and tags...",
  "Converting video to audio... ✓\n\nTranscribing audio... ✓\n\nGenerating title, description and tags... ✓",
];
