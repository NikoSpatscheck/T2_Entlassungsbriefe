"use client";

import {
  LANGUAGE_STYLE_INPUT_OPTIONS,
  MEDICAL_KNOWLEDGE_INPUT_OPTIONS,
  SimplificationSettings,
  TARGET_LANGUAGE_INPUT_OPTIONS,
} from "@/lib/simplification/settings";

type OptionSelectorProps<T extends string> = {
  title: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

function OptionSelector<T extends string>({ title, options, value, onChange }: OptionSelectorProps<T>) {
  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold text-purple-950">{title}</p>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={title}>
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`min-h-12 rounded-2xl border-2 px-5 py-2 text-base font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-900 ${
                selected
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-purple-300 bg-white text-purple-900 hover:bg-purple-100"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SimplificationSettingsSelector({
  settings,
  onChange,
}: {
  settings: SimplificationSettings;
  onChange: (next: SimplificationSettings) => void;
}) {
  return (
    <section className="space-y-6 rounded-2xl border border-purple-200 bg-purple-50/50 p-5 sm:p-6" aria-label="Vereinfachungsoptionen">
      <OptionSelector
        title="Medizinisches Vorwissen"
        options={MEDICAL_KNOWLEDGE_INPUT_OPTIONS}
        value={settings.medicalKnowledgeLevel}
        onChange={(medicalKnowledgeLevel) => onChange({ ...settings, medicalKnowledgeLevel })}
      />

      <OptionSelector
        title="Sprache"
        options={TARGET_LANGUAGE_INPUT_OPTIONS}
        value={settings.targetLanguage}
        onChange={(targetLanguage) => onChange({ ...settings, targetLanguage })}
      />

      <OptionSelector
        title="Sprachniveau"
        options={LANGUAGE_STYLE_INPUT_OPTIONS}
        value={settings.languageStyle}
        onChange={(languageStyle) => onChange({ ...settings, languageStyle })}
      />
    </section>
  );
}
