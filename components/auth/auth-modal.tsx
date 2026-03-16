"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";

type Mode = "login" | "register";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setAuthenticatedUser } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = (await response.json()) as { error?: string; user?: { id: string; firstName: string; lastName: string; email: string } };

    if (!response.ok) {
      setError(body.error ?? "Bitte versuchen Sie es erneut.");
      setLoading(false);
      return;
    }

    setAuthenticatedUser(body.user ?? null);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/35 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-purple-200 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-purple-950">{mode === "login" ? "Anmelden" : "Registrieren"}</h2>
            <p className="mt-2 text-lg text-purple-900/90">Melden Sie sich an, damit Ihre Dokumente sicher gespeichert werden.</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-purple-200 px-3 py-2 text-purple-900 hover:bg-purple-50">
            Schließen
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={() => setMode("login")} className={`rounded-xl px-4 py-2 text-lg ${mode === "login" ? "bg-purple-700 text-white" : "bg-purple-100 text-purple-900"}`}>
            Anmelden
          </button>
          <button onClick={() => setMode("register")} className={`rounded-xl px-4 py-2 text-lg ${mode === "register" ? "bg-purple-700 text-white" : "bg-purple-100 text-purple-900"}`}>
            Registrieren
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(new FormData(event.currentTarget));
          }}
        >
          {mode === "register" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-lg text-purple-950">
                <span>Vorname</span>
                <input name="firstName" required className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none" />
              </label>
              <label className="space-y-2 text-lg text-purple-950">
                <span>Nachname</span>
                <input name="lastName" required className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none" />
              </label>
            </div>
          )}

          <label className="block space-y-2 text-lg text-purple-950">
            <span>E-Mail-Adresse</span>
            <input type="email" name="email" required className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none" />
          </label>

          <label className="block space-y-2 text-lg text-purple-950">
            <span>Passwort</span>
            <input type="password" name="password" required className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none" />
          </label>

          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-700">{error}</p> : null}

          <button disabled={loading} type="submit" className="min-h-14 w-full rounded-2xl bg-purple-700 px-6 text-lg font-semibold text-white hover:bg-purple-800 disabled:opacity-70">
            {loading ? "Bitte warten..." : mode === "login" ? "Anmelden" : "Konto erstellen"}
          </button>
        </form>
      </div>
    </div>
  );
}
