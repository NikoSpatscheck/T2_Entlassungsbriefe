"use client";

import Link from "next/link";
import { ResultState } from "@/components/results/result-state";
import { SimplifiedResultContent } from "@/components/results/simplified-result-content";
import { getResultLabels } from "@/lib/simplification/result-i18n";
import { loadSimplifiedResult } from "@/lib/storage/simplified-result";

export default function TextResultPage() {
  const isHydrated = typeof window !== "undefined";
  const payload = isHydrated ? loadSimplifiedResult() : null;
  const language = payload?.settings.targetLanguage ?? "de";
  const labels = getResultLabels(language);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <h1 className="text-3xl font-bold text-purple-950 sm:text-4xl">{labels.pageTitle}</h1>
        <p className="mt-4 max-w-3xl text-xl leading-relaxed text-purple-900/90">{labels.pageIntro}</p>

        {!isHydrated ? null : !payload ? (
          <div className="mt-8 space-y-5">
            <ResultState
              tone="empty"
              title={labels.emptyTitle}
              message={labels.emptyMessage}
            />
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="inline-flex min-h-14 items-center rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800">
                {labels.homeAction}
              </Link>
              <Link href="/input/text" className="inline-flex min-h-14 items-center rounded-2xl border-2 border-purple-200 bg-white px-8 text-lg font-semibold text-purple-900 transition hover:bg-purple-100">
                {labels.newDocumentAction}
              </Link>
            </div>
          </div>
        ) : (
          <SimplifiedResultContent
            result={payload.result}
            labels={labels}
            targetLanguage={payload.settings.targetLanguage}
            primaryAction={{ href: "/", label: labels.homeAction }}
            secondaryAction={{ href: "/input/text", label: labels.newDocumentAction }}
          />
        )}
      </section>
    </main>
  );
}
