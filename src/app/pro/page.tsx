"use client";

import { useProgress } from "@/hooks/useProgress";
import { FREE_PRACTICE_SETS_PER_DAY, isPro } from "@/lib/freemium";
import { Header } from "@/components/Header";

export default function ProPage() {
  const { progress, ready, patchSettings } = useProgress();

  if (!ready || !progress) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Loading…</p>
    );
  }

  const pro = isPro(progress);

  return (
    <>
      <Header subtitle="Freemium plan for Cert Exam Trainer. Daily quizzes stay free; Pro unlocks unlimited extra practice." />

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Free
          </p>
          <h2 className="mt-1 text-2xl font-semibold">$0</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
            <li>Daily quiz for every cert (CKA, AWS, AZ-104, Security+)</li>
            <li>Streaks and local progress</li>
            <li>{FREE_PRACTICE_SETS_PER_DAY} extra practice set per day</li>
            <li>Basic stats</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">
            Pro
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-amber-100">Coming soon</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
            <li>Unlimited extra practice</li>
            <li>Weak-domain drills (roadmap)</li>
            <li>Cloud sync across devices (roadmap)</li>
            <li>Expanded question banks</li>
          </ul>
          {pro ? (
            <p className="mt-5 rounded-xl bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">
              Pro preview is unlocked on this device.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => patchSettings({ proUnlocked: true })}
              className="mt-5 w-full rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              Unlock Pro preview (local)
            </button>
          )}
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Payments (Stripe) ship in a later release. Preview unlock is device-local for demos
            and early testers.
          </p>
          {pro ? (
            <button
              type="button"
              onClick={() => patchSettings({ proUnlocked: false })}
              className="mt-3 text-xs text-[var(--text-muted)] underline hover:text-[var(--text-primary)]"
            >
              Lock free tier again
            </button>
          ) : null}
        </article>
      </div>
    </>
  );
}
