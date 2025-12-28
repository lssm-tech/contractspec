import * as React from 'react';
import type {
  WorkflowSpec,
  WorkflowState,
} from '@contractspec/lib.contracts/workflow';
import { Stepper } from '@contractspec/lib.design-system';

export interface WorkflowStepperProps {
  spec: WorkflowSpec;
  state: WorkflowState | null;
  className?: string;
  showLabels?: boolean;
}

export function WorkflowStepper({
  spec,
  state,
  className,
  showLabels = false,
}: WorkflowStepperProps) {
  const steps = spec.definition.steps;
  const total = steps.length;
  const current = computeCurrent(steps, state);

  return (
    <div
      className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}
    >
      <Stepper current={current} total={total} />
      {showLabels && total > 0 && (
        <ol className="text-muted-foreground flex flex-wrap gap-2 text-sm">
          {steps.map((step, index) => {
            const isActive =
              state?.status === 'completed'
                ? index === total - 1
                : step.id === state?.currentStep;
            return (
              <li
                key={step.id}
                className={[
                  'rounded border px-2 py-1',
                  isActive ? 'border-primary text-primary' : 'border-border',
                ].join(' ')}
              >
                <span className="font-medium">{step.label}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function computeCurrent(
  steps: WorkflowSpec['definition']['steps'],
  state: WorkflowState | null
) {
  if (!steps.length) return 0;
  if (!state) return 1;

  if (state.status === 'completed') return steps.length;

  const idx = steps.findIndex((step) => step.id === state.currentStep);
  return idx === -1 ? 1 : idx + 1;
}
