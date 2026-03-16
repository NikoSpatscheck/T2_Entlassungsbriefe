import type { ReactNode } from "react";

type ResultCardProps = {
  title: string;
  children: ReactNode;
};

export function ResultCard({ title, children }: ResultCardProps) {
  return (
    <article className="rounded-2xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
      <h2 className="text-2xl font-semibold text-purple-950">{title}</h2>
      <div className="mt-3 text-lg leading-relaxed text-purple-900/90">{children}</div>
    </article>
  );
}
