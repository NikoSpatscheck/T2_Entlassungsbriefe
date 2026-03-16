"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ProcessingViewProps = {
  queryString: string;
};

export function ProcessingView({ queryString }: ProcessingViewProps) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(`/result${queryString ? `?${queryString}` : ""}`);
    }, 2400);

    return () => clearTimeout(timeout);
  }, [queryString, router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-8">
      <section className="w-full rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-purple-100 sm:p-12">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" aria-hidden="true" />
        <h1 className="mt-8 text-3xl font-bold text-purple-950 sm:text-4xl">Wir bereiten Ihre vereinfachte Erklärung vor.</h1>
        <p className="mt-4 text-xl leading-relaxed text-purple-900/90">Das kann einen kurzen Moment dauern. Sie müssen nichts weiter tun.</p>
      </section>
    </main>
  );
}
