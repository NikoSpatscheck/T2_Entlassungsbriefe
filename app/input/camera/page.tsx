"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { SimplificationSettingsSelector } from "@/components/input/simplification-settings-selector";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageContainer } from "@/components/page-container";
import { ResultState } from "@/components/results/result-state";
import { requestSimplifiedCameraSummary } from "@/lib/api/simplify";
import { DEFAULT_SIMPLIFICATION_SETTINGS } from "@/lib/simplification/settings";
import { saveSimplifiedResult } from "@/lib/storage/simplified-result";

export default function CameraInputPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState(DEFAULT_SIMPLIFICATION_SETTINGS);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState(
    "Sie können jetzt ein Foto aufnehmen oder ein vorhandenes Bild auswählen.",
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const uploadState = useMemo(() => {
    if (!file) return statusText;
    const megaBytes = (file.size / (1024 * 1024)).toFixed(1);
    return `Bild bereit: ${file.name} (${megaBytes} MB)`;
  }, [file, statusText]);

  async function handleCameraAccess() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatusText("Direkter Kamerazugriff ist auf diesem Gerät leider nicht verfügbar. Bitte nutzen Sie stattdessen den Bild-Upload.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setStatusText("Kamera-Berechtigung erteilt. Bitte nutzen Sie jetzt den Button „Foto aufnehmen / Bild wählen“.");
    } catch {
      setStatusText("Zugriff auf die Kamera wurde nicht erlaubt. Sie können weiterhin ein vorhandenes Bild hochladen.");
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!selectedFile) {
      setFile(null);
      setError("Bitte wählen Sie ein Bild aus.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setFile(null);
      setError("Bitte laden Sie eine gültige Bilddatei hoch.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setStatusText(`Bild bereit: ${selectedFile.name}`);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function clearFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFile(null);
    setError("");
    setStatusText("Sie können jetzt ein Foto aufnehmen oder ein vorhandenes Bild auswählen.");
  }

  async function handleContinue() {
    if (isLoading) return;

    if (!file) {
      setError("Bitte wählen Sie zuerst ein Bild aus.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await requestSimplifiedCameraSummary(file, settings);
      saveSimplifiedResult(response, settings);
      router.push("/result/text");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Das Bild konnte leider nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
      );
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageContainer
        title="Foto vom Entlassungsbrief aufnehmen"
        intro="Nutzen Sie möglichst gutes Licht und halten Sie den Brief vollständig im Bild. Nach dem Upload wird der Text automatisch erkannt und verständlich zusammengefasst."
      >
        <div className="space-y-5">
          <p className="rounded-xl bg-purple-100 p-4 text-lg text-purple-900">{uploadState}</p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCameraAccess}
              disabled={isLoading}
              className="min-h-14 rounded-2xl border-2 border-purple-300 bg-white px-6 text-lg font-semibold text-purple-900 transition hover:bg-purple-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Kamera-Berechtigung prüfen
            </button>

            <label
              htmlFor="cameraUpload"
              className="inline-flex min-h-14 cursor-pointer items-center rounded-2xl bg-purple-700 px-6 text-lg font-semibold text-white transition hover:bg-purple-800 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-purple-900"
            >
              Foto aufnehmen / Bild wählen
            </label>
            <input
              id="cameraUpload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={isLoading}
              className="sr-only"
            />
          </div>

          <p className="text-base text-purple-900">
            {user
              ? "Angemeldet: Dieses Bild wird nach der Verarbeitung in Ihrem Verlauf gespeichert."
              : "Tipp: Melden Sie sich an, damit dieses Bild später in 'Meine bisherigen Dokumente' erscheint."}
          </p>

          <SimplificationSettingsSelector settings={settings} onChange={setSettings} />

          {error && <ResultState title="Hinweis" message={error} tone="error" />}

          {previewUrl && (
            <div className="space-y-3 rounded-2xl border border-purple-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-purple-950">Bildvorschau</p>
                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-xl border border-purple-300 px-3 py-2 text-sm font-semibold text-purple-900 hover:bg-purple-100"
                >
                  Bild entfernen
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Hochgeladenes Foto vom Entlassungsbrief"
                className="max-h-[28rem] w-full rounded-xl border border-purple-200 object-contain"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!file || isLoading}
              className="min-h-14 rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              Dokument vereinfachen
            </button>
            <BackLink />
          </div>
        </div>
      </PageContainer>

      {isLoading && <LoadingOverlay />}
    </>
  );
}
