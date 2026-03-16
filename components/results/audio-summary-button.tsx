"use client";

import { useEffect, useRef, useState } from "react";
import { requestAudioSummary } from "@/lib/api/audio-summary";
import { ResultLabels } from "@/lib/simplification/result-i18n";
import { TargetLanguage } from "@/lib/simplification/settings";

type AudioSummaryButtonProps = {
  spokenSummary: string;
  labels: ResultLabels;
  targetLanguage: TargetLanguage;
};

export function AudioSummaryButton({ spokenSummary, labels, targetLanguage }: AudioSummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCachedAudio, setHasCachedAudio] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const lastSummaryRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (lastSummaryRef.current === spokenSummary) return;

    lastSummaryRef.current = spokenSummary;
    setHasCachedAudio(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, [spokenSummary]);

  async function ensureAudioElement() {
    if (audioRef.current) return audioRef.current;

    const blob = await requestAudioSummary(spokenSummary, targetLanguage);
    const objectUrl = URL.createObjectURL(blob);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = objectUrl;

    const audio = new Audio(objectUrl);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      setError(labels.audioPlaybackErrorLabel);
    };

    audioRef.current = audio;
    setHasCachedAudio(true);

    return audio;
  }

  async function handleReadAloud() {
    if (!spokenSummary || isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const audio = await ensureAudioElement();
      audio.currentTime = 0;
      await audio.play();
      setIsPlaying(true);
    } catch (playbackError) {
      setIsPlaying(false);
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : labels.audioPlaybackErrorLabel,
      );
    } finally {
      setIsLoading(false);
    }
  }

  const buttonLabel = isLoading
    ? labels.preparingAudioLabel
    : isPlaying
      ? labels.readAgainLabel
      : hasCachedAudio
        ? labels.replayAudioLabel
        : labels.readSummaryLabel;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleReadAloud}
        disabled={isLoading || !spokenSummary}
        className="min-h-14 rounded-2xl border-2 border-purple-300 bg-purple-100 px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
      >
        {buttonLabel}
      </button>
      {!spokenSummary && (
        <p className="text-base text-red-700">{labels.noAudioSummaryLabel}</p>
      )}
      {error && <p className="text-base text-red-700">{error}</p>}
    </div>
  );
}
