import Link from "next/link";
import type { ReactNode } from "react";

type ActionCardProps = {
  href: string;
  title: string;
  description: string;
  helper: string;
  icon: ReactNode;
};

export function ActionCard({ href, title, description, helper, icon }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex min-h-48 w-full flex-col justify-between rounded-3xl border border-purple-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-purple-700"
    >
      <div>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 transition-colors group-hover:bg-purple-200">
          {icon}
        </div>
        <h2 className="text-2xl font-semibold text-purple-950">{title}</h2>
        <p className="mt-2 text-lg text-purple-900/85">{description}</p>
      </div>
      <p className="mt-4 text-base font-medium text-purple-700">{helper}</p>
    </Link>
  );
}
