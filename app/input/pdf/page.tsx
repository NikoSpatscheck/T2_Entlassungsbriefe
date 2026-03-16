"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageContainer } from "@/components/page-container";
import { ResultState } from "@/components/results/result-state";
import { requestSimplifiedPdfSummary } from "@/lib/api/simplify";
import { saveSimplifiedResult } from "@/lib/storage/simplified-result";

export default function PdfInputPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const uploadState = useMemo(() => {
    if (!file) return "Noch keine PDF ausgewählt.";
    const megaBytes = (file.size / (1024 * 1024)).toFixed(1);
    return `PDF bereit: ${file.name} (${megaBytes} MB)`;
  }, [file]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!selectedFile) {
      setFile(null);
      setError("Bitte wählen Sie eine PDF-Datei aus.");
      return;
    }

    if (selectedFile.type && selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Bitte laden Sie eine gültige PDF-Datei hoch.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function clearFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFile(null);
    setError("");
  }

  async function handleContinue() {
    if (isLoading) return;

    if (!file) {
      setError("Bitte wählen Sie zuerst eine PDF-Datei aus.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await requestSimplifiedPdfSummary(file);
      saveSimplifiedResult(response);
      router.push("/result/text");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Die PDF-Datei konnte leider nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
      );
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageContainer
        title="Entlassungsbrief als PDF hochladen"
        intro="Wählen Sie Ihre PDF-Datei aus. Danach erstellen wir eine verständliche Erklärung im gleichen Format wie bei Freitext."
      >
        <div className="space-y-5">
          <label htmlFor="pdfUpload" className="block text-xl font-semibold text-purple-950">
            PDF-Datei auswählen
          </label>
          <input
            id="pdfUpload"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 p-4 text-lg file:mr-4 file:rounded-xl file:border-0 file:bg-purple-700 file:px-5 file:py-3 file:text-base file:font-semibold file:text-white hover:file:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-70"
          />

          <p className="rounded-xl bg-purple-100 p-3 text-lg text-purple-900">{uploadState}</p>
          <p className="text-base text-purple-900">
            {user
              ? "Angemeldet: Dieses PDF wird nach der Verarbeitung in Ihrem Verlauf gespeichert."
              : "Tipp: Melden Sie sich an, damit dieses PDF später in 'Meine bisherigen Dokumente' erscheint."}
          </p>

          {error && <ResultState title="Hinweis" message={error} tone="error" />}

          {previewUrl && (
            <div className="space-y-3 rounded-2xl border border-purple-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-purple-950">Vorschau</p>
                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-xl border border-purple-300 px-3 py-2 text-sm font-semibold text-purple-900 hover:bg-purple-100"
                >
                  Datei entfernen
                </button>
              </div>
              <iframe src={previewUrl} className="h-80 w-full rounded-xl border border-purple-200" title="PDF Vorschau" />
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
