export const TARGET_LANGUAGE_VALUES = ["de", "en", "zh", "tr", "es"] as const;
export const MEDICAL_KNOWLEDGE_VALUES = ["very_low", "low", "average"] as const;
export const LANGUAGE_STYLE_VALUES = ["very_simple", "simple", "everyday"] as const;

export type TargetLanguage = (typeof TARGET_LANGUAGE_VALUES)[number];
export type MedicalKnowledgeLevel = (typeof MEDICAL_KNOWLEDGE_VALUES)[number];
export type LanguageStyle = (typeof LANGUAGE_STYLE_VALUES)[number];

export type SimplificationSettings = {
  targetLanguage: TargetLanguage;
  medicalKnowledgeLevel: MedicalKnowledgeLevel;
  languageStyle: LanguageStyle;
};

export const DEFAULT_SIMPLIFICATION_SETTINGS: SimplificationSettings = {
  targetLanguage: "de",
  medicalKnowledgeLevel: "low",
  languageStyle: "simple",
};

export const TARGET_LANGUAGE_INPUT_OPTIONS: Array<{ value: TargetLanguage; label: string }> = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "Englisch" },
  { value: "zh", label: "Chinesisch" },
  { value: "tr", label: "Türkisch" },
  { value: "es", label: "Spanisch" },
];

export const MEDICAL_KNOWLEDGE_INPUT_OPTIONS: Array<{ value: MedicalKnowledgeLevel; label: string }> = [
  { value: "very_low", label: "Sehr wenig" },
  { value: "low", label: "Wenig" },
  { value: "average", label: "Durchschnittlich" },
];

export const LANGUAGE_STYLE_INPUT_OPTIONS: Array<{ value: LanguageStyle; label: string }> = [
  { value: "very_simple", label: "Sehr einfache Sprache" },
  { value: "simple", label: "Einfache Sprache" },
  { value: "everyday", label: "Alltägliche Sprache" },
];

export function isTargetLanguage(value: unknown): value is TargetLanguage {
  return typeof value === "string" && TARGET_LANGUAGE_VALUES.includes(value as TargetLanguage);
}

export function isMedicalKnowledgeLevel(value: unknown): value is MedicalKnowledgeLevel {
  return typeof value === "string" && MEDICAL_KNOWLEDGE_VALUES.includes(value as MedicalKnowledgeLevel);
}

export function isLanguageStyle(value: unknown): value is LanguageStyle {
  return typeof value === "string" && LANGUAGE_STYLE_VALUES.includes(value as LanguageStyle);
}

export function sanitizeSimplificationSettings(payload: unknown): SimplificationSettings {
  if (!payload || typeof payload !== "object") {
    return DEFAULT_SIMPLIFICATION_SETTINGS;
  }

  const record = payload as Record<string, unknown>;

  return {
    targetLanguage: isTargetLanguage(record.targetLanguage)
      ? record.targetLanguage
      : DEFAULT_SIMPLIFICATION_SETTINGS.targetLanguage,
    medicalKnowledgeLevel: isMedicalKnowledgeLevel(record.medicalKnowledgeLevel)
      ? record.medicalKnowledgeLevel
      : DEFAULT_SIMPLIFICATION_SETTINGS.medicalKnowledgeLevel,
    languageStyle: isLanguageStyle(record.languageStyle)
      ? record.languageStyle
      : DEFAULT_SIMPLIFICATION_SETTINGS.languageStyle,
  };
}

export function parseSimplificationSettings(payload: unknown):
  | { ok: true; settings: SimplificationSettings }
  | { ok: false; message: string } {
  if (!payload || typeof payload !== "object") {
    return { ok: true, settings: DEFAULT_SIMPLIFICATION_SETTINGS };
  }

  const record = payload as Record<string, unknown>;

  if (record.targetLanguage !== undefined && !isTargetLanguage(record.targetLanguage)) {
    return { ok: false, message: "Die ausgewählte Sprache ist ungültig." };
  }

  if (record.medicalKnowledgeLevel !== undefined && !isMedicalKnowledgeLevel(record.medicalKnowledgeLevel)) {
    return { ok: false, message: "Das ausgewählte medizinische Vorwissen ist ungültig." };
  }

  if (record.languageStyle !== undefined && !isLanguageStyle(record.languageStyle)) {
    return { ok: false, message: "Das ausgewählte Sprachniveau ist ungültig." };
  }

  return {
    ok: true,
    settings: sanitizeSimplificationSettings(payload),
  };
}

const LANGUAGE_NAME_MAP: Record<TargetLanguage, string> = {
  de: "German",
  en: "English",
  zh: "Chinese",
  tr: "Turkish",
  es: "Spanish",
};

const MEDICAL_KNOWLEDGE_PROMPT_MAP: Record<MedicalKnowledgeLevel, string> = {
  very_low:
    "Assume very little medical background knowledge. Define basic concepts carefully and avoid jargon unless explained immediately.",
  low:
    "Assume little medical background knowledge. Use plain explanations and support terms with short clarifications.",
  average:
    "Assume average general health knowledge. Stay clear and plain, but you can be a little less basic.",
};

const LANGUAGE_STYLE_PROMPT_MAP: Record<LanguageStyle, string> = {
  very_simple:
    "Use very simple language with short sentences, very easy vocabulary, and maximum clarity.",
  simple: "Use clear and accessible language with a balanced level of simplicity and natural phrasing.",
  everyday:
    "Use calm everyday language that is understandable and natural, slightly conversational but still precise.",
};

export function toPromptInstruction(settings: SimplificationSettings) {
  return {
    targetLanguageName: LANGUAGE_NAME_MAP[settings.targetLanguage],
    medicalKnowledgeInstruction: MEDICAL_KNOWLEDGE_PROMPT_MAP[settings.medicalKnowledgeLevel],
    languageStyleInstruction: LANGUAGE_STYLE_PROMPT_MAP[settings.languageStyle],
  };
}
