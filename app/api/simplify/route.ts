import { NextResponse } from "next/server";
import { simplifyAndPersistDocument } from "@/lib/services/document-simplification";
import { parseSimplificationSettings } from "@/lib/simplification/settings";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: unknown; settings?: unknown };
    const maybeText = typeof body?.text === "string" ? body.text : "";
    const parsedSettings = parseSimplificationSettings(body?.settings);

    if (!parsedSettings.ok) {
      return NextResponse.json({ error: parsedSettings.message }, { status: 400 });
    }

    const result = await simplifyAndPersistDocument({
      rawText: maybeText,
      sourceType: "freitext",
      titleFallback: "Freitext-Dokument",
      settings: parsedSettings.settings,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ data: result.data, savedDocumentId: result.savedDocumentId });
  } catch (error) {
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
export const runtime = "nodejs";
