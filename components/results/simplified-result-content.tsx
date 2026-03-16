import Link from "next/link";
import { AudioSummaryButton } from "@/components/results/audio-summary-button";
import { ResultCard } from "@/components/results/result-card";
import { MISSING_INFO_TEXT, SimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";
import { ResultLabels } from "@/lib/simplification/result-i18n";
import { TargetLanguage } from "@/lib/simplification/settings";

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

export function SimplifiedResultContent({
  result,
  labels,
  targetLanguage,
  primaryAction,
  secondaryAction,
}: {
  result: SimplifiedDischargeSummary;
  labels: ResultLabels;
  targetLanguage: TargetLanguage;
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
}) {
  return (
    <>
      <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold text-purple-950">{labels.spokenSummaryTitle}</h2>
        <p className="mt-3 text-lg leading-relaxed text-purple-900">{result.spokenSummary}</p>
        <div className="mt-4">
          <AudioSummaryButton spokenSummary={result.spokenSummary} labels={labels} targetLanguage={targetLanguage} />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <ResultCard title={labels.nextStepsAndFollowUpTitle}>
          {result.nextStepsAndFollowUp.length ? (
            <div className="space-y-3">
              {result.nextStepsAndFollowUp.map((entry) => (
                <div key={`${entry.description}-${entry.purpose}`} className="rounded-xl bg-white p-4">
                  <p><span className="font-semibold">{labels.descriptionLabel}:</span> {entry.description}</p>
                  <p><span className="font-semibold">{labels.purposeLabel}:</span> {entry.purpose}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{MISSING_INFO_TEXT}</p>
          )}
        </ResultCard>

        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard title={labels.secondaryDiagnosesTitle}><ListContent items={result.secondaryDiagnoses} /></ResultCard>
          <ResultCard title={labels.whatToLookOutForTitle}><ListContent items={result.whatToLookOutFor} /></ResultCard>
          <ResultCard title={labels.anythingToTakeCareOfTitle}><ListContent items={result.anythingToTakeCareOf} /></ResultCard>
          <ResultCard title={labels.doctorQuestionsTitle}><ListContent items={result.questionsForDoctor} /></ResultCard>
        </div>

        <ResultCard title={labels.medicationsTitle}>
          {result.medications.length ? (
            <div className="space-y-3">
              {result.medications.map((medication) => (
                <div key={`${medication.name}-${medication.purpose}`} className="rounded-xl bg-white p-4">
                  <p className="font-semibold text-purple-950">{medication.name}</p>
                  <p><span className="font-semibold">{labels.medicationPurposeLabel}:</span> {medication.purpose}</p>
                  <p><span className="font-semibold">{labels.medicationInstructionLabel}:</span> {medication.instructions}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{MISSING_INFO_TEXT}</p>
          )}
        </ResultCard>

        <ResultCard title={labels.glossaryTitle}>
          {result.glossary.length ? (
            <div className="space-y-2">
              {result.glossary.map((entry) => (
                <p key={`${entry.medicalTerm}-${entry.plainExplanation}`}><span className="font-semibold text-purple-950">{entry.medicalTerm}:</span> {entry.plainExplanation}</p>
              ))}
            </div>
          ) : (
            <p>{labels.noGlossaryNeeded}</p>
          )}
        </ResultCard>

        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-lg text-amber-900">
          <h3 className="font-semibold">{labels.importantDisclaimerTitle}</h3>
          <p className="mt-2 font-medium">{result.importantDisclaimer}</p>
        </article>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="mt-8 flex flex-wrap gap-4">
          {primaryAction ? <Link href={primaryAction.href} className="inline-flex min-h-14 items-center rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800">{primaryAction.label}</Link> : null}
          {secondaryAction ? <Link href={secondaryAction.href} className="inline-flex min-h-14 items-center rounded-2xl border-2 border-purple-200 bg-white px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-100">{secondaryAction.label}</Link> : null}
        </div>
      )}
    </>
  );
}
