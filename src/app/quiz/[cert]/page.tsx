import Link from "next/link";
import { notFound } from "next/navigation";
import { CERTS, isCertId } from "@/lib/certs";
import type { QuizMode } from "@/lib/types";
import { QuizPlayer } from "@/components/QuizPlayer";

export function generateStaticParams() {
  return [
    { cert: "cka" },
    { cert: "aws-saa" },
    { cert: "aws-clf" },
    { cert: "az104" },
    { cert: "securityplus" },
  ];
}

export default function QuizPage({
  params,
  searchParams,
}: {
  params: { cert: string };
  searchParams?: { mode?: string };
}) {
  if (!isCertId(params.cert)) notFound();
  const meta = CERTS[params.cert];
  const mode: QuizMode =
    searchParams?.mode === "practice" ? "practice" : "daily";

  return (
    <>
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ← Dashboard
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/80">
          Cert Exam Trainer
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {meta.shortName}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {meta.name} · {mode === "practice" ? "Extra practice" : "Daily quiz"}
        </p>
      </div>
      <QuizPlayer cert={params.cert} mode={mode} />
    </>
  );
}
