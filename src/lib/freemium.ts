import type { ProgressState } from "./types";
import { dateKey } from "./date";

/** Free tier: unlimited daily quizzes; limited extra practice sets per day. */
export const FREE_PRACTICE_SETS_PER_DAY = 1;
export const PRACTICE_QUIZ_SIZE = 7;

export function isPro(state: ProgressState): boolean {
  return !!state.settings.proUnlocked;
}

export function practiceUsedToday(
  state: ProgressState,
  today = dateKey(),
): number {
  return state.settings.practiceCompletionsByDate[today] ?? 0;
}

export function canStartPractice(state: ProgressState): boolean {
  if (isPro(state)) return true;
  return practiceUsedToday(state) < FREE_PRACTICE_SETS_PER_DAY;
}

export function practiceRemaining(state: ProgressState): number {
  if (isPro(state)) return Number.POSITIVE_INFINITY;
  return Math.max(0, FREE_PRACTICE_SETS_PER_DAY - practiceUsedToday(state));
}
