import { NextResponse } from "next/server";

const OPENAI_TTS_URL = "https://api.openai.com/v1/audio/speech";
const OPENAI_TTS_MODEL = "gpt-4o-mini-tts-2025-12-15";
const OPENAI_TTS_VOICE = "alloy"; // Kann später zentral ausgetauscht werden, falls eine andere Stimme gewünscht ist.

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { spokenSummary?: unknown };
    const spokenSummary = typeof body.spokenSummary === "string" ? body.spokenSummary.trim() : "";

    if (!spokenSummary) {
      return NextResponse.json(
        { error: "Es ist keine kurze Zusammenfassung zum Vorlesen vorhanden." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Der Vorlese-Dienst ist noch nicht eingerichtet. Bitte OPENAI_API_KEY setzen." },
        { status: 500 },
      );
    }

    const response = await fetch(OPENAI_TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_TTS_MODEL,
        voice: OPENAI_TTS_VOICE,
        input: `Bitte lesen Sie den folgenden medizinischen Kurztext ruhig und klar auf Deutsch vor: ${spokenSummary}`,
        format: "mp3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI TTS request failed (${response.status}): ${errorText.slice(0, 220)}`);
    }

    const audioBuffer = await response.arrayBuffer();

    if (!audioBuffer.byteLength) {
      throw new Error("OpenAI returned empty audio content.");
    }

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";

    if (message.includes("OpenAI TTS request failed (429)")) {
      return NextResponse.json(
        { error: "Der Vorlese-Dienst ist gerade ausgelastet. Bitte versuchen Sie es in einem Moment erneut." },
        { status: 429 },
      );
    }

    if (message.includes("OpenAI TTS request failed")) {
      return NextResponse.json(
        { error: "Die Audio-Zusammenfassung konnte gerade nicht erstellt werden. Bitte versuchen Sie es erneut." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "Die Vorlesefunktion ist derzeit nicht verfügbar. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}
