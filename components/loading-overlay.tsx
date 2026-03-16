type LoadingOverlayProps = {
  title?: string;
  message?: string;
};

export function LoadingOverlay({
  title = "Ihr Dokument wird gerade vereinfacht",
  message = "Wir bereiten eine verständliche Erklärung für Sie vor.",
}: LoadingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/35 px-4"
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
      aria-busy="true"
    >
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-purple-200 sm:p-10">
        <div
          className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700"
          aria-hidden="true"
        />
        <h2 className="mt-6 text-3xl font-bold text-purple-950">{title}</h2>
        <p className="mt-4 text-xl leading-relaxed text-purple-900/90">{message}</p>
        <p className="mt-5 text-base text-purple-800">Das kann einen kurzen Moment dauern. Bitte bleiben Sie auf dieser Seite.</p>
      </section>
    </div>
  );
}
