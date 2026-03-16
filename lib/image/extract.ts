const IMAGE_MAX_BYTES = 12 * 1024 * 1024;
const MIN_EXTRACTED_CHARACTERS = 80;
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const IMAGE_EXTRACTION_MODEL = "gpt-5-mini-2025-08-07";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

export class ImageExtractionError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "ImageExtractionError";
  }
}

function normalizeExtractedText(raw: string) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[\t\f\v]+/g, " ")
    .replace(/\n[ ]+/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

export function validateImageUpload(file: File) {
  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_EXTENSIONS.some((extension) => lowerName.endsWith(extension));

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    throw new ImageExtractionError("Bitte wählen Sie ein Bild im Format JPG, PNG, WEBP oder HEIC aus.");
  }

  if (!hasAllowedExtension) {
    throw new ImageExtractionError("Bitte laden Sie ein Bild mit den Endungen .jpg, .jpeg, .png, .webp oder .heic hoch.");
  }

  if (file.size <= 0) {
    throw new ImageExtractionError("Die hochgeladene Bilddatei ist leer. Bitte wählen Sie ein anderes Bild.");
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new ImageExtractionError("Das Bild ist zu groß. Bitte laden Sie eine Datei bis maximal 12 MB hoch.");
  }
}

function readPartText(part: unknown): string | null {
  if (!part || typeof part !== "object") return null;
  const record = part as Record<string, unknown>;

  if (typeof record.text === "string" && record.text.trim()) {
    return record.text;
  }

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text;
  }

  const inputText = record.input_text;
  if (typeof inputText === "string" && inputText.trim()) {
    return inputText;
  }

  return null;
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text;
  }

  const output = record.output;
  if (!Array.isArray(output)) return null;

  const chunks: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const itemRecord = item as Record<string, unknown>;

    const directText = readPartText(itemRecord);
    if (directText) chunks.push(directText);

    const content = itemRecord.content;
    if (!Array.isArray(content)) continue;

    for (const part of content) {
      const text = readPartText(part);
      if (text) chunks.push(text);
    }
  }

  if (!chunks.length) {
    return null;
  }

  return chunks.join("\n").trim();
}

async function callOpenAiImageExtraction(file: File, buffer: ArrayBuffer, apiKey: string) {
  const mimeType = file.type || "image/jpeg";
  const imageData = `data:${mimeType};base64,${toBase64(buffer)}`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: IMAGE_EXTRACTION_MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Extrahiere den gesamten gut lesbaren Text aus diesem Foto eines medizinischen Dokuments. Gib ausschließlich den extrahierten Text in Originalreihenfolge zurück.",
            },
            {
              type: "input_image",
              image_url: imageData,
              detail: "high",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new ImageExtractionError("Das Bild konnte gerade nicht gelesen werden. Bitte versuchen Sie es erneut.", response.status >= 500 ? 502 : 400);
  }

  return (await response.json()) as unknown;
}

export async function extractTextFromImage(file: File) {
  validateImageUpload(file);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new ImageExtractionError("Der Dienst ist noch nicht eingerichtet. Bitte versuchen Sie es später erneut.", 500);
  }

  const buffer = await file.arrayBuffer();
  const payload = await callOpenAiImageExtraction(file, buffer, apiKey);

  const rawText = extractResponseText(payload);
  if (!rawText) {
    throw new ImageExtractionError("Das Bild konnte nicht zuverlässig ausgelesen werden. Bitte versuchen Sie ein schärferes Foto.");
  }

  const normalizedText = normalizeExtractedText(rawText);

  if (normalizedText.length < MIN_EXTRACTED_CHARACTERS) {
    throw new ImageExtractionError(
      "In diesem Bild wurde kaum lesbarer Text erkannt. Bitte fotografieren Sie das Dokument bei besserem Licht und ohne Schatten.",
    );
  }

  return normalizedText;
}
