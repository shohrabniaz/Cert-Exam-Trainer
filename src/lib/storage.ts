import type { CertId, ProgressState, QuizResult } from "./types";
import { dateKey, isSameDay, isYesterday } from "./date";

const STORAGE_KEY = "cert-trainer:progress:v1";
const CURRENT_VERSION = 1;

function emptyState(): ProgressState {
  return {
    version: CURRENT_VERSION,
    streak: {
      current: 0,
      longest: 0,
      lastActiveDateKey: null,
      totalDaysActive: 0,
    },
    certs: {
      cka: emptyCertProgress(),
      az104: emptyCertProgress(),
      securityplus: emptyCertProgress(),
    },
    history: [],
  };
}

function emptyCertProgress() {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    seenQuestionIds: [] as string[],
    lastQuizDateKey: null as string | null,
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return normalize(parsed);
  } catch {
    return emptyState();
  }
}

function normalize(parsed: Partial<ProgressState>): ProgressState {
  const base = emptyState();
  return {
    version: CURRENT_VERSION,
    streak: { ...base.streak, ...(parsed.streak ?? {}) },
    certs: {
      cka: { ...base.certs.cka, ...(parsed.certs?.cka ?? {}) },
      az104: { ...base.certs.az104, ...(parsed.certs?.az104 ?? {}) },
      securityplus: {
        ...base.certs.securityplus,
        ...(parsed.certs?.securityplus ?? {}),
      },
    },
    history: Array.isArray(parsed.history) ? parsed.history : [],
  };
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be full or unavailable; fail silently */
  }
}

export function resetProgress(): ProgressState {
  const fresh = emptyState();
  saveProgress(fresh);
  return fresh;
}

/**
 * Recompute the streak against today. If the user has not been active today or
 * yesterday, the current streak resets to zero. This keeps the dashboard honest
 * even when the app is opened days later.
 */
export function refreshStreak(
  state: ProgressState,
  today = dateKey(),
): ProgressState {
  const last = state.streak.lastActiveDateKey;
  if (!last) return state;
  if (isSameDay(last, today) || isYesterday(last, today)) return state;
  return {
    ...state,
    streak: { ...state.streak, current: 0 },
  };
}

/** Apply a completed quiz: update cert stats, streak and history. */
export function applyQuizResult(
  state: ProgressState,
  result: QuizResult,
): ProgressState {
  const today = result.dateKey;
  const cert = state.certs[result.cert];

  const newSeen = new Set(cert.seenQuestionIds);
  for (const ans of result.answers) newSeen.add(ans.questionId);

  const updatedCert = {
    totalAnswered: cert.totalAnswered + result.total,
    totalCorrect: cert.totalCorrect + result.correctCount,
    seenQuestionIds: Array.from(newSeen),
    lastQuizDateKey: today,
  };

  const streak = nextStreak(state, today);

  return {
    ...state,
    streak,
    certs: { ...state.certs, [result.cert]: updatedCert },
    history: [result, ...state.history].slice(0, 200),
  };
}

function nextStreak(state: ProgressState, today: string) {
  const s = state.streak;
  if (s.lastActiveDateKey && isSameDay(s.lastActiveDateKey, today)) {
    return s;
  }
  let current: number;
  if (s.lastActiveDateKey && isYesterday(s.lastActiveDateKey, today)) {
    current = s.current + 1;
  } else {
    current = 1;
  }
  return {
    current,
    longest: Math.max(s.longest, current),
    lastActiveDateKey: today,
    totalDaysActive: s.totalDaysActive + 1,
  };
}

export function hasCompletedToday(state: ProgressState, cert: CertId): boolean {
  const last = state.certs[cert].lastQuizDateKey;
  return !!last && isSameDay(last, dateKey());
}
