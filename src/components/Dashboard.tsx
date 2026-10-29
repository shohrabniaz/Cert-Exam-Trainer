"use client";

import { CERT_ORDER, CERTS } from "@/lib/certs";
import { hasCompletedToday } from "@/lib/storage";
import { useProgress } from "@/hooks/useProgress";
import { Header } from "@/components/Header";
import { StreakBadge } from "@/components/StreakBadge";
import { CertCard } from "@/components/CertCard";

export function Dashboard() {
  const { progress, ready, clearAll } = useProgress();

  if (!ready || !progress) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Loading your progress…</p>
    );
  }

  const recent = progress.history.slice(0, 5);

  return (
    <>
      <Header subtitle="Daily drills for top cloud exams — CKA, AWS SAA-C03, AWS Cloud Practitioner, AZ-104, and Security+. Progress stays in this browser." />

      <section className="mb-8">
        <StreakBadge streak={progress.streak} />
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Top exam trainings
        </h2>
        <div className="grid gap-4">
          {CERT_ORDER.map((id) => (
            <CertCard
              key={id}
              cert={CERTS[id]}
              progress={progress.certs[id]}
              doneToday={hasCompletedToday(progress, id)}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Recent quizzes
        </h2>
        {recent.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-[var(--text-muted)]">
            No quizzes yet. Start with CKA or an AWS exam above.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((item) => (
              <li
                key={`${item.cert}-${item.completedAt}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[var(--bg-panel)] px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{CERTS[item.cert].shortName}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.dateKey}</p>
                </div>
                <p className="text-[var(--text-muted)]">
                  {item.correctCount}/{item.total}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-5">
        <h2 className="text-sm font-semibold">Local data</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Streaks and stats live in browser localStorage (no account required in week 1).
        </p>
        <button
          type="button"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.confirm("Reset all streaks, history, and cert progress on this device?")
            ) {
              clearAll();
            }
          }}
          className="mt-4 rounded-xl border border-rose-400/30 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
        >
          Reset progress
        </button>
      </section>

      <footer className="mt-10 text-center text-xs text-[var(--text-muted)]">
        © 2026 Shohrab Hossen Niaz · All rights reserved
      </footer>
    </>
  );
}
