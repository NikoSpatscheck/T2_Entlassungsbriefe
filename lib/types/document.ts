import { SimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";
import { SimplificationSettings } from "@/lib/simplification/settings";

export type DocumentType = "freitext" | "kamera" | "pdf";
export type DocumentStatus = "verarbeitet" | "wartet" | "fehler";

export type StoredDocument = {
  id: string;
  userId: string;
  type: DocumentType;
  title: string;
  originalInput: string | null;
  sourceFileName: string | null;
  simplificationSettings: SimplificationSettings;
  status: DocumentStatus;
  summaryText: string | null;
  result: SimplifiedDischargeSummary | null;
  createdAt: string;
  updatedAt: string;
};
