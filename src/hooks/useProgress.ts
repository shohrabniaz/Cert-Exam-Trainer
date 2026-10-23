"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProgressState, QuizResult } from "@/lib/types";
import {
  applyQuizResult,
  loadProgress,
  refreshStreak,
  resetProgress,
  saveProgress,
} from "@/lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = refreshStreak(loadProgress());
    setProgress(loaded);
    saveProgress(loaded);
    setReady(true);
  }, []);

  const recordQuiz = useCallback((result: QuizResult) => {
    setProgress((prev) => {
      const base = prev ?? loadProgress();
      const next = applyQuizResult(base, result);
      saveProgress(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    const fresh = resetProgress();
    setProgress(fresh);
  }, []);

  return { progress, ready, recordQuiz, clearAll };
}
