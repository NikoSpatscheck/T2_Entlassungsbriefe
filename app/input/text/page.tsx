"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { PageContainer } from "@/components/page-container";

export default function TextInputPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const countText = useMemo(() => `${text.length} Zeichen`, [text.length]);

  function handleSubmit() {
    if (!text.trim()) {
      setError("Bitte fügen Sie zuerst den Text Ihres Entlassungsbriefes ein.");
      return;
    }

    setError("");
    const snippet = encodeURIComponent(text.trim().slice(0, 220));
    router.push(`/processing?source=text&snippet=${snippet}`);
  }

  return (
    <PageContainer
      title="Entlassungsbrief als Text einfügen"
      intro="Kopieren Sie den Text aus Ihrem Entlassungsbrief in das Feld unten. Nehmen Sie sich Zeit – Sie können alles in Ruhe prüfen, bevor Sie fortfahren."
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
          <p>Hinweis: Ihre Eingabe wird in diesem Prototyp nur lokal im Browser verwendet.</p>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-lg font-medium text-red-700">{error}</p>}

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="min-h-14 rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white transition hover:bg-purple-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
          >
            Dokument vereinfachen
          </button>
          <BackLink />
        </div>
      </div>
    </PageContainer>
  );
}
