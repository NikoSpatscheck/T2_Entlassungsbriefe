import { INPUT_LIMITS, MISSING_INFO_TEXT, SPOKEN_SUMMARY_FALLBACK } from "@/lib/schemas/simplifiedDischargeSummary";
import { SimplificationSettings, toPromptInstruction } from "@/lib/simplification/settings";

export const SIMPLIFY_SYSTEM_PROMPT = `You are a careful medical document simplification assistant for German-speaking patients without any medical knowledge.
Your task is to explain hospital discharge letters in calm, plain, simple and respectful language.
Rules:
- Preserve meaning from the source text. It is essential that you do not invent facts.
- The entire JSON content must follow the output language explicitly requested in the user prompt.
- Clearly distinguish uncertain or missing information using this exact phrase: "${MISSING_INFO_TEXT}".
- Do not provide new diagnoses or new recommendations beyond what the document says.
- Keep medication instructions cautious and grounded in the document.
- One section should explain what to look out for. Keep this section practical, clear, and non-alarming.
- Use short, understandable sentences and avoid bureaucratic phrasing.
- Return valid JSON only, matching the required schema exactly.
- Never include markdown or prose outside the JSON object.
- spokenSummary is shown in the UI and read aloud. Keep it concise, natural for text-to-speech, and at most 5 short sentences.
- spokenSummary must summarize the most relevant diagnosis/problem, key findings if available, and the most important practical next steps or warnings.
- spokenSummary must adapt to the requested output language, medical prior knowledge level, and language style/complexity.
- If diagnosis is unclear, return this exact fallback for spokenSummary: "${SPOKEN_SUMMARY_FALLBACK}".`;

export function buildSimplifyUserPrompt(dischargeLetterText: string, settings: SimplificationSettings) {
  const instructions = toPromptInstruction(settings);

  return `Vereinfachen Sie den folgenden Entlassungsbrief.
Geben Sie ausschließlich valides JSON im geforderten Schema zurück.

Personalisierung:
- Output language for every field: ${instructions.targetLanguageName}.
- Medical prior knowledge adaptation: ${instructions.medicalKnowledgeInstruction}
- Language style adaptation: ${instructions.languageStyleInstruction}

Erwartete Felder:
spokenSummary (string, 1 bis maximal 5 kurze Sätze, gut vorlesbar),
nextStepsAndFollowUp ({description, purpose}[]),
secondaryDiagnoses (string[]),
medications ({name, purpose, instructions}[]),
whatToLookOutFor (string[]),
anythingToTakeCareOf (string[]),
questionsForDoctor (string[]),
glossary ({medicalTerm, plainExplanation}[]),
importantDisclaimer (string).

Jedes Feld muss vorhanden sein.
Verwenden Sie leere Arrays, wenn nichts genannt ist.
Für unbekannte Fakten verwenden Sie exakt: "${MISSING_INFO_TEXT}".
spokenSummary muss ruhig, vollständig, natürlich vorlesbar und im gewählten Stil formuliert sein.
spokenSummary soll die wichtigsten Inhalte des Entlassungsbriefs zusammenfassen, ohne Fakten zu erfinden.
Alle Felder müssen vollständig in ${instructions.targetLanguageName} geschrieben sein.

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
