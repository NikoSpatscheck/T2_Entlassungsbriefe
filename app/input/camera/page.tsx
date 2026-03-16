"use client";

import { type ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { PageContainer } from "@/components/page-container";

export default function CameraInputPage() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(
    "Sie können jetzt ein Foto aufnehmen oder ein vorhandenes Bild auswählen.",
  );

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
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setStatusText(`Bild bereit: ${selectedFile.name}`);
  }

  function handleContinue() {
    if (!previewUrl) return;

    // TODO: Hier OCR-Bildverarbeitung anbinden und Text extrahieren.
    router.push("/processing?source=camera");
  }

  return (
    <PageContainer
      title="Foto vom Entlassungsbrief aufnehmen"
      intro="Nutzen Sie möglichst gutes Licht und halten Sie den Brief vollständig im Bild. Wenn die Kamera nicht verfügbar ist, können Sie einfach ein Foto aus Ihrer Galerie auswählen."
    >
      <div className="space-y-5">
        <p className="rounded-xl bg-purple-100 p-4 text-lg text-purple-900">{statusText}</p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCameraAccess}
            className="min-h-14 rounded-2xl border-2 border-purple-300 bg-white px-6 text-lg font-semibold text-purple-900 transition hover:bg-purple-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
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
            className="sr-only"
          />
        </div>

        {previewUrl && (
          <div className="space-y-3 rounded-2xl border border-purple-200 bg-white p-4">
            <p className="text-lg font-semibold text-purple-950">Bildvorschau</p>
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
            disabled={!previewUrl}
            className="min-h-14 rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900 disabled:cursor-not-allowed disabled:bg-purple-300"
          >
            Dokument vereinfachen
          </button>
          <BackLink />
        </div>
      </div>
    </PageContainer>
  );
}
