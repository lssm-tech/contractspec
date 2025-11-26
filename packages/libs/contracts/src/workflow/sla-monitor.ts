import type { WorkflowState } from './state';
import type { WorkflowSpec } from './spec';

export interface SLABreachEvent {
  workflowId: string;
  workflowName: string;
  type: 'workflow_duration' | 'step_duration';
  stepId?: string;
  expectedMs: number;
  actualMs: number;
  breachedAt: Date;
}

export class SLAMonitor {
  constructor(
    private readonly eventEmitter: (
      event: string,
      payload: SLABreachEvent
    ) => void
  ) {}

  check(state: WorkflowState, spec: WorkflowSpec): void {
    const sla = spec.definition.sla;
    if (!sla) return;

    const now = new Date().getTime();

    // Check total workflow duration
    if (sla.totalDurationMs) {
      const duration = now - state.createdAt.getTime();
      if (duration > sla.totalDurationMs) {
        // Only emit if not already completed/failed/cancelled
        if (state.status === 'running' || state.status === 'paused') {
          this.eventEmitter('workflow.sla_breach', {
            workflowId: state.workflowId,
            workflowName: state.workflowName,
            type: 'workflow_duration',
            expectedMs: sla.totalDurationMs,
            actualMs: duration,
            breachedAt: new Date(),
          });
        }
      }
    }

    // Check step durations
    if (sla.stepDurationMs) {
      // Check currently running step
      if (state.status === 'running' && state.currentStep) {
        // Find when the current step started
        // It might be the last entry in history if it's running?
        // But history usually stores *completed* steps or *failed* attempts.
        // Runner updates history with status='running' at start of execution?
        // Let's check runner.ts:
        //   const execution: StepExecution = { ... status: 'running' ... };
        //   workingState.history.push(execution);
        // Yes, it pushes running execution.

        const currentExecution = state.history.find(
          (h) => h.stepId === state.currentStep && h.status === 'running'
        );

        if (currentExecution) {
          const stepLimit = sla.stepDurationMs[state.currentStep];
          if (stepLimit) {
            const stepDuration = now - currentExecution.startedAt.getTime();
            if (stepDuration > stepLimit) {
              this.eventEmitter('workflow.sla_breach', {
                workflowId: state.workflowId,
                workflowName: state.workflowName,
                type: 'step_duration',
                stepId: state.currentStep,
                expectedMs: stepLimit,
                actualMs: stepDuration,
                breachedAt: new Date(),
              });
            }
          }
        }
      }
    }
  }
}










