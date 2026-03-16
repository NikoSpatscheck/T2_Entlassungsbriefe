export async function requestAudioSummary(spokenSummary: string): Promise<Blob> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spokenSummary }),
  });

  if (!response.ok) {
    let message = "Die Audio-Wiedergabe ist aktuell nicht verfügbar. Bitte versuchen Sie es erneut.";

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Falls die Fehlermeldung nicht als JSON vorliegt, nutzen wir die Standardmeldung.
    }

    throw new Error(message);
  }

  const audioBlob = await response.blob();

  if (!audioBlob.size || !audioBlob.type.startsWith("audio/")) {
    throw new Error("Die Audiodatei konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.");
  }

  return audioBlob;
}
