import { NextResponse } from "next/server";
import { simplifyDischargeLetter } from "@/lib/openai";
import { validateInputText } from "@/lib/prompts/simplifyDischargeLetter";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: unknown };
    const maybeText = typeof body?.text === "string" ? body.text : "";
    const validation = validateInputText(maybeText);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const summary = await simplifyDischargeLetter(validation.text);
    return NextResponse.json({ data: summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";

    if (message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "The service is not configured yet. Please add OPENAI_API_KEY to .env.local." },
        { status: 500 },
      );
    }

    if (message.includes("OpenAI request failed (429)")) {
      return NextResponse.json(
        { error: "Too many requests right now. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    if (message.includes("OpenAI request failed")) {
      return NextResponse.json(
        { error: "The AI service is temporarily unavailable. Please try again shortly." },
        { status: 502 },
      );
    }

    if (message.includes("valid JSON") || message.includes("expected summary structure")) {
      return NextResponse.json(
        { error: "We could not process this document safely. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ error: "Unexpected server error. Please try again." }, { status: 500 });
  }
}
