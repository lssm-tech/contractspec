import * as React from 'react';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Button } from '@lssm/lib.design-system';
import { readLearningEvents } from './learning-events';

export interface LearningCoachProps {
  mode: 'studio' | 'sandbox';
  onNavigateModule?: (moduleId: string) => void;
}

type StepId =
  | 'open_assistant'
  | 'open_projects'
  | 'open_integrations'
  | 'open_evolution'
  | 'open_learning';

const STEPS: { id: StepId; title: string; hint: string; moduleId: string }[] = [
  {
    id: 'open_assistant',
    title: 'Open the AI Assistant',
    hint: 'Use the floating button anytime.',
    moduleId: 'assistant',
  },
  {
    id: 'open_projects',
    title: 'Pick a project',
    hint: 'Select a project or template from the top bar.',
    moduleId: 'projects',
  },
  {
    id: 'open_integrations',
    title: 'Connect an integration',
    hint: 'Link a repo (GitHub) or knowledge source.',
    moduleId: 'integrations',
  },
  {
    id: 'open_evolution',
    title: 'Review evolution suggestions',
    hint: 'See anomalies and apply safe improvements.',
    moduleId: 'evolution',
  },
  {
    id: 'open_learning',
    title: 'Follow the learning journey',
    hint: 'Stay on track with the ambient coach.',
    moduleId: 'learning',
  },
];

function hasEvent(events: { name: string }[], name: string) {
  return events.some((e) => e.name === name);
}

export function LearningCoach({ mode, onNavigateModule }: LearningCoachProps) {
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setTick((x) => x + 1), 1500);
    return () => window.clearInterval(id);
  }, []);

  const events = React.useMemo(() => readLearningEvents(), [tick]);

  const completed: Record<StepId, boolean> = {
    open_assistant: hasEvent(events, `${mode}.assistant.opened`),
    open_projects: hasEvent(events, `${mode}.module.opened:projects`),
    open_integrations: hasEvent(events, `${mode}.module.opened:integrations`),
    open_evolution: hasEvent(events, `${mode}.module.opened:evolution`),
    open_learning: hasEvent(events, `${mode}.module.opened:learning`),
  };

  const total = STEPS.length;
  const done = STEPS.filter((s) => completed[s.id]).length;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Learning journey</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Progress: {done}/{total}
          </p>
        </div>
        <Sparkles className="text-muted-foreground h-4 w-4" />
      </div>

      <div className="mt-3 space-y-2">
        {STEPS.map((s) => {
          const isDone = completed[s.id];
          return (
            <div
              key={s.id}
              className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className="text-sm font-medium">{s.title}</p>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{s.hint}</p>
              </div>
              {onNavigateModule && s.moduleId !== 'assistant' ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => onNavigateModule(s.moduleId)}
                >
                  Go
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}




