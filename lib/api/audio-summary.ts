export type AudioSummaryPayload = {
  audioBase64: string;
  mimeType: string;
};

export async function requestAudioSummary(audioSummaryText: string): Promise<AudioSummaryPayload> {
  const response = await fetch("/api/audio-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioSummaryText }),
  });

  const payload = (await response.json()) as { audioBase64?: string; mimeType?: string; error?: string };

  if (!response.ok || !payload.audioBase64 || !payload.mimeType) {
    throw new Error(payload.error ?? "Audio playback is unavailable right now. Please try again.");
  }

  return {
    audioBase64: payload.audioBase64,
    mimeType: payload.mimeType,
  };
}
