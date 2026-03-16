const PDF_MAX_BYTES = 12 * 1024 * 1024;
const MIN_EXTRACTED_CHARACTERS = 120;
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const PDF_EXTRACTION_MODEL = "gpt-4.1-mini";

export class PdfExtractionError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "PdfExtractionError";
  }
}

function normalizePdfText(raw: string) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[\t\f]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

export function validatePdfUpload(file: File) {
  if (file.type && file.type !== "application/pdf") {
    throw new PdfExtractionError("Bitte wählen Sie eine PDF-Datei aus.");
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new PdfExtractionError("Bitte laden Sie eine Datei mit der Endung .pdf hoch.");
  }

  if (file.size <= 0) {
    throw new PdfExtractionError("Die hochgeladene Datei ist leer. Bitte wählen Sie eine andere PDF-Datei.");
  }

  if (file.size > PDF_MAX_BYTES) {
    throw new PdfExtractionError("Die PDF-Datei ist zu groß. Bitte laden Sie eine Datei bis maximal 12 MB hoch.");
  }
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text;
  }

  return null;
}

export async function extractTextFromPdf(file: File) {
  validatePdfUpload(file);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new PdfExtractionError("Der Dienst ist noch nicht eingerichtet. Bitte versuchen Sie es später erneut.", 500);
  }

  const buffer = await file.arrayBuffer();
  const fileData = `data:application/pdf;base64,${toBase64(buffer)}`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: PDF_EXTRACTION_MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Extrahiere den gesamten medizinisch relevanten Text aus dieser PDF-Datei. Gib nur den extrahierten Text in deutscher Sprache zurück, ohne Einleitung und ohne Zusammenfassung.",
            },
            {
              type: "input_file",
              filename: file.name,
              file_data: fileData,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new PdfExtractionError("Die PDF-Datei konnte gerade nicht gelesen werden. Bitte versuchen Sie es erneut.", response.status >= 500 ? 502 : 400);
  }

  const payload = (await response.json()) as unknown;
  const rawText = extractResponseText(payload);
  if (!rawText) {
    throw new PdfExtractionError("Die PDF-Datei konnte nicht zuverlässig ausgelesen werden.");
  }

  const normalizedText = normalizePdfText(rawText);

  if (normalizedText.length < MIN_EXTRACTED_CHARACTERS) {
    throw new PdfExtractionError(
      "In dieser PDF wurde kaum lesbarer Text gefunden. Möglicherweise ist es ein eingescanntes Dokument ohne Texterkennung.",
    );
  }

  return normalizedText;
}
