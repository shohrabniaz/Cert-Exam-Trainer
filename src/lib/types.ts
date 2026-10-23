export type CertId = "cka" | "az104" | "securityplus";

export interface CertMeta {
  id: CertId;
  name: string;
  shortName: string;
  provider: string;
  tagline: string;
  color: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  cert: CertId;
  domain: string;
  difficulty: "easy" | "medium" | "hard";
  type: "single" | "multiple";
  prompt: string;
  options: QuestionOption[];
  correct: string[];
  explanation: string;
}

export interface AnswerRecord {
  questionId: string;
  selected: string[];
  correct: boolean;
  answeredAt: number;
}

export interface QuizResult {
  cert: CertId;
  dateKey: string;
  total: number;
  correctCount: number;
  answers: AnswerRecord[];
  completedAt: number;
}

export interface CertProgress {
  totalAnswered: number;
  totalCorrect: number;
  seenQuestionIds: string[];
  lastQuizDateKey: string | null;
}

export interface StreakState {
  current: number;
  longest: number;
  lastActiveDateKey: string | null;
  totalDaysActive: number;
}

export interface ProgressState {
  version: number;
  streak: StreakState;
  certs: Record<CertId, CertProgress>;
  history: QuizResult[];
}
