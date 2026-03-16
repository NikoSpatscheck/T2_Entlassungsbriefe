"use client";

import Link from "next/link";
import { ResultState } from "@/components/results/result-state";
import { SimplifiedResultContent } from "@/components/results/simplified-result-content";
import { loadSimplifiedResult } from "@/lib/storage/simplified-result";

export default function TextResultPage() {
  const isHydrated = typeof window !== "undefined";
  const result = isHydrated ? loadSimplifiedResult() : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <h1 className="text-3xl font-bold text-purple-950 sm:text-4xl">Ihre verständliche Erklärung ist bereit</h1>
        <p className="mt-4 max-w-3xl text-xl leading-relaxed text-purple-900/90">
          Nehmen Sie sich Zeit. Wir haben die wichtigsten Informationen in klaren Abschnitten für Sie aufbereitet.
        </p>

        {!isHydrated ? null : !result ? (
          <div className="mt-8 space-y-5">
            <ResultState
              tone="empty"
              title="Noch kein Ergebnis verfügbar"
              message="Bitte starten Sie zuerst mit einem Entlassungsbrief. Danach sehen Sie Ihre vereinfachte Erklärung hier."
            />
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="inline-flex min-h-14 items-center rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800">
                Zur Startseite
              </Link>
              <Link href="/input/text" className="inline-flex min-h-14 items-center rounded-2xl border-2 border-purple-200 bg-white px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-100">
                Neues Dokument vereinfachen
              </Link>
            </div>
          </div>
        ) : (
          <SimplifiedResultContent
            result={result}
            primaryAction={{ href: "/", label: "Zur Startseite" }}
            secondaryAction={{ href: "/input/text", label: "Neues Dokument vereinfachen" }}
          />
        )}
      </section>
    </main>
  );
}
