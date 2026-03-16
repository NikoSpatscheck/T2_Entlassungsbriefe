"use client";

import { useEffect, useRef, useState } from "react";
import { requestAudioSummary } from "@/lib/api/audio-summary";

type AudioSummaryButtonProps = {
  audioSummaryText: string;
};

function base64ToBlob(base64: string, mimeType: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

export function AudioSummaryButton({ audioSummaryText }: AudioSummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  async function handleReadAloud() {
    if (!audioSummaryText || isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const payload = await requestAudioSummary(audioSummaryText);
      const blob = base64ToBlob(payload.audioBase64, payload.mimeType);
      const objectUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = objectUrl;
      } else {
        audioRef.current = new Audio(objectUrl);
      }

      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        setError("We could not play the audio in this browser. Please try again.");
      };

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (playbackError) {
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : "We could not prepare the audio summary. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleReadAloud}
        disabled={isLoading || !audioSummaryText}
        className="min-h-14 rounded-2xl border-2 border-purple-300 bg-purple-100 px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
      >
        {isLoading ? "Preparing audio…" : isPlaying ? "Play again" : "Read summary aloud"}
      </button>
      {error && <p className="text-base text-red-700">{error}</p>}
    </div>
  );
}
