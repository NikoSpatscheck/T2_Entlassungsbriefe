export type SimplifiedMedication = {
  name: string;
  purpose: string;
  instructions: string;
};

export type SimplifiedGlossaryEntry = {
  medicalTerm: string;
  plainExplanation: string;
};

export type SimplifiedDischargeSummary = {
  summaryTitle: string;
  simpleSummary: string;
  reasonForHospitalVisit: string;
  keyFindings: string[];
  treatmentsReceived: string[];
  medications: SimplifiedMedication[];
  nextSteps: string[];
  warningSigns: string[];
  followUp: string[];
  questionsForDoctor: string[];
  glossary: SimplifiedGlossaryEntry[];
  importantDisclaimer: string;
};

export const SIMPLIFIED_SUMMARY_JSON_SCHEMA = {
  name: "simplified_discharge_summary",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "summaryTitle",
      "simpleSummary",
      "reasonForHospitalVisit",
      "keyFindings",
      "treatmentsReceived",
      "medications",
      "nextSteps",
      "warningSigns",
      "followUp",
      "questionsForDoctor",
      "glossary",
      "importantDisclaimer",
    ],
    properties: {
      summaryTitle: { type: "string" },
      simpleSummary: { type: "string" },
      reasonForHospitalVisit: { type: "string" },
      keyFindings: { type: "array", items: { type: "string" } },
      treatmentsReceived: { type: "array", items: { type: "string" } },
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
      nextSteps: { type: "array", items: { type: "string" } },
      warningSigns: { type: "array", items: { type: "string" } },
      followUp: { type: "array", items: { type: "string" } },
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

const FALLBACK_TEXT = "Not clearly stated in the document";

function asString(value: unknown, fallback = FALLBACK_TEXT) {
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
    summaryTitle: asString(record.summaryTitle, "Simplified Discharge Letter Summary"),
    simpleSummary: asString(record.simpleSummary),
    reasonForHospitalVisit: asString(record.reasonForHospitalVisit),
    keyFindings: asStringArray(record.keyFindings),
    treatmentsReceived: asStringArray(record.treatmentsReceived),
    medications,
    nextSteps: asStringArray(record.nextSteps),
    warningSigns: asStringArray(record.warningSigns),
    followUp: asStringArray(record.followUp),
    questionsForDoctor: asStringArray(record.questionsForDoctor),
    glossary,
    importantDisclaimer: asString(
      record.importantDisclaimer,
      "This summary supports understanding and does not replace professional medical advice.",
    ),
  };
}

export const INPUT_LIMITS = {
  minLength: 80,
  maxLength: 20_000,
};
