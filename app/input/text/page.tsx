"use client";

import { useMemo, useState } from "react";
import { BackLink } from "@/components/back-link";
import { PageContainer } from "@/components/page-container";
import { ResultState } from "@/components/results/result-state";
import { SimplifiedSummaryView } from "@/components/results/simplified-summary-view";
import { requestSimplifiedSummary } from "@/lib/api/simplify";
import { validateInputText } from "@/lib/prompts/simplifyDischargeLetter";
import { SimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";

export default function TextInputPage() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimplifiedDischargeSummary | null>(null);

  const countText = useMemo(() => `${text.length} Zeichen`, [text.length]);

  async function handleSubmit() {
    const validation = validateInputText(text);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await requestSimplifiedSummary(validation.text);
      setResult(response);
    } catch (submitError) {
      setResult(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Die Vereinfachung war leider nicht möglich. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer
      title="Entlassungsbrief als Text einfügen"
      intro="Kopieren Sie den Text aus Ihrem Entlassungsbrief in das Feld unten. Wir erstellen danach eine verständliche, strukturierte Erklärung für Sie."
    >
      <div className="space-y-5">
        <label htmlFor="letterText" className="block text-xl font-semibold text-purple-950">
          Ihr Entlassungsbrief (Text)
        </label>
        <textarea
          id="letterText"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={16}
          className="w-full rounded-2xl border-2 border-purple-200 bg-purple-50/30 p-5 text-lg leading-relaxed text-purple-950 shadow-inner focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200"
          placeholder="Bitte hier den Text einfügen..."
          aria-describedby="text-helper"
        />
        <div id="text-helper" className="flex flex-wrap items-center justify-between gap-3 text-base text-purple-900">
          <p>{countText}</p>
          <p>Hinweis: Bitte keine unnötigen personenbezogenen Daten einfügen.</p>
        </div>

        {error && <ResultState title="Hinweis" message={error} tone="error" />}

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-h-14 rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
          >
            {isLoading ? "Dokument wird verarbeitet..." : "Dokument vereinfachen"}
          </button>
          <BackLink />
        </div>

        {isLoading && (
          <ResultState
            tone="loading"
            title="Wir arbeiten daran"
            message="Ihr Entlassungsbrief wird gerade sicher analysiert. Das dauert meist nur einen kurzen Moment."
          />
        )}

        {result && !isLoading && <SimplifiedSummaryView result={result} />}
      </div>
    </PageContainer>
  );
}
