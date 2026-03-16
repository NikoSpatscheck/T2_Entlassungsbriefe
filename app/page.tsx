import Image from "next/image";
import { ActionCard } from "@/components/action-card";
import { CameraIcon, PdfIcon, TextIcon } from "@/components/icons";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ hinweis?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-14">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-purple-100 bg-purple-50/70 p-4 sm:p-5">
          <Image
            src="/Logo.png"
            alt="OncoSimplify Logo"
            width={64}
            height={64}
            className="h-14 w-14 rounded-2xl border border-purple-200 bg-white object-contain sm:h-16 sm:w-16"
            priority
          />
          <div>
            <p className="text-sm font-semibold tracking-wide text-purple-700 uppercase">OncoSimplify</p>
            <p className="text-xl font-semibold text-purple-950 sm:text-2xl">Entlassungsbrief-Hilfe</p>
          </div>
        </div>

        <p className="mt-6 inline-flex rounded-full bg-purple-100 px-4 py-2 text-base font-semibold text-purple-800">
          Entlassungsbrief leicht verständlich
        </p>
        <h1 className="mt-6 text-4xl leading-tight font-bold text-purple-950 sm:text-5xl">
          Wir helfen Ihnen, Ihren Entlassungsbrief in Ruhe zu verstehen.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-purple-900/90">
          Wählen Sie bitte den einfachsten Weg für Sie: Text einfügen, PDF hochladen oder ein Foto mit der Kamera nutzen.
          Danach erstellen wir eine klare und gut lesbare Zusammenfassung.
        </p>

        {params.hinweis === "login" ? (
          <p className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 px-5 py-4 text-lg text-purple-900">
            Bitte melden Sie sich an, um Ihre bisherigen Dokumente zu sehen.
          </p>
        ) : null}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <ActionCard
            href="/input/text"
            title="Freitext"
            description="Fügen Sie den Inhalt Ihres Briefes direkt in ein großes Textfeld ein."
            helper="Jetzt Text einfügen"
            icon={<TextIcon className="h-6 w-6" />}
          />
          <ActionCard
            href="/input/camera"
            title="Kamera"
            description="Machen Sie ein Foto vom Brief oder wählen Sie ein Bild aus Ihrer Galerie."
            helper="Jetzt Foto aufnehmen"
            icon={<CameraIcon className="h-6 w-6" />}
          />
          <ActionCard
            href="/input/pdf"
            title="PDF"
            description="Laden Sie den Entlassungsbrief als PDF-Datei von Ihrem Gerät hoch."
            helper="Jetzt PDF auswählen"
            icon={<PdfIcon className="h-6 w-6" />}
          />
        </div>
      </section>
    </main>
  );
}
