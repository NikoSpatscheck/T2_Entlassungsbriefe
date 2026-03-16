import { buildSimplifyUserPrompt, SIMPLIFY_SYSTEM_PROMPT } from "@/lib/prompts/simplifyDischargeLetter";
import {
  SIMPLIFIED_SUMMARY_JSON_SCHEMA,
  SimplifiedDischargeSummary,
  validateSimplifiedDischargeSummary,
} from "@/lib/schemas/simplifiedDischargeSummary";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-5-mini-2025-08-07";

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text;
  }

  const output = record.output;
  if (!Array.isArray(output)) return null;

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const text = (part as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) return text;
    }
  }

  return null;
}

export async function simplifyDischargeLetter(dischargeLetterText: string): Promise<SimplifiedDischargeSummary> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Server is missing OPENAI_API_KEY configuration.");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: SIMPLIFY_SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildSimplifyUserPrompt(dischargeLetterText) }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: SIMPLIFIED_SUMMARY_JSON_SCHEMA.name,
          strict: SIMPLIFIED_SUMMARY_JSON_SCHEMA.strict,
          schema: SIMPLIFIED_SUMMARY_JSON_SCHEMA.schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText.slice(0, 220)}`);
  }

  const payload = (await response.json()) as unknown;
  const rawText = extractResponseText(payload);

  if (!rawText) {
    throw new Error("OpenAI did not return text output.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("Model output was not valid JSON.");
  }

  const validated = validateSimplifiedDischargeSummary(parsed);
  if (!validated) {
    throw new Error("Model output did not match expected summary structure.");
  }

  return validated;
}
