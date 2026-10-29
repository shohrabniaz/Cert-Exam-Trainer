"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { buildCertStats, weakestDomains } from "@/lib/stats";
import { Header } from "@/components/Header";

export default function StatsPage() {
  const { progress, ready } = useProgress();

  if (!ready || !progress) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Loading your progress…</p>
    );
  }

  const summaries = buildCertStats(progress);
  const weak = weakestDomains(progress);

  return (
    <>
      <Header
        subtitle="Accuracy by certification and weakest domains from your quiz history."
      />

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Focus next
        </h2>
        {weak.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-[var(--text-muted)]">
            Complete a few quizzes to unlock weak-domain suggestions.
          </p>
        ) : (
          <ul className="space-y-2">
            {weak.map((row) => (
              <li
                key={`${row.cert}-${row.domain}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[var(--bg-panel)] px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {row.shortName} · {row.domain}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {row.correct}/{row.answered} correct
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-rose-300">{row.accuracy}%</span>
                  <Link
                    href={`/quiz/${row.cert}?mode=practice`}
                    className="text-xs text-sky-300 hover:underline"
                  >
                    Practice
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          By certification
        </h2>
        {summaries.map((s) => (
          <article
            key={s.cert}
            className="rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-5"
            style={{ borderTopColor: s.color, borderTopWidth: 3 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: s.color }}>
                  {s.shortName}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {s.seen}/{s.bankSize} questions seen
                </p>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                {s.accuracy === null ? "—" : `${s.accuracy}%`} accuracy
              </p>
            </div>
            {s.domains.length > 0 ? (
              <ul className="mt-4 space-y-1.5 text-sm">
                {s.domains.map((d) => (
                  <li
                    key={d.domain}
                    className="flex justify-between gap-3 text-[var(--text-muted)]"
                  >
                    <span>{d.domain}</span>
                    <span>
                      {d.accuracy}% · {d.answered} answered
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--text-muted)]">No attempts yet.</p>
            )}
            <Link
              href={`/quiz/${s.cert}`}
              className="mt-4 inline-block text-sm text-sky-300 hover:underline"
            >
              Open daily quiz →
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
