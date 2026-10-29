import Link from "next/link";
import type { CertMeta, CertProgress } from "@/lib/types";
import { getQuestionCount } from "@/lib/questions";

export function CertCard({
  cert,
  progress,
  doneToday,
}: {
  cert: CertMeta;
  progress: CertProgress;
  doneToday: boolean;
}) {
  const total = getQuestionCount(cert.id);
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : null;

  return (
    <Link
      href={`/quiz/${cert.id}`}
      className="group block rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-5 transition hover:border-white/25 hover:bg-[var(--bg-elevated)]"
      style={{ borderTopColor: cert.color, borderTopWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {cert.provider}
            </p>
            {cert.featured ? (
              <span className="rounded-md bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                Top exam
              </span>
            ) : null}
          </div>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: cert.color }}>
            {cert.shortName}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{cert.tagline}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            doneToday
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-sky-500/15 text-sky-300"
          }`}
        >
          {doneToday ? "Done today" : "Practice"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-[var(--text-muted)]">
        <div className="rounded-xl bg-black/20 px-2 py-2">
          <p className="text-base font-semibold text-[var(--text-primary)]">{total}</p>
          <p>Questions</p>
        </div>
        <div className="rounded-xl bg-black/20 px-2 py-2">
          <p className="text-base font-semibold text-[var(--text-primary)]">
            {progress.seenQuestionIds.length}
          </p>
          <p>Seen</p>
        </div>
        <div className="rounded-xl bg-black/20 px-2 py-2">
          <p className="text-base font-semibold text-[var(--text-primary)]">
            {accuracy === null ? "—" : `${accuracy}%`}
          </p>
          <p>Accuracy</p>
        </div>
      </div>
    </Link>
  );
}
