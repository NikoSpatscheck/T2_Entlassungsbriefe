export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ImageExtractionError, extractTextFromImage } from "@/lib/image/extract";
import { simplifyAndPersistDocument } from "@/lib/services/document-simplification";
import { parseSimplificationSettings } from "@/lib/simplification/settings";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: "Bitte wählen Sie zuerst ein Bild aus." }, { status: 400 });
    }

    const rawSettings = formData.get("settings");
    const parsedRawSettings = typeof rawSettings === "string" ? JSON.parse(rawSettings) : undefined;
    const parsedSettings = parseSimplificationSettings(parsedRawSettings);

    if (!parsedSettings.ok) {
      return NextResponse.json({ error: parsedSettings.message }, { status: 400 });
    }

    const extractedText = await extractTextFromImage(fileEntry);
    const result = await simplifyAndPersistDocument({
      rawText: extractedText,
      sourceType: "kamera",
      titleFallback: fileEntry.name || "Kamera-Dokument",
      fileName: fileEntry.name || "Kamera-Dokument",
      settings: parsedSettings.settings,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ data: result.data, savedDocumentId: result.savedDocumentId });
  } catch (error) {
    if (error instanceof ImageExtractionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Die übergebenen Vereinfachungsoptionen sind ungültig." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unbekannter Serverfehler.";

    if (message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "Der Dienst ist noch nicht eingerichtet. Bitte OPENAI_API_KEY in .env.local setzen." },
        { status: 500 },
      );
    }

    if (message.includes("OpenAI request failed (429)")) {
      return NextResponse.json(
        { error: "Der Dienst ist gerade ausgelastet. Bitte versuchen Sie es in einem Moment erneut." },
        { status: 429 },
      );
    }

    if (message.includes("OpenAI request failed")) {
      return NextResponse.json(
        { error: "Der KI-Dienst ist vorübergehend nicht erreichbar. Bitte versuchen Sie es später erneut." },
        { status: 502 },
      );
    }

    if (message.includes("valid JSON") || message.includes("expected summary structure")) {
      return NextResponse.json(
        { error: "Dieses Dokument konnte nicht zuverlässig verarbeitet werden. Bitte versuchen Sie es erneut." },
        { status: 502 },
      );
    }

    return NextResponse.json({ error: "Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut." }, { status: 500 });
  }
}
