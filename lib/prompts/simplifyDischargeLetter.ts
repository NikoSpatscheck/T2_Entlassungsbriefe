import { AUDIO_SUMMARY_FALLBACK, INPUT_LIMITS } from "@/lib/schemas/simplifiedDischargeSummary";

export const SIMPLIFY_SYSTEM_PROMPT = `You are a careful medical document simplification assistant.
Your task is to explain hospital discharge letters in calm, plain, respectful language for older adults and people with low health literacy.
Rules:
- Preserve meaning from the source text and do not invent facts.
- Clearly distinguish uncertain or missing information using phrases like "Not clearly stated in the document".
- Do not provide new diagnoses or recommendations beyond what the document says.
- Keep medication instructions cautious and grounded in the document.
- Keep warning signs practical, clear, and non-alarming.
- Return valid JSON only, matching the required schema exactly.
- Never include markdown or prose outside the JSON object.
- audioSummaryText is only for text-to-speech readout and must not include formatting or lists.
- audioSummaryText must be at most 2 sentences, grounded in the document, and summarize:
  1) the main diagnosis/problem,
  2) a short practical implication for the patient.
- If the diagnosis is unclear, return this exact fallback for audioSummaryText: "${AUDIO_SUMMARY_FALLBACK}".`;

export function buildSimplifyUserPrompt(dischargeLetterText: string) {
  return `Simplify the following hospital discharge letter.
Return strict JSON only.

Expected schema fields:
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
audioSummaryText (string, maximum 2 sentences, plain language).

Every field must be present.
Use empty arrays if nothing is stated.
For unknown facts use "Not clearly stated in the document".
audioSummaryText must be very short and intended for speech playback for older adults.

Discharge letter text:
"""
${dischargeLetterText}
"""
`;
}

export function validateInputText(input: string) {
  const text = input.trim();

  if (!text) {
    return { valid: false as const, message: "Please paste your discharge letter text first." };
  }

  if (text.length < INPUT_LIMITS.minLength) {
    return {
      valid: false as const,
      message: `Please paste a longer discharge letter (at least ${INPUT_LIMITS.minLength} characters).`,
    };
  }

  if (text.length > INPUT_LIMITS.maxLength) {
    return {
      valid: false as const,
      message: `The document is too long. Please keep it below ${INPUT_LIMITS.maxLength.toLocaleString()} characters.`,
    };
  }

  return { valid: true as const, text };
}
