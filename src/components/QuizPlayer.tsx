"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CertId, Question, QuizMode, QuizResult } from "@/lib/types";
import { CERTS } from "@/lib/certs";
import { dateKey } from "@/lib/date";
import {
  buildDailyQuiz,
  buildPracticeQuiz,
  isAnswerCorrect,
} from "@/lib/questions";
import { hasCompletedToday } from "@/lib/storage";
import {
  canStartPractice,
  practiceRemaining,
  practiceUsedToday,
} from "@/lib/freemium";
import { useProgress } from "@/hooks/useProgress";

type Phase = "intro" | "question" | "feedback" | "summary" | "locked";

export function QuizPlayer({
  cert,
  mode = "daily",
}: {
  cert: CertId;
  mode?: QuizMode;
}) {
  const { progress, ready, recordQuiz } = useProgress();
  const meta = CERTS[cert];

  const questions = useMemo(() => {
    if (!progress) return [] as Question[];
    if (mode === "practice") {
      return buildPracticeQuiz(
        cert,
        dateKey(),
        practiceUsedToday(progress),
        progress.certs[cert].seenQuestionIds,
      );
    }
    return buildDailyQuiz(
      cert,
      dateKey(),
      progress.certs[cert].seenQuestionIds,
    );
  }, [cert, mode, progress]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuizResult["answers"]>([]);
  const [lastCorrect, setLastCorrect] = useState(false);

  if (!ready || !progress) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Loading your progress…</p>
    );
  }

  const state = progress;
  const alreadyDone = hasCompletedToday(state, cert);
  const remainingPractice = practiceRemaining(state);
  const practiceAllowed = mode !== "practice" || canStartPractice(state);
  const current = questions[index];
  const correctCount = answers.filter((a) => a.correct).length;

  function toggleOption(id: string) {
    if (!current || phase !== "question") return;
    if (current.type === "single") {
      setSelected([id]);
      return;
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function submitAnswer() {
    if (!current || selected.length === 0) return;
    const correct = isAnswerCorrect(current, selected);
    setLastCorrect(correct);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: current.id,
        selected: [...selected],
        correct,
        answeredAt: Date.now(),
      },
    ]);
    setPhase("feedback");
  }

  function next() {
    if (index + 1 >= questions.length) {
      const finalCorrect = answers.filter((a) => a.correct).length;
      const finalResult: QuizResult = {
        cert,
        dateKey: dateKey(),
        mode,
        total: questions.length,
        correctCount: finalCorrect,
        answers,
        completedAt: Date.now(),
      };
      recordQuiz(finalResult);
      setPhase("summary");
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setPhase("question");
  }

  function startQuiz() {
    if (mode === "practice" && !canStartPractice(state)) {
      setPhase("locked");
      return;
    }
    setPhase("question");
    setIndex(0);
    setSelected([]);
    setAnswers([]);
  }

  if (phase === "locked" || (phase === "intro" && mode === "practice" && !practiceAllowed)) {
    return (
      <section className="animate-pop-in rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6">
        <h2 className="text-xl font-semibold text-amber-100">Practice limit reached</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Free tier includes {questions.length ? "1 extra practice set" : "limited practice"} per
          day. Your daily quiz for each cert stays free forever. Unlock Pro for unlimited
          practice drills.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pro"
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            See Pro
          </Link>
          <Link
            href={`/quiz/${cert}`}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-[var(--text-muted)] hover:border-white/30"
          >
            Back to daily quiz
          </Link>
        </div>
      </section>
    );
  }

  if (phase === "intro") {
    return (
      <section className="animate-pop-in rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {meta.provider}
        </p>
        <h2 className="mt-1 text-2xl font-semibold" style={{ color: meta.color }}>
          {meta.shortName} {mode === "practice" ? "practice" : "daily quiz"}
        </h2>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {questions.length} questions · original items · instant explanations.
          {mode === "daily"
            ? " Completing a daily quiz advances your streak (once per day)."
            : " Extra practice does not replace your daily set."}
        </p>
        {mode === "daily" && alreadyDone ? (
          <p className="mt-4 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            Today&apos;s daily {meta.shortName} quiz is done. Retry the same set, or start extra
            practice.
          </p>
        ) : null}
        {mode === "practice" ? (
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Free practice remaining today:{" "}
            {Number.isFinite(remainingPractice) ? remainingPractice : "Unlimited (Pro)"}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startQuiz}
            className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
          >
            {mode === "practice"
              ? "Start practice"
              : alreadyDone
                ? "Retry daily set"
                : "Start daily quiz"}
          </button>
          {mode === "daily" ? (
            <Link
              href={`/quiz/${cert}?mode=practice`}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-[var(--text-muted)] hover:border-white/30 hover:text-[var(--text-primary)]"
            >
              Extra practice
            </Link>
          ) : (
            <Link
              href={`/quiz/${cert}`}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-[var(--text-muted)] hover:border-white/30"
            >
              Daily quiz
            </Link>
          )}
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-[var(--text-muted)] hover:border-white/30"
          >
            Home
          </Link>
        </div>
      </section>
    );
  }

  if (phase === "summary") {
    const pct = questions.length
      ? Math.round((correctCount / questions.length) * 100)
      : 0;
    return (
      <section className="animate-pop-in rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-6">
        <h2 className="text-2xl font-semibold">Quiz complete</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {meta.shortName} · {mode} · {correctCount}/{questions.length} correct ({pct}%)
        </p>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/30">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ul className="mt-6 space-y-2 text-sm">
          {questions.map((q, i) => {
            const ans = answers[i];
            return (
              <li
                key={q.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-black/20 px-3 py-2"
              >
                <span className="text-[var(--text-muted)]">
                  {i + 1}. {q.domain}
                </span>
                <span className={ans?.correct ? "text-emerald-300" : "text-rose-300"}>
                  {ans?.correct ? "Correct" : "Review"}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/stats"
            className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
          >
            View stats
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-[var(--text-muted)] hover:border-white/30"
          >
            Dashboard
          </Link>
          {mode === "daily" ? (
            <Link
              href={`/quiz/${cert}?mode=practice`}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-[var(--text-muted)] hover:border-white/30"
            >
              Extra practice
            </Link>
          ) : null}
        </div>
      </section>
    );
  }

  if (!current) {
    return <p className="text-sm text-rose-300">No questions available.</p>;
  }

  const progressPct = Math.round(
    ((index + (phase === "feedback" ? 1 : 0)) / questions.length) * 100,
  );

  return (
    <section className="animate-pop-in">
      <div className="mb-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>
          {current.domain} · {current.difficulty}
        </span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full rounded-full bg-sky-400 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-sky-300/80">
          {current.type === "multiple" ? "Select all that apply" : "Choose one"}
        </p>
        <h2 className="mt-2 text-lg font-medium leading-snug sm:text-xl">
          {current.prompt}
        </h2>

        <ul className="mt-5 space-y-2">
          {current.options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            const isRight = current.correct.includes(opt.id);
            let styles =
              "border-white/10 bg-black/20 hover:border-white/25 hover:bg-black/30";
            if (phase === "question" && isSelected) {
              styles = "border-sky-400/60 bg-sky-500/15";
            }
            if (phase === "feedback") {
              if (isRight) styles = "border-emerald-400/50 bg-emerald-500/15";
              else if (isSelected) styles = "border-rose-400/50 bg-rose-500/15";
              else styles = "border-white/5 bg-black/10 opacity-70";
            }
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  disabled={phase !== "question"}
                  onClick={() => toggleOption(opt.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${styles}`}
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20 text-xs font-semibold uppercase">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {phase === "feedback" ? (
          <div
            className={`mt-5 rounded-xl px-4 py-3 text-sm ${
              lastCorrect
                ? "bg-emerald-500/10 text-emerald-200"
                : "bg-rose-500/10 text-rose-200"
            }`}
          >
            <p className="font-semibold">{lastCorrect ? "Correct" : "Not quite"}</p>
            <p className="mt-1 text-[var(--text-primary)]/90">{current.explanation}</p>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end">
          {phase === "question" ? (
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={submitAnswer}
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white enabled:hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
            >
              {index + 1 >= questions.length ? "See results" : "Next question"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
