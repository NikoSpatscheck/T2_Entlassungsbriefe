import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { listDocumentsForUser } from "@/lib/db/store";
import { formatDocumentType, formatGermanDate } from "@/lib/documents/format";

export default async function DocumentsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/?hinweis=login");
  }

  const documents = await listDocumentsForUser(user.id);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <h1 className="text-3xl font-bold text-purple-950 sm:text-4xl">Meine bisherigen Dokumente</h1>
        <p className="mt-4 max-w-3xl text-xl leading-relaxed text-purple-900/90">
          Hier finden Sie Ihre bereits gespeicherten Ergebnisse. Sie können jedes Dokument erneut öffnen.
        </p>

        {!documents.length ? (
          <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <h2 className="text-2xl font-semibold text-purple-950">Noch keine gespeicherten Dokumente</h2>
            <p className="mt-2 text-lg text-purple-900">Sie haben noch keine Dokumente gespeichert.</p>
            <Link href="/input/text" className="mt-5 inline-flex min-h-14 items-center rounded-2xl bg-purple-700 px-8 text-lg font-semibold text-white hover:bg-purple-800">
              Erstes Dokument vereinfachen
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {documents.map((document) => (
              <li key={document.id}>
                <Link
                  href={`/dokumente/${document.id}`}
                  className="block rounded-2xl border border-purple-200 bg-white p-5 transition hover:border-purple-400 hover:bg-purple-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold text-purple-950">{document.title || "Gespeichertes Dokument"}</p>
                      <p className="mt-2 text-base text-purple-900">Dieses Dokument wurde am {formatGermanDate(document.createdAt)} erstellt.</p>
                    </div>
                    <span className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-900">
                      {formatDocumentType(document.type)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
