import Link from "next/link";

type BackLinkProps = {
  href?: string;
  label?: string;
};

export function BackLink({ href = "/", label = "Zurück zur Startseite" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-xl px-4 py-3 text-lg font-medium text-purple-800 transition-colors hover:bg-purple-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
    >
      ← {label}
    </Link>
  );
}
