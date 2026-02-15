import * as React from 'react';
import { EmptyState, LoaderBlock } from '@contractspec/lib.design-system';
import type {
  FormRef,
  Step,
  WorkflowSpec,
  WorkflowState,
  StepExecution,
} from '@contractspec/lib.contracts-spec/workflow';

export interface WorkflowStepRendererProps {
  spec: WorkflowSpec;
  state: WorkflowState | null;
  className?: string;
  renderHumanStep?: (form: FormRef, step: Step) => React.ReactNode;
  renderAutomationStep?: (step: Step) => React.ReactNode;
  renderDecisionStep?: (step: Step) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  completedFallback?: React.ReactNode;
  cancelledFallback?: React.ReactNode;
  failedFallback?: (
    state: WorkflowState,
    last: StepExecution | undefined
  ) => React.ReactNode;
}

export function WorkflowStepRenderer({
  spec,
  state,
  className,
  renderHumanStep,
  renderAutomationStep,
  renderDecisionStep,
  loadingFallback,
  completedFallback,
  cancelledFallback,
  failedFallback,
}: WorkflowStepRendererProps) {
  const steps = spec.definition.steps;
  if (!steps.length) {
    return (
      <div className={className}>
        <EmptyState
          title="No steps defined"
          description="Add at least one step to this workflow to render it."
        />
      </div>
    );
  }

  if (!state) {
    return (
      <div className={className}>
        {loadingFallback ?? (
          <LoaderBlock
            label="Loading workflow"
            description="Fetching workflow state..."
          />
        )}
      </div>
    );
  }

  const lastExecution = state.history.at(-1);

  if (state.status === 'failed') {
    return (
      <div className={className}>
        {failedFallback?.(state, lastExecution) ?? (
          <EmptyState
            title="Workflow failed"
            description={
              lastExecution?.error ??
              'Fix the underlying issue and retry the step.'
            }
          />
        )}
      </div>
    );
  }

  if (state.status === 'cancelled') {
    return (
      <div className={className}>
        {cancelledFallback ?? (
          <EmptyState
            title="Workflow cancelled"
            description="This workflow has been cancelled. Restart it to resume."
          />
        )}
      </div>
    );
  }

  if (state.status === 'completed') {
    return (
      <div className={className}>
        {completedFallback ?? (
          <EmptyState
            title="Workflow complete"
            description="All steps have been executed successfully."
          />
        )}
      </div>
    );
  }

  const activeStep =
    steps.find((step) => step.id === state.currentStep) ?? steps[0];

  if (!activeStep) {
    return (
      <div className={className}>
        <EmptyState
          title="No active step"
          description="This workflow has no active step."
        />
      </div>
    );
  }

  switch (activeStep.type) {
    case 'human': {
      const form = activeStep.action?.form;
      if (form && renderHumanStep) {
        return (
          <div className={className}>{renderHumanStep(form, activeStep)}</div>
        );
      }
      return (
        <div className={className}>
          <EmptyState
            title="Form renderer missing"
            description="Provide renderHumanStep to render this human step's form."
          />
        </div>
      );
    }
    case 'automation': {
      if (renderAutomationStep) {
        return (
          <div className={className}>{renderAutomationStep(activeStep)}</div>
        );
      }
      return (
        <div className={className}>
          <EmptyState
            title="Automation step in progress"
            description={`Waiting for automation "${activeStep.label}" to finish.`}
          />
        </div>
      );
    }
    case 'decision': {
      if (renderDecisionStep) {
        return (
          <div className={className}>{renderDecisionStep(activeStep)}</div>
        );
      }
      return (
        <div className={className}>
          <EmptyState
            title="Decision step awaiting input"
            description="Provide a custom decision renderer via renderDecisionStep."
          />
        </div>
      );
    }
    default:
      return (
        <div className={className}>
          <EmptyState
            title="Unknown step type"
            description={`Step "${activeStep.id}" has an unsupported type.`}
          />
        </div>
      );
  }
}
