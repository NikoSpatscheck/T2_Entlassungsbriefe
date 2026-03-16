export type SimplifiedMedication = {
  name: string;
  purpose: string;
  instructions: string;
};

export type SimplifiedNextStep = {
  description: string;
  purpose: string;
};

export type SimplifiedGlossaryEntry = {
  medicalTerm: string;
  plainExplanation: string;
};

export type SimplifiedDischargeSummary = {
  spokenSummary: string;
  nextStepsAndFollowUp: SimplifiedNextStep[];
  secondaryDiagnoses: string[];
  medications: SimplifiedMedication[];
  whatToLookOutFor: string[];
  anythingToTakeCareOf: string[];
  questionsForDoctor: string[];
  glossary: SimplifiedGlossaryEntry[];
  importantDisclaimer: string;
};

export const SPOKEN_SUMMARY_FALLBACK =
  "Die Hauptdiagnose ist im Dokument nicht eindeutig erkennbar. Bitte besprechen Sie die Details mit Ihrer Ärztin oder Ihrem Arzt.";

export const MISSING_INFO_TEXT = "Im Dokument nicht klar angegeben.";

export const SIMPLIFIED_SUMMARY_JSON_SCHEMA = {
  name: "simplified_discharge_summary",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "spokenSummary",
      "nextStepsAndFollowUp",
      "secondaryDiagnoses",
      "medications",
      "whatToLookOutFor",
      "anythingToTakeCareOf",
      "questionsForDoctor",
      "glossary",
      "importantDisclaimer",
    ],
    properties: {
      spokenSummary: { type: "string" },
      nextStepsAndFollowUp: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["description", "purpose"],
          properties: {
            description: { type: "string" },
            purpose: { type: "string" },
          },
        },
      },
      secondaryDiagnoses: { type: "array", items: { type: "string" } },
      medications: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "purpose", "instructions"],
          properties: {
            name: { type: "string" },
            purpose: { type: "string" },
            instructions: { type: "string" },
          },
        },
      },
      whatToLookOutFor: { type: "array", items: { type: "string" } },
      anythingToTakeCareOf: { type: "array", items: { type: "string" } },
      questionsForDoctor: { type: "array", items: { type: "string" } },
      glossary: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["medicalTerm", "plainExplanation"],
          properties: {
            medicalTerm: { type: "string" },
            plainExplanation: { type: "string" },
          },
        },
      },
      importantDisclaimer: { type: "string" },
    },
  },
} as const;

function asString(value: unknown, fallback = MISSING_INFO_TEXT) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

export function validateSimplifiedDischargeSummary(payload: unknown): SimplifiedDischargeSummary | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;

  const nextStepsAndFollowUp = Array.isArray(record.nextStepsAndFollowUp)
    ? record.nextStepsAndFollowUp
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const data = entry as Record<string, unknown>;
          return {
            description: asString(data.description),
            purpose: asString(data.purpose),
          };
        })
        .filter((entry): entry is SimplifiedNextStep => entry !== null)
    : [];

  const medications = Array.isArray(record.medications)
    ? record.medications
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const data = entry as Record<string, unknown>;
          return {
            name: asString(data.name),
            purpose: asString(data.purpose),
            instructions: asString(data.instructions),
          };
        })
        .filter((entry): entry is SimplifiedMedication => entry !== null)
    : [];

  const glossary = Array.isArray(record.glossary)
    ? record.glossary
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const data = entry as Record<string, unknown>;
          return {
            medicalTerm: asString(data.medicalTerm),
            plainExplanation: asString(data.plainExplanation),
          };
        })
        .filter((entry): entry is SimplifiedGlossaryEntry => entry !== null)
    : [];

  return {
    spokenSummary: asString(record.spokenSummary, SPOKEN_SUMMARY_FALLBACK),
    nextStepsAndFollowUp,
    secondaryDiagnoses: asStringArray(record.secondaryDiagnoses),
    medications,
    whatToLookOutFor: asStringArray(record.whatToLookOutFor),
    anythingToTakeCareOf: asStringArray(record.anythingToTakeCareOf),
    questionsForDoctor: asStringArray(record.questionsForDoctor),
    glossary,
    importantDisclaimer: asString(
      record.importantDisclaimer,
      "Diese Zusammenfassung hilft beim Verstehen und ersetzt keine ärztliche Beratung.",
    ),
  };
}

export const INPUT_LIMITS = {
  minLength: 80,
  maxLength: 20_000,
};
