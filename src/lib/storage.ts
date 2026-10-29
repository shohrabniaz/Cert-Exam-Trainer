import type { CertId, ProgressState, QuizResult, UserSettings } from "./types";
import { CERT_ORDER } from "./certs";
import { dateKey, isSameDay, isYesterday } from "./date";

const STORAGE_KEY = "cert-trainer:progress:v1";
const CURRENT_VERSION = 3;

function emptyCertProgress() {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    seenQuestionIds: [] as string[],
    lastQuizDateKey: null as string | null,
  };
}

function emptySettings(): UserSettings {
  return {
    onboardingDismissed: false,
    proUnlocked: false,
    practiceCompletionsByDate: {},
  };
}

function emptyCerts(): ProgressState["certs"] {
  return CERT_ORDER.reduce(
    (acc, id) => {
      acc[id] = emptyCertProgress();
      return acc;
    },
    {} as ProgressState["certs"],
  );
}

function emptyState(): ProgressState {
  return {
    version: CURRENT_VERSION,
    streak: {
      current: 0,
      longest: 0,
      lastActiveDateKey: null,
      totalDaysActive: 0,
    },
    certs: emptyCerts(),
    history: [],
    settings: emptySettings(),
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
  const certs = emptyCerts();
  for (const id of CERT_ORDER) {
    certs[id] = {
      ...certs[id],
      ...(parsed.certs?.[id] ?? {}),
    };
  }
  const history = Array.isArray(parsed.history)
    ? parsed.history.map((h) => ({
        ...h,
        mode: h.mode ?? "daily",
      }))
    : [];
  return {
    version: CURRENT_VERSION,
    streak: { ...base.streak, ...(parsed.streak ?? {}) },
    certs,
    history,
    settings: { ...base.settings, ...(parsed.settings ?? {}) },
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

export function updateSettings(
  state: ProgressState,
  patch: Partial<UserSettings>,
): ProgressState {
  const next = {
    ...state,
    settings: { ...state.settings, ...patch },
  };
  saveProgress(next);
  return next;
}

export function exportProgressJson(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}

export function importProgressJson(raw: string): ProgressState {
  const parsed = JSON.parse(raw) as Partial<ProgressState>;
  const next = normalize(parsed);
  saveProgress(next);
  return next;
}

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
  const mode = result.mode ?? "daily";

  const newSeen = new Set(cert.seenQuestionIds);
  for (const ans of result.answers) newSeen.add(ans.questionId);

  const updatedCert = {
    totalAnswered: cert.totalAnswered + result.total,
    totalCorrect: cert.totalCorrect + result.correctCount,
    seenQuestionIds: Array.from(newSeen),
    lastQuizDateKey:
      mode === "daily" ? today : cert.lastQuizDateKey,
  };

  const streak = nextStreak(state, today);

  let settings = state.settings;
  if (mode === "practice") {
    const count = (settings.practiceCompletionsByDate[today] ?? 0) + 1;
    settings = {
      ...settings,
      practiceCompletionsByDate: {
        ...settings.practiceCompletionsByDate,
        [today]: count,
      },
    };
  }

  return {
    ...state,
    streak,
    settings,
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
