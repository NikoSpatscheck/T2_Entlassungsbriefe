import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SimplifiedResultContent } from "@/components/results/simplified-result-content";
import { validateSimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";
import { getSessionUser } from "@/lib/auth/session";
import { getDocumentForUser } from "@/lib/db/store";
import { formatDocumentType, formatGermanDate } from "@/lib/documents/format";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) {
    redirect("/?hinweis=login");
  }

  const document = await getDocumentForUser(user.id, id);
  if (!document) {
    notFound();
  }

  const result = document.result ? validateSimplifiedDischargeSummary(document.result) : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <h1 className="text-3xl font-bold text-purple-950 sm:text-4xl">Gespeichertes Dokument</h1>
        <div className="mt-4 flex flex-wrap gap-3 text-base text-purple-900">
          <span className="rounded-full bg-purple-100 px-4 py-2">Dokumenttyp: {formatDocumentType(document.type)}</span>
          <span className="rounded-full bg-purple-100 px-4 py-2">Erstellt am: {formatGermanDate(document.createdAt)}</span>
          {document.sourceFileName ? <span className="rounded-full bg-purple-100 px-4 py-2">Datei: {document.sourceFileName}</span> : null}
        </div>

        {result ? (
          <SimplifiedResultContent
            result={result}
            primaryAction={{ href: "/dokumente", label: "Zurück zur Liste" }}
            secondaryAction={{ href: "/", label: "Zur Startseite" }}
          />
        ) : (
          <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <p className="text-lg text-purple-900">
              Für dieses Dokument liegt noch kein vollständiges Ergebnis vor. Bitte versuchen Sie es später erneut.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/dokumente" className="inline-flex min-h-12 items-center rounded-xl bg-purple-700 px-6 text-white">
                Zurück zur Liste
              </Link>
              <Link href="/" className="inline-flex min-h-12 items-center rounded-xl border border-purple-300 px-6 text-purple-900">
                Zur Startseite
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
