import { ProcessingView } from "@/components/processing-view";

type ProcessingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQueryString(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") query.set(key, value);
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry));
    }
  });

  return query.toString();
}

export default async function ProcessingPage({ searchParams }: ProcessingPageProps) {
  const resolvedParams = await searchParams;
  return <ProcessingView queryString={toQueryString(resolvedParams)} />;
}
