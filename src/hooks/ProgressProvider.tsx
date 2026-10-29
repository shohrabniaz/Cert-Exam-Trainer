"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProgressState, QuizResult, UserSettings } from "@/lib/types";
import {
  applyQuizResult,
  exportProgressJson,
  importProgressJson,
  loadProgress,
  refreshStreak,
  resetProgress,
  saveProgress,
  updateSettings,
} from "@/lib/storage";

interface ProgressContextValue {
  progress: ProgressState | null;
  ready: boolean;
  recordQuiz: (result: QuizResult) => void;
  patchSettings: (patch: Partial<UserSettings>) => void;
  clearAll: () => void;
  exportJson: () => string;
  importJson: (raw: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
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

  const patchSettings = useCallback((patch: Partial<UserSettings>) => {
    setProgress((prev) => {
      const base = prev ?? loadProgress();
      return updateSettings(base, patch);
    });
  }, []);

  const clearAll = useCallback(() => {
    setProgress(resetProgress());
  }, []);

  const exportJson = useCallback(() => {
    return exportProgressJson(progress ?? loadProgress());
  }, [progress]);

  const importJson = useCallback((raw: string) => {
    setProgress(importProgressJson(raw));
  }, []);

  const value = useMemo(
    () => ({
      progress,
      ready,
      recordQuiz,
      patchSettings,
      clearAll,
      exportJson,
      importJson,
    }),
    [
      progress,
      ready,
      recordQuiz,
      patchSettings,
      clearAll,
      exportJson,
      importJson,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
