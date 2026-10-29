"use client";

import Link from "next/link";
import { CERT_ORDER, CERTS } from "@/lib/certs";
import { hasCompletedToday } from "@/lib/storage";
import { isPro, practiceRemaining } from "@/lib/freemium";
import { useProgress } from "@/hooks/useProgress";
import { Header } from "@/components/Header";
import { StreakBadge } from "@/components/StreakBadge";
import { CertCard } from "@/components/CertCard";
import { OnboardingBanner } from "@/components/OnboardingBanner";

export function Dashboard() {
  const { progress, ready } = useProgress();

  if (!ready || !progress) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Loading your progress…</p>
    );
  }

  const recent = progress.history.slice(0, 5);
  const remaining = practiceRemaining(progress);

  return (
    <>
      <Header subtitle="Daily drills for top cloud exams — CKA, AWS SAA-C03, AWS Cloud Practitioner, AZ-104, and Security+. Progress stays in this browser." />

      <OnboardingBanner />

      <section className="mb-8">
        <StreakBadge streak={progress.streak} />
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {isPro(progress)
            ? "Pro unlocked · unlimited extra practice"
            : `Free tier · ${Number.isFinite(remaining) ? remaining : 0} extra practice set(s) left today`}
          {" · "}
          <Link href="/pro" className="text-sky-300 hover:underline">
            View Pro
          </Link>
        </p>
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Recent quizzes
          </h2>
          <Link href="/stats" className="text-xs text-sky-300 hover:underline">
            Full stats
          </Link>
        </div>
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
                  <p className="font-medium">
                    {CERTS[item.cert].shortName}
                    <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">
                      {item.mode ?? "daily"}
                    </span>
                  </p>
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

      <footer className="mt-10 text-center text-xs text-[var(--text-muted)]">
        © 2026 Shohrab Hossen Niaz · All rights reserved
      </footer>
    </>
  );
}
