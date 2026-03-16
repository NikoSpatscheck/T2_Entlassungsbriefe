import { SimplifiedDischargeSummary, validateSimplifiedDischargeSummary } from "@/lib/schemas/simplifiedDischargeSummary";
import { sanitizeSimplificationSettings, SimplificationSettings } from "@/lib/simplification/settings";

const STORAGE_KEY = "simplified-discharge-result-v1";

type StoredPayload = {
  createdAt: number;
  result: SimplifiedDischargeSummary;
  settings: SimplificationSettings;
};

export type LoadedSimplifiedResult = {
  result: SimplifiedDischargeSummary;
  settings: SimplificationSettings;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function saveSimplifiedResult(result: SimplifiedDischargeSummary, settings: SimplificationSettings) {
  if (!canUseStorage()) return;

  const payload: StoredPayload = {
    createdAt: Date.now(),
    result,
    settings,
  };

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadSimplifiedResult(maxAgeMs = 30 * 60 * 1000): LoadedSimplifiedResult | null {
  if (!canUseStorage()) return null;

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredPayload>;
    const createdAt = typeof parsed.createdAt === "number" ? parsed.createdAt : 0;

    if (!createdAt || Date.now() - createdAt > maxAgeMs) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const validated = validateSimplifiedDischargeSummary(parsed.result);
    if (!validated) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      result: validated,
      settings: sanitizeSimplificationSettings(parsed.settings),
    };
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSimplifiedResult() {
  if (!canUseStorage()) return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
