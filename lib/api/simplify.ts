import { SimplifiedDischargeSummary, validateSimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";

export async function requestSimplifiedSummary(text: string): Promise<SimplifiedDischargeSummary> {
  const response = await fetch("/api/simplify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const payload = (await response.json()) as { data?: unknown; error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Das Dokument konnte gerade nicht vereinfacht werden.");
  }

  const validated = validateSimplifiedDischargeSummary(payload.data);
  if (!validated) {
    throw new Error("Die Antwort vom Server war unvollständig. Bitte versuchen Sie es erneut.");
  }

  return validated;
}
