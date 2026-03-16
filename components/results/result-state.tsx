type ResultStateProps = {
  title: string;
  message: string;
  tone?: "loading" | "error" | "empty";
};

const toneClasses: Record<NonNullable<ResultStateProps["tone"]>, string> = {
  loading: "bg-purple-50 text-purple-900 border-purple-200",
  error: "bg-red-50 text-red-700 border-red-200",
  empty: "bg-purple-100/60 text-purple-900 border-purple-200",
};

export function ResultState({ title, message, tone = "empty" }: ResultStateProps) {
  return (
    <section className={`rounded-2xl border p-5 ${toneClasses[tone]}`}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-lg leading-relaxed">{message}</p>
    </section>
  );
}
