import { DocumentType } from "@/lib/types/document";

export function formatDocumentType(type: DocumentType) {
  if (type === "freitext") return "Freitext";
  if (type === "kamera") return "Kamera";
  return "PDF";
}

export function formatGermanDate(isoDate: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
