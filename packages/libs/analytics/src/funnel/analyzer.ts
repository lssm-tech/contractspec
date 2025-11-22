import type {
  AnalyticsEvent,
  FunnelAnalysis,
  FunnelDefinition,
  FunnelStep,
  FunnelStepResult,
} from '../types';

export class FunnelAnalyzer {
  analyze(
    events: AnalyticsEvent[],
    definition: FunnelDefinition
  ): FunnelAnalysis {
    const windowMs = (definition.windowHours ?? 72) * 60 * 60 * 1000;
    const eventsByUser = groupByUser(events);
    const stepCounts = definition.steps.map(() => 0);

    for (const userEvents of eventsByUser.values()) {
      const completionIndex = this.evaluateUser(
        userEvents,
        definition.steps,
        windowMs
      );
      completionIndex.forEach((hit, stepIdx) => {
        if (hit) {
          stepCounts[stepIdx] = (stepCounts[stepIdx] ?? 0) + 1;
        }
      });
    }

    const totalUsers = eventsByUser.size;
    const steps: FunnelStepResult[] = definition.steps.map((step, index) => {
      const prevCount = index === 0 ? totalUsers : stepCounts[index - 1] || 1;
      const count = stepCounts[index] ?? 0;
      const conversionRate =
        prevCount === 0 ? 0 : Number((count / prevCount).toFixed(3));
      const dropOffRate = Number((1 - conversionRate).toFixed(3));
      return { step, count, conversionRate, dropOffRate };
    });

    return {
      definition,
      totalUsers,
      steps,
    };
  }

  private evaluateUser(
    events: AnalyticsEvent[],
    steps: FunnelStep[],
    windowMs: number
  ) {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const completion: boolean[] = Array(steps.length).fill(false);
    let cursor = 0;
    let anchorTime: number | undefined;

    for (const event of sorted) {
      const step = steps[cursor];
      if (!step) break;
      if (event.name !== step.eventName) continue;
      if (step.match && !step.match(event)) continue;

      const eventTime = new Date(event.timestamp).getTime();
      if (cursor === 0) {
        anchorTime = eventTime;
        completion[cursor] = true;
        cursor += 1;
        continue;
      }

      if (anchorTime && eventTime - anchorTime <= windowMs) {
        completion[cursor] = true;
        cursor += 1;
      }
    }

    return completion;
  }
}

function groupByUser(events: AnalyticsEvent[]): Map<string, AnalyticsEvent[]> {
  const map = new Map<string, AnalyticsEvent[]>();
  for (const event of events) {
    const list = map.get(event.userId) ?? [];
    list.push(event);
    map.set(event.userId, list);
  }
  return map;
}
