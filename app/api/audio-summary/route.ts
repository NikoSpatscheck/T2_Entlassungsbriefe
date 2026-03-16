import { NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_AUDIO_MODEL = "gpt-realtime-mini-2025-12-15";

function extractAudioData(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  const output = record.output;
  if (!Array.isArray(output)) return null;

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const audio = (part as { audio?: unknown }).audio;
      if (!audio || typeof audio !== "object") continue;
      const audioRecord = audio as Record<string, unknown>;
      const data = audioRecord.data;
      const format = audioRecord.format;

      if (typeof data === "string" && data.length > 0 && typeof format === "string") {
        return { audioBase64: data, format };
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { audioSummaryText?: unknown };
    const audioSummaryText = typeof body.audioSummaryText === "string" ? body.audioSummaryText.trim() : "";

    if (!audioSummaryText) {
      return NextResponse.json({ error: "No audio summary is available yet. Please simplify a document first." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The service is not configured yet. Please add OPENAI_API_KEY to .env.local." },
        { status: 500 },
      );
    }

    // Uses the realtime model in non-streaming response mode to keep API keys server-side.
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_AUDIO_MODEL,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Please read this short healthcare summary aloud in a calm, respectful tone. Text: ${audioSummaryText}`,
              },
            ],
          },
        ],
        modalities: ["audio"],
        audio: {
          voice: "alloy",
          format: "mp3",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI audio request failed (${response.status}): ${errorText.slice(0, 220)}`);
    }

    const payload = (await response.json()) as unknown;
    const audioData = extractAudioData(payload);

    if (!audioData) {
      throw new Error("OpenAI did not return playable audio output.");
    }

    return NextResponse.json({
      audioBase64: audioData.audioBase64,
      mimeType: audioData.format === "wav" ? "audio/wav" : "audio/mpeg",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";

    if (message.includes("OpenAI audio request failed (429)")) {
      return NextResponse.json(
        { error: "Audio is busy right now. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    if (message.includes("OpenAI audio request failed")) {
      return NextResponse.json(
        { error: "We could not prepare the read-aloud audio right now. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "Audio playback is currently unavailable. Please try again." },
      { status: 500 },
    );
  }
}
