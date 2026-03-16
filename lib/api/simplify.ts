import { SimplifiedDischargeSummary, validateSimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";

export async function requestSimplifiedSummary(text: string): Promise<SimplifiedDischargeSummary> {
  const response = await fetch("/api/simplify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const payload = (await response.json()) as { data?: unknown; error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to simplify the document right now.");
  }

  const validated = validateSimplifiedDischargeSummary(payload.data);
  if (!validated) {
    throw new Error("Received an invalid response format from the server.");
  }

  return validated;
}
