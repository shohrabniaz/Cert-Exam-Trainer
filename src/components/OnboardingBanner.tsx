"use client";

import { useProgress } from "@/hooks/useProgress";

export function OnboardingBanner() {
  const { progress, ready, patchSettings } = useProgress();

  if (!ready || !progress || progress.settings.onboardingDismissed) {
    return null;
  }

  return (
    <div className="mb-6 animate-pop-in rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4">
      <p className="text-sm font-semibold text-sky-100">Welcome to Cert Exam Trainer</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Do one daily set for CKA, AWS, Azure, or Security+. Streaks and stats stay on this
        device. Free forever for daily drills — Pro unlocks unlimited extra practice.
      </p>
      <button
        type="button"
        onClick={() => patchSettings({ onboardingDismissed: true })}
        className="mt-3 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400"
      >
        Got it
      </button>
    </div>
  );
}
