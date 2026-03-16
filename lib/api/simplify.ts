import { SimplifiedDischargeSummary, validateSimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";
import { SimplificationSettings } from "@/lib/simplification/settings";

function ensureValidResponse(data: unknown) {
  const validated = validateSimplifiedDischargeSummary(data);
  if (!validated) {
    throw new Error("Die Antwort vom Server war unvollständig. Bitte versuchen Sie es erneut.");
  }

  return validated;
}

export async function requestSimplifiedSummary(text: string, settings: SimplificationSettings): Promise<SimplifiedDischargeSummary> {
  const response = await fetch("/api/simplify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, settings }),
  });

  const payload = (await response.json()) as { data?: unknown; error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Das Dokument konnte gerade nicht vereinfacht werden.");
  }

  return ensureValidResponse(payload.data);
}

export async function requestSimplifiedPdfSummary(file: File, settings: SimplificationSettings): Promise<SimplifiedDischargeSummary> {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("settings", JSON.stringify(settings));

  const response = await fetch("/api/simplify/pdf", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as { data?: unknown; error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Die PDF-Datei konnte gerade nicht vereinfacht werden.");
  }

  return ensureValidResponse(payload.data);
}
