import type { CertId, ProgressState, Question } from "./types";
import { CERT_ORDER, CERTS } from "./certs";
import { getQuestions } from "./questions";

export interface DomainStat {
  domain: string;
  answered: number;
  correct: number;
  accuracy: number;
}

export interface CertStatSummary {
  cert: CertId;
  shortName: string;
  color: string;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number | null;
  seen: number;
  bankSize: number;
  domains: DomainStat[];
}

export function buildCertStats(state: ProgressState): CertStatSummary[] {
  return CERT_ORDER.map((cert) => {
    const progress = state.certs[cert];
    const bank = getQuestions(cert);
    const byId = new Map(bank.map((q) => [q.id, q]));
    const domainMap = new Map<string, { answered: number; correct: number }>();

    for (const result of state.history) {
      if (result.cert !== cert) continue;
      for (const ans of result.answers) {
        const q = byId.get(ans.questionId);
        if (!q) continue;
        const cur = domainMap.get(q.domain) ?? { answered: 0, correct: 0 };
        cur.answered += 1;
        if (ans.correct) cur.correct += 1;
        domainMap.set(q.domain, cur);
      }
    }

    const domains: DomainStat[] = Array.from(domainMap.entries())
      .map(([domain, v]) => ({
        domain,
        answered: v.answered,
        correct: v.correct,
        accuracy: v.answered ? Math.round((v.correct / v.answered) * 100) : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return {
      cert,
      shortName: CERTS[cert].shortName,
      color: CERTS[cert].color,
      totalAnswered: progress.totalAnswered,
      totalCorrect: progress.totalCorrect,
      accuracy:
        progress.totalAnswered > 0
          ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
          : null,
      seen: progress.seenQuestionIds.length,
      bankSize: bank.length,
      domains,
    };
  });
}

export function weakestDomains(
  state: ProgressState,
  limit = 5,
): Array<DomainStat & { cert: CertId; shortName: string }> {
  const rows: Array<DomainStat & { cert: CertId; shortName: string }> = [];
  for (const summary of buildCertStats(state)) {
    for (const d of summary.domains) {
      if (d.answered < 2) continue;
      rows.push({
        ...d,
        cert: summary.cert,
        shortName: summary.shortName,
      });
    }
  }
  return rows.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit);
}

export function questionLookup(cert: CertId): Map<string, Question> {
  return new Map(getQuestions(cert).map((q) => [q.id, q]));
}
