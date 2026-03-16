import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function PageContainer({ title, intro, children }: PageContainerProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-purple-100 sm:p-10">
        <h1 className="text-3xl leading-tight font-bold text-purple-950 sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-purple-900/90">{intro}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
