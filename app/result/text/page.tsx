"use client";

import Link from "next/link";
import { AudioSummaryButton } from "@/components/results/audio-summary-button";
import { ResultCard } from "@/components/results/result-card";
import { ResultState } from "@/components/results/result-state";
import { MISSING_INFO_TEXT, SimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";
import { loadSimplifiedResult } from "@/lib/storage/simplified-result";

function ListContent({ items }: { items: string[] }) {
  if (!items.length) {
    return <p>{MISSING_INFO_TEXT}</p>;
  }

  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function TextResultPage() {
  const isHydrated = typeof window !== "undefined";
  const result: SimplifiedDischargeSummary | null = isHydrated ? loadSimplifiedResult() : null;

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
              <Link
                href="/"
                className="inline-flex min-h-14 items-center rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
              >
                Zur Startseite
              </Link>
              <Link
                href="/input/text"
                className="inline-flex min-h-14 items-center rounded-2xl border-2 border-purple-200 bg-white px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
              >
                Neues Dokument vereinfachen
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-purple-950">Kurze Zusammenfassung</h2>
              <p className="mt-3 text-lg leading-relaxed text-purple-900">{result.spokenSummary}</p>
              <div className="mt-4">
                <AudioSummaryButton spokenSummary={result.spokenSummary} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <ResultCard title={result.summaryTitle}>
                <p>{result.simpleSummary}</p>
              </ResultCard>

              <ResultCard title="Grund für den Krankenhausaufenthalt">
                <p>{result.reasonForHospitalVisit}</p>
              </ResultCard>

              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard title="Wichtige Befunde">
                  <ListContent items={result.keyFindings} />
                </ResultCard>
                <ResultCard title="Behandlungen im Krankenhaus">
                  <ListContent items={result.treatmentsReceived} />
                </ResultCard>
                <ResultCard title="Nächste Schritte">
                  <ListContent items={result.nextSteps} />
                </ResultCard>
                <ResultCard title="Warnzeichen">
                  <ListContent items={result.warningSigns} />
                </ResultCard>
                <ResultCard title="Nachsorge">
                  <ListContent items={result.followUp} />
                </ResultCard>
                <ResultCard title="Fragen für Ihre Ärztin oder Ihren Arzt">
                  <ListContent items={result.questionsForDoctor} />
                </ResultCard>
              </div>

              <ResultCard title="Medikamente">
                {result.medications.length ? (
                  <div className="space-y-3">
                    {result.medications.map((medication) => (
                      <div key={`${medication.name}-${medication.purpose}`} className="rounded-xl bg-white p-4">
                        <p className="font-semibold text-purple-950">{medication.name}</p>
                        <p>
                          <span className="font-semibold">Wofür:</span> {medication.purpose}
                        </p>
                        <p>
                          <span className="font-semibold">Einnahmehinweis:</span> {medication.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{MISSING_INFO_TEXT}</p>
                )}
              </ResultCard>

              <ResultCard title="Begriffe einfach erklärt">
                {result.glossary.length ? (
                  <div className="space-y-2">
                    {result.glossary.map((entry) => (
                      <p key={`${entry.medicalTerm}-${entry.plainExplanation}`}>
                        <span className="font-semibold text-purple-950">{entry.medicalTerm}:</span> {entry.plainExplanation}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>Es sind keine zusätzlichen Begriffserklärungen nötig.</p>
                )}
              </ResultCard>

              <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-lg text-amber-900">
                <p className="font-medium">{result.importantDisclaimer}</p>
              </article>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex min-h-14 items-center rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
              >
                Zur Startseite
              </Link>
              <Link
                href="/input/text"
                className="inline-flex min-h-14 items-center rounded-2xl border-2 border-purple-200 bg-white px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
              >
                Neues Dokument vereinfachen
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
