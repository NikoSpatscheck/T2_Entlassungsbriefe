"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { PageContainer } from "@/components/page-container";

export default function PdfInputPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadState = useMemo(() => {
    if (!file) return "Noch keine PDF ausgewählt";
    return `PDF bereit: ${file.name}`;
  }, [file]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return;
    }

    setPreviewUrl(null);
  }

  function handleContinue() {
    if (!file) return;

    // TODO: Hier PDF-Parsing/OCR anschließen und strukturierte Daten weiterreichen.
    router.push(`/processing?source=pdf&filename=${encodeURIComponent(file.name)}`);
  }

  return (
    <PageContainer
      title="Entlassungsbrief als PDF hochladen"
      intro="Wählen Sie Ihre PDF-Datei aus. Danach können Sie direkt zur vereinfachten Erklärung weitergehen."
    >
      <div className="space-y-5">
        <label htmlFor="pdfUpload" className="block text-xl font-semibold text-purple-950">
          PDF-Datei auswählen
        </label>
        <input
          id="pdfUpload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 p-4 text-lg file:mr-4 file:rounded-xl file:border-0 file:bg-purple-700 file:px-5 file:py-3 file:text-base file:font-semibold file:text-white hover:file:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-200"
        />

        <p className="rounded-xl bg-purple-100 p-3 text-lg text-purple-900">{uploadState}</p>

        {previewUrl && (
          <div className="space-y-3 rounded-2xl border border-purple-200 bg-white p-4">
            <p className="text-lg font-semibold text-purple-950">Vorschau</p>
            <iframe src={previewUrl} className="h-80 w-full rounded-xl border border-purple-200" title="PDF Vorschau" />
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!file}
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
