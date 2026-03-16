import Link from "next/link";
import { SpeakerIcon } from "@/components/icons";
import { resultSections } from "@/lib/mock-result";

type ResultPageProps = {
  searchParams: Promise<{
    source?: string;
    snippet?: string;
    filename?: string;
  }>;
};

const sourceLabels: Record<string, string> = {
  text: "Eingabe über Freitext",
  pdf: "Eingabe über PDF",
  camera: "Eingabe über Kamera/Bild",
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const snippet = params.snippet ? decodeURIComponent(params.snippet) : "";
  const sourceLabel = sourceLabels[params.source ?? ""] ?? "Unbekannte Eingabequelle";

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <h1 className="text-3xl font-bold text-purple-950 sm:text-4xl">Ihre vereinfachte Erklärung ist bereit</h1>
        <p className="mt-4 text-lg leading-relaxed text-purple-900/90">
          Hier sehen Sie eine gut verständliche Zusammenfassung. Bitte besprechen Sie wichtige medizinische Fragen immer zusätzlich mit Ihrer Ärztin oder Ihrem Arzt.
        </p>

        <div className="mt-5 rounded-2xl bg-purple-100 p-4 text-lg text-purple-900">
          <p>
            <span className="font-semibold">Quelle:</span> {sourceLabel}
          </p>
          {params.filename && (
            <p>
              <span className="font-semibold">Datei:</span> {decodeURIComponent(params.filename)}
            </p>
          )}
        </div>

        {snippet && (
          <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-4">
            <h2 className="text-xl font-semibold text-purple-950">Aus Ihrem Originaltext</h2>
            <p className="mt-2 text-lg text-purple-900/90">„{snippet}…“</p>
          </div>
        )}

        <button
          type="button"
          className="mt-6 inline-flex min-h-14 items-center gap-3 rounded-2xl border-2 border-purple-200 bg-white px-6 text-lg font-semibold text-purple-900 transition hover:bg-purple-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
        >
          <SpeakerIcon className="h-6 w-6" />
          Vorlesen (demnächst verfügbar)
        </button>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {resultSections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
              <h2 className="text-2xl font-semibold text-purple-950">{section.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-purple-900/90">{section.content}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex min-h-14 items-center rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
          >
            Neues Dokument starten
          </Link>
          <Link
            href="/input/text"
            className="inline-flex min-h-14 items-center rounded-2xl border-2 border-purple-200 bg-white px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
          >
            Direkt Text eingeben
          </Link>
        </div>
      </section>
    </main>
  );
}
