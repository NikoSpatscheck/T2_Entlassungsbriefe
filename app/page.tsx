import { ActionCard } from "@/components/action-card";
import { CameraIcon, PdfIcon, TextIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-14">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <p className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-base font-semibold text-purple-800">
          Entlassungsbrief leicht verständlich
        </p>
        <h1 className="mt-6 text-4xl leading-tight font-bold text-purple-950 sm:text-5xl">
          Wir helfen Ihnen, Ihren Entlassungsbrief in Ruhe zu verstehen.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-purple-900/90">
          Wählen Sie bitte den einfachsten Weg für Sie: Text einfügen, PDF hochladen oder ein Foto mit der Kamera nutzen.
          Danach erstellen wir eine klare und gut lesbare Zusammenfassung.
        </p>

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
