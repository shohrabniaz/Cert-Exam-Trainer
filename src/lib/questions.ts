import type { CertId, Question } from "./types";
import ckaRaw from "@/data/questions/cka.json";
import awsSaaRaw from "@/data/questions/aws-saa.json";
import awsClfRaw from "@/data/questions/aws-clf.json";
import az104Raw from "@/data/questions/az104.json";
import securityplusRaw from "@/data/questions/securityplus.json";

const BANK: Record<CertId, Question[]> = {
  cka: ckaRaw as Question[],
  "aws-saa": awsSaaRaw as Question[],
  "aws-clf": awsClfRaw as Question[],
  az104: az104Raw as Question[],
  securityplus: securityplusRaw as Question[],
};

export const DAILY_QUIZ_SIZE = 7;
export const PRACTICE_QUIZ_SIZE = 7;

export function getQuestions(cert: CertId): Question[] {
  return BANK[cert];
}

export function getQuestionCount(cert: CertId): number {
  return BANK[cert].length;
}

export function getDomains(cert: CertId): string[] {
  return Array.from(new Set(BANK[cert].map((q) => q.domain))).sort();
}

/**
 * Deterministic daily quiz: the same cert + day always yields the same set of
 * questions, so a user cannot reshuffle for an easier draw. Previously unseen
 * questions are prioritised; once the bank is exhausted we cycle back through.
 */
export function buildDailyQuiz(
  cert: CertId,
  dateKey: string,
  seenQuestionIds: string[],
  size = DAILY_QUIZ_SIZE,
): Question[] {
  const all = BANK[cert];
  const seed = hashSeed(`${cert}:${dateKey}`);
  const shuffled = seededShuffle(all, seed);

  const seen = new Set(seenQuestionIds);
  const fresh = shuffled.filter((q) => !seen.has(q.id));
  const recycled = shuffled.filter((q) => seen.has(q.id));

  return [...fresh, ...recycled].slice(0, Math.min(size, all.length));
}

/**
 * Extra practice set: seeded by cert + day + attempt so free users cannot
 * reshuffle endlessly for easier draws within the same attempt index.
 */
export function buildPracticeQuiz(
  cert: CertId,
  dateKey: string,
  attemptIndex: number,
  seenQuestionIds: string[],
  size = PRACTICE_QUIZ_SIZE,
): Question[] {
  const all = BANK[cert];
  const seed = hashSeed(`${cert}:practice:${dateKey}:${attemptIndex}`);
  const shuffled = seededShuffle(all, seed);
  const seen = new Set(seenQuestionIds);
  const fresh = shuffled.filter((q) => !seen.has(q.id));
  const recycled = shuffled.filter((q) => seen.has(q.id));
  return [...fresh, ...recycled].slice(0, Math.min(size, all.length));
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function isAnswerCorrect(question: Question, selected: string[]): boolean {
  if (selected.length !== question.correct.length) return false;
  const chosen = new Set(selected);
  return question.correct.every((id) => chosen.has(id));
}
