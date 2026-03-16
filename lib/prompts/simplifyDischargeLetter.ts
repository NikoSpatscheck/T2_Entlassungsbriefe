import { INPUT_LIMITS, MISSING_INFO_TEXT, SPOKEN_SUMMARY_FALLBACK } from "@/lib/schemas/simplifiedDischargeSummary";

export const SIMPLIFY_SYSTEM_PROMPT = `You are a careful medical document simplification assistant for German-speaking patients without any medical knowledge (really easy for an 5 year old).
Your task is to explain hospital discharge letters in calm, plain, respectful German.
Rules:
- Preserve meaning from the source text and do not invent facts.
- The entire JSON content must be in natural, patient-friendly German.
- Clearly distinguish uncertain or missing information using this exact phrase: "${MISSING_INFO_TEXT}".
- Do not provide new diagnoses or recommendations beyond what the document says.
- Keep medication instructions cautious and grounded in the document.
- Keep warning signs practical, clear, and non-alarming.
- Use short, understandable sentences and avoid bureaucratic phrasing.
- Return valid JSON only, matching the required schema exactly.
- Never include markdown or prose outside the JSON object.
- spokenSummary is shown in the UI and read aloud. Keep it at most 2 short sentences.
- spokenSummary must summarize: 1) main diagnosis/problem, 2) practical next implication.
- If diagnosis is unclear, return this exact fallback for spokenSummary: "${SPOKEN_SUMMARY_FALLBACK}".`;

export function buildSimplifyUserPrompt(dischargeLetterText: string) {
  return `Vereinfachen Sie den folgenden Entlassungsbrief.
Geben Sie ausschließlich valides JSON im geforderten Schema zurück.

Erwartete Felder:
summaryTitle (string),
simpleSummary (string),
reasonForHospitalVisit (string),
keyFindings (string[]),
treatmentsReceived (string[]),
medications ({name, purpose, instructions}[]),
nextSteps (string[]),
warningSigns (string[]),
followUp (string[]),
questionsForDoctor (string[]),
glossary ({medicalTerm, plainExplanation}[]),
importantDisclaimer (string),
spokenSummary (string, maximal 2 kurze Sätze, gut vorlesbar).

Jedes Feld muss vorhanden sein.
Verwenden Sie leere Arrays, wenn nichts genannt ist.
Für unbekannte Fakten verwenden Sie exakt: "${MISSING_INFO_TEXT}".
spokenSummary muss kurz, ruhig und für das Vorlesen geeignet sein.

Text des Entlassungsbriefs:
"""
${dischargeLetterText}
"""
`;
}

export function validateInputText(input: string) {
  const text = input.trim();

  if (!text) {
    return { valid: false as const, message: "Bitte fügen Sie zuerst den Text Ihres Entlassungsbriefs ein." };
  }

  if (text.length < INPUT_LIMITS.minLength) {
    return {
      valid: false as const,
      message: `Bitte fügen Sie einen längeren Text ein (mindestens ${INPUT_LIMITS.minLength} Zeichen).`,
    };
  }

  if (text.length > INPUT_LIMITS.maxLength) {
    return {
      valid: false as const,
      message: `Der Text ist zu lang. Bitte bleiben Sie unter ${INPUT_LIMITS.maxLength.toLocaleString()} Zeichen.`,
    };
  }

  return { valid: true as const, text };
}
