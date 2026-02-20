import type { ResolutionResultPayload } from '../types';
import { getDefaultI18n } from '../i18n';

export interface FeedbackMetrics {
  totalTickets: number;
  autoResolved: number;
  escalated: number;
  avgConfidence: number;
  avgResponseTimeMs: number;
}

export class SupportFeedbackLoop {
  private readonly history: ResolutionResultPayload[] = [];
  private readonly responseTimes = new Map<string, number>();

  recordResolution(payload: ResolutionResultPayload, responseTimeMs?: number) {
    this.history.push(payload);
    if (responseTimeMs != null) {
      this.responseTimes.set(payload.ticket.id, responseTimeMs);
    }
  }

  metrics(): FeedbackMetrics {
    const total = this.history.length;
    const autoResolved = this.history.filter(
      (entry) =>
        !entry.resolution.actions.some((action) => action.type === 'escalate')
    ).length;
    const escalated = total - autoResolved;
    const avgConfidence =
      total === 0
        ? 0
        : this.history.reduce(
            (sum, entry) => sum + entry.resolution.confidence,
            0
          ) / total;
    const avgResponseTimeMs =
      this.responseTimes.size === 0
        ? 0
        : [...this.responseTimes.values()].reduce((a, b) => a + b, 0) /
          this.responseTimes.size;

    return {
      totalTickets: total,
      autoResolved,
      escalated,
      avgConfidence: Number(avgConfidence.toFixed(2)),
      avgResponseTimeMs: Math.round(avgResponseTimeMs),
    };
  }

  feedbackSummary(limit = 5): string {
    const { t } = getDefaultI18n();
    const recent = this.history.slice(-limit);
    if (!recent.length) return t('feedback.noRecords');
    return recent
      .map((entry) => {
        const status = entry.resolution.actions.some(
          (action) => action.type === 'escalate'
        )
          ? t('feedback.status.escalated')
          : t('feedback.status.autoResolved');
        return `${entry.ticket.subject} \u2013 ${status} (confidence: ${entry.resolution.confidence})`;
      })
      .join('\n');
  }
}
