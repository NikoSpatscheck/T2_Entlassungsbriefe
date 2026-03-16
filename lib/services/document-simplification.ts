import { getSessionUser } from "@/lib/auth/session";
import { createDocument } from "@/lib/db/store";
import { simplifyDischargeLetter } from "@/lib/openai";
import { validateInputText } from "@/lib/prompts/simplifyDischargeLetter";
import { DocumentType } from "@/lib/types/document";
import { SimplificationSettings } from "@/lib/simplification/settings";

export type SimplifyDocumentInput = {
  rawText: string;
  sourceType: DocumentType;
  titleFallback: string;
  fileName?: string;
  settings: SimplificationSettings;
};

export async function simplifyAndPersistDocument(input: SimplifyDocumentInput) {
  const validation = validateInputText(input.rawText);

  if (!validation.valid) {
    return {
      ok: false as const,
      error: validation.message,
      status: 400,
    };
  }

  const summary = await simplifyDischargeLetter(validation.text, input.settings);
  const user = await getSessionUser();
  const generatedTitle = summary.spokenSummary.split(/[.!?]\s/)[0]?.trim();

  let savedDocumentId: string | null = null;
  if (user) {
    const saved = await createDocument({
      userId: user.id,
      type: input.sourceType,
      title: generatedTitle || input.titleFallback,
      originalInput: validation.text,
      status: "verarbeitet",
      summaryText: summary.spokenSummary,
      result: summary,
      sourceFileName: input.fileName ?? null,
      simplificationSettings: input.settings,
    });
    savedDocumentId = saved.id;
  }

  return {
    ok: true as const,
    data: summary,
    savedDocumentId,
  };
}
