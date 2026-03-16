import { MISSING_INFO_TEXT, SimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";

type SimplifiedSummaryViewProps = {
  result: SimplifiedDischargeSummary;
};

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
      <h3 className="text-2xl font-semibold text-purple-950">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg text-purple-900/90">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-lg text-purple-900/80">{MISSING_INFO_TEXT}</p>
      )}
    </article>
  );
}

export function SimplifiedSummaryView({ result }: SimplifiedSummaryViewProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
      <header>
        <h2 className="text-3xl font-bold text-purple-950">Zusammenfassung zum Vorlesen</h2>
        <p className="mt-3 text-xl leading-relaxed text-purple-900/90">{result.spokenSummary}</p>
      </header>

      <article className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
        <h3 className="text-2xl font-semibold text-purple-950">Nächste Schritte und Nachsorge</h3>
        <div className="mt-3 space-y-3">
          {result.nextStepsAndFollowUp.length > 0 ? (
            result.nextStepsAndFollowUp.map((entry) => (
              <div key={`${entry.description}-${entry.purpose}`} className="rounded-xl bg-white p-4">
                <p className="text-lg text-purple-900/90"><span className="font-medium">Was:</span> {entry.description}</p>
                <p className="text-lg text-purple-900/90"><span className="font-medium">Wozu:</span> {entry.purpose}</p>
              </div>
            ))
          ) : (
            <p className="text-lg text-purple-900/80">{MISSING_INFO_TEXT}</p>
          )}
        </div>
      </article>

      <div className="grid gap-4 sm:grid-cols-2">
        <ListSection title="Nebendiagnosen" items={result.secondaryDiagnoses} />
        <ListSection title="Worauf Sie achten sollten" items={result.whatToLookOutFor} />
        <ListSection title="Was Sie beachten sollten" items={result.anythingToTakeCareOf} />
        <ListSection title="Fragen für Ihre Ärztin oder Ihren Arzt" items={result.questionsForDoctor} />
      </div>

      <article className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
        <h3 className="text-2xl font-semibold text-purple-950">Medikamente</h3>
        <div className="mt-3 space-y-3">
          {result.medications.length > 0 ? (
            result.medications.map((medication) => (
              <div key={`${medication.name}-${medication.purpose}`} className="rounded-xl bg-white p-4">
                <p className="text-lg font-semibold text-purple-950">{medication.name}</p>
                <p className="text-lg text-purple-900/90">
                  <span className="font-medium">Wofür:</span> {medication.purpose}
                </p>
                <p className="text-lg text-purple-900/90">
                  <span className="font-medium">Einnahmehinweis:</span> {medication.instructions}
                </p>
              </div>
            ))
          ) : (
            <p className="text-lg text-purple-900/80">{MISSING_INFO_TEXT}</p>
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
        <h3 className="text-2xl font-semibold text-purple-950">Begriffe einfach erklärt</h3>
        <div className="mt-3 space-y-2">
          {result.glossary.length > 0 ? (
            result.glossary.map((entry) => (
              <p key={`${entry.medicalTerm}-${entry.plainExplanation}`} className="text-lg text-purple-900/90">
                <span className="font-semibold text-purple-950">{entry.medicalTerm}:</span> {entry.plainExplanation}
              </p>
            ))
          ) : (
            <p className="text-lg text-purple-900/80">Es sind keine zusätzlichen Begriffserklärungen nötig.</p>
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-lg text-amber-900">
        <p className="font-medium">{result.importantDisclaimer}</p>
      </article>
    </section>
  );
}
