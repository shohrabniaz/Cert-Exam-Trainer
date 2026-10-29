import Link from "next/link";

export function Header({
  subtitle,
  backHref,
}: {
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-block text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            ← Back
          </Link>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/80">
          Cert Exam Trainer
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Train for top cert exams
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}
