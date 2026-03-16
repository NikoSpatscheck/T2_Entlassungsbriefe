"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";

export function TopNavigation() {
  const { user, loading, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="mx-auto w-full max-w-5xl px-4 pt-5 sm:px-8 sm:pt-8">
      <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 ring-1 ring-purple-100 backdrop-blur">
        <Link href="/" className="text-lg font-semibold text-purple-950">Entlassungsbrief-Hilfe</Link>

        {loading ? (
          <span className="text-purple-700">Lade Konto...</span>
        ) : user ? (
          <div className="flex flex-wrap items-center gap-3 text-base sm:text-lg">
            <span className="rounded-xl bg-purple-100 px-3 py-2 font-medium text-purple-900">Hallo, {user.firstName}</span>
            <Link href="/dokumente" className="rounded-xl border border-purple-200 px-3 py-2 text-purple-900 hover:bg-purple-50">
              Meine bisherigen Dokumente
            </Link>
            <button onClick={() => void logout()} className="rounded-xl border border-purple-200 px-3 py-2 text-purple-900 hover:bg-purple-50">
              Abmelden
            </button>
          </div>
        ) : (
          <button onClick={() => setShowModal(true)} className="rounded-xl bg-purple-700 px-5 py-2.5 text-lg font-semibold text-white hover:bg-purple-800">
            Login
          </button>
        )}
      </nav>

      <AuthModal open={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
}
