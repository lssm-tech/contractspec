import { describe, it, expect } from 'vitest';
import {
  createWorkflowContext,
  calculateWorkflowProgress,
  getWorkflowDuration,
  getAverageStepDuration,
  WorkflowContextError,
} from './context';
import type { WorkflowState } from './state';
import type { WorkflowSpec } from './spec';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const createTestSpec = (overrides?: Partial<WorkflowSpec>): WorkflowSpec => ({
  meta: {
    key: 'test.workflow',
    version: '1.0.0',
    owners: [{ team: 'test' }],
  },
  definition: {
    steps: [
      { id: 'step1', type: 'human', label: 'Step 1' },
      { id: 'step2', type: 'automation', label: 'Step 2' },
      { id: 'step3', type: 'decision', label: 'Step 3' },
    ],
    transitions: [
      { from: 'step1', to: 'step2' },
      { from: 'step2', to: 'step3', condition: 'data.approved === true' },
    ],
    sla: {
      totalDurationMs: 60000,
      stepDurationMs: {
        step1: 10000,
        step2: 20000,
      },
    },
    compensation: {
      trigger: 'on_failure',
      steps: [
        {
          stepId: 'step2',
          operation: { key: 'test.rollback', version: '1.0.0' },
        },
      ],
    },
    ...overrides?.definition,
  },
  ...overrides,
});

const createTestState = (
  overrides?: Partial<WorkflowState>
): WorkflowState => ({
  workflowId: 'wf-123',
  workflowName: 'test.workflow',
  workflowVersion: '1.0.0',
  currentStep: 'step1',
  data: { approved: true },
  retryCounts: {},
  history: [],
  status: 'running',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// createWorkflowContext Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('createWorkflowContext', () => {
  it('should create context with correct properties', () => {
    const spec = createTestSpec();
    const state = createTestState();
    const ctx = createWorkflowContext(state, spec);

    expect(ctx.workflowId).toBe('wf-123');
    expect(ctx.workflowKey).toBe('test.workflow');
    expect(ctx.workflowVersion).toBe('1.0.0');
    expect(ctx.currentStep).toBe('step1');
    expect(ctx.status).toBe('running');
    expect(ctx.data).toEqual({ approved: true });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// State Management Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('WorkflowContext State Management', () => {
  const spec = createTestSpec();

  describe('getState', () => {
    it('should return the full workflow state', () => {
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      const result = ctx.getState();
      expect(result).toEqual(state);
    });
  });

  describe('getData', () => {
    it('should return data value for existing key', () => {
      const state = createTestState({ data: { name: 'test', count: 42 } });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getData('name')).toBe('test');
      expect(ctx.getData<number>('count')).toBe(42);
    });

    it('should return undefined for non-existing key', () => {
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getData('nonexistent')).toBeUndefined();
    });
  });

  describe('isTerminal', () => {
    it('should return true for completed status', () => {
      const state = createTestState({ status: 'completed' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isTerminal()).toBe(true);
    });

    it('should return true for failed status', () => {
      const state = createTestState({ status: 'failed' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isTerminal()).toBe(true);
    });

    it('should return true for cancelled status', () => {
      const state = createTestState({ status: 'cancelled' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isTerminal()).toBe(true);
    });

    it('should return false for running status', () => {
      const state = createTestState({ status: 'running' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isTerminal()).toBe(false);
    });

    it('should return false for paused status', () => {
      const state = createTestState({ status: 'paused' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isTerminal()).toBe(false);
    });
  });

  describe('isRunning', () => {
    it('should return true for running status', () => {
      const state = createTestState({ status: 'running' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isRunning()).toBe(true);
    });

    it('should return false for other statuses', () => {
      const state = createTestState({ status: 'paused' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isRunning()).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Step Information Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('WorkflowContext Step Information', () => {
  const spec = createTestSpec();

  describe('getCurrentStepDef', () => {
    it('should return current step definition', () => {
      const state = createTestState({ currentStep: 'step2' });
      const ctx = createWorkflowContext(state, spec);

      const step = ctx.getCurrentStepDef();
      expect(step).toBeDefined();
      expect(step?.id).toBe('step2');
      expect(step?.type).toBe('automation');
    });

    it('should return undefined for unknown step', () => {
      const state = createTestState({ currentStep: 'unknown' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getCurrentStepDef()).toBeUndefined();
    });
  });

  describe('getRetryCount', () => {
    it('should return retry count for step', () => {
      const state = createTestState({
        retryCounts: { step1: 2, step2: 1 },
        currentStep: 'step1',
      });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getRetryCount()).toBe(2);
      expect(ctx.getRetryCount('step1')).toBe(2);
      expect(ctx.getRetryCount('step2')).toBe(1);
    });

    it('should return 0 for step without retries', () => {
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getRetryCount()).toBe(0);
      expect(ctx.getRetryCount('step3')).toBe(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Transitions Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('WorkflowContext Transitions', () => {
  const spec = createTestSpec();

  describe('canTransition', () => {
    it('should return true for valid transition', () => {
      const state = createTestState({ currentStep: 'step1' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.canTransition('step2')).toBe(true);
    });

    it('should return false for invalid transition', () => {
      const state = createTestState({ currentStep: 'step1' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.canTransition('step3')).toBe(false);
    });
  });

  describe('getAvailableTransitions', () => {
    it('should return available transitions from current step', () => {
      const state = createTestState({ currentStep: 'step1' });
      const ctx = createWorkflowContext(state, spec);

      const transitions = ctx.getAvailableTransitions();
      expect(transitions).toHaveLength(1);
      expect(transitions[0].from).toBe('step1');
      expect(transitions[0].to).toBe('step2');
    });

    it('should return empty array for terminal step', () => {
      const state = createTestState({ currentStep: 'step3' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getAvailableTransitions()).toHaveLength(0);
    });
  });

  describe('hasNextStep', () => {
    it('should return true when transitions exist', () => {
      const state = createTestState({ currentStep: 'step1' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.hasNextStep()).toBe(true);
    });

    it('should return false for terminal step', () => {
      const state = createTestState({ currentStep: 'step3' });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.hasNextStep()).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SLA Tracking Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('WorkflowContext SLA Tracking', () => {
  describe('getRemainingTime', () => {
    it('should return remaining workflow time', () => {
      const now = Date.now();
      const createdAt = new Date(now - 30000); // 30 seconds ago
      const spec = createTestSpec();
      const state = createTestState({ createdAt });
      const ctx = createWorkflowContext(state, spec);

      const remaining = ctx.getRemainingTime('totalDuration');
      expect(remaining).not.toBeNull();
      // Should be approximately 30000ms remaining (60000 - 30000)
      expect(remaining).toBeLessThanOrEqual(30000);
      expect(remaining).toBeGreaterThan(25000);
    });

    it('should return null when no SLA configured', () => {
      const spec = createTestSpec({
        definition: {
          ...createTestSpec().definition,
          sla: undefined,
        },
      });
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getRemainingTime('totalDuration')).toBeNull();
    });

    it('should return step SLA remaining time', () => {
      const now = Date.now();
      const spec = createTestSpec();
      const state = createTestState({
        currentStep: 'step1',
        history: [
          {
            stepId: 'step1',
            startedAt: new Date(now - 5000),
            status: 'running',
          },
        ],
      });
      const ctx = createWorkflowContext(state, spec);

      const remaining = ctx.getRemainingTime('step1');
      expect(remaining).not.toBeNull();
      // Should be approximately 5000ms remaining (10000 - 5000)
      expect(remaining).toBeLessThanOrEqual(5000);
    });

    it('should return full duration for step not yet started', () => {
      const spec = createTestSpec();
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      const remaining = ctx.getRemainingTime('step1');
      expect(remaining).toBe(10000);
    });
  });

  describe('isSlaViolated', () => {
    it('should return true when SLA exceeded', () => {
      const now = Date.now();
      const createdAt = new Date(now - 120000); // 2 minutes ago (exceeds 60s SLA)
      const spec = createTestSpec();
      const state = createTestState({ createdAt });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isSlaViolated('totalDuration')).toBe(true);
    });

    it('should return false when SLA not exceeded', () => {
      const spec = createTestSpec();
      const state = createTestState({ createdAt: new Date() });
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.isSlaViolated('totalDuration')).toBe(false);
    });
  });

  describe('getAllSlaStatuses', () => {
    it('should return all SLA statuses', () => {
      const spec = createTestSpec();
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      const statuses = ctx.getAllSlaStatuses();
      // Should have totalDuration + 2 step SLAs
      expect(statuses.length).toBe(3);

      const workflowSla = statuses.find((s) => s.key === 'totalDuration');
      expect(workflowSla).toBeDefined();
      expect(workflowSla?.type).toBe('workflow');

      const step1Sla = statuses.find((s) => s.key === 'step1');
      expect(step1Sla).toBeDefined();
      expect(step1Sla?.type).toBe('step');
    });

    it('should return empty array when no SLA', () => {
      const spec = createTestSpec({
        definition: {
          ...createTestSpec().definition,
          sla: undefined,
        },
      });
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getAllSlaStatuses()).toHaveLength(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Compensation Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('WorkflowContext Compensation', () => {
  describe('hasCompensation', () => {
    it('should return true when compensation configured', () => {
      const spec = createTestSpec();
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.hasCompensation()).toBe(true);
    });

    it('should return false when no compensation', () => {
      const spec = createTestSpec({
        definition: {
          ...createTestSpec().definition,
          compensation: undefined,
        },
      });
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.hasCompensation()).toBe(false);
    });
  });

  describe('getCompensableSteps', () => {
    it('should return steps with compensation handlers', () => {
      const spec = createTestSpec();
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      const steps = ctx.getCompensableSteps();
      expect(steps).toEqual(['step2']);
    });

    it('should return empty array when no compensation', () => {
      const spec = createTestSpec({
        definition: {
          ...createTestSpec().definition,
          compensation: undefined,
        },
      });
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getCompensableSteps()).toHaveLength(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Events Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('WorkflowContext Events', () => {
  describe('getEvents', () => {
    it('should convert history to events', () => {
      const now = Date.now();
      const state = createTestState({
        history: [
          {
            stepId: 'step1',
            startedAt: new Date(now - 10000),
            completedAt: new Date(now - 5000),
            status: 'completed',
            input: { foo: 'bar' },
            output: { result: 'ok' },
          },
          {
            stepId: 'step2',
            startedAt: new Date(now - 5000),
            completedAt: new Date(now - 2000),
            status: 'failed',
            error: 'Something went wrong',
          },
        ],
      });
      const spec = createTestSpec();
      const ctx = createWorkflowContext(state, spec);

      const events = ctx.getEvents();

      expect(events).toHaveLength(4);
      expect(events[0].type).toBe('step_started');
      expect(events[0].stepId).toBe('step1');
      expect(events[1].type).toBe('step_completed');
      expect(events[1].stepId).toBe('step1');
      expect(events[2].type).toBe('step_started');
      expect(events[2].stepId).toBe('step2');
      expect(events[3].type).toBe('step_failed');
      expect(events[3].error).toBe('Something went wrong');
    });

    it('should return empty array for no history', () => {
      const state = createTestState();
      const spec = createTestSpec();
      const ctx = createWorkflowContext(state, spec);

      expect(ctx.getEvents()).toHaveLength(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility Function Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Workflow Utility Functions', () => {
  describe('calculateWorkflowProgress', () => {
    it('should return 100 for completed workflow', () => {
      const spec = createTestSpec();
      const state = createTestState({ status: 'completed' });
      const ctx = createWorkflowContext(state, spec);

      expect(calculateWorkflowProgress(ctx)).toBe(100);
    });

    it('should return progress based on completed steps', () => {
      const spec = createTestSpec();
      const state = createTestState({
        status: 'running',
        history: [
          {
            stepId: 'step1',
            startedAt: new Date(),
            completedAt: new Date(),
            status: 'completed',
          },
        ],
      });
      const ctx = createWorkflowContext(state, spec);

      const progress = calculateWorkflowProgress(ctx);
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThan(100);
    });

    it('should return 0 for no completed steps', () => {
      const spec = createTestSpec();
      const state = createTestState({
        status: 'running',
        history: [],
      });
      const ctx = createWorkflowContext(state, spec);

      expect(calculateWorkflowProgress(ctx)).toBe(0);
    });
  });

  describe('getWorkflowDuration', () => {
    it('should return duration for running workflow', () => {
      const now = Date.now();
      const spec = createTestSpec();
      const state = createTestState({
        createdAt: new Date(now - 10000),
        status: 'running',
      });
      const ctx = createWorkflowContext(state, spec);

      const duration = getWorkflowDuration(ctx);
      expect(duration).toBeGreaterThanOrEqual(10000);
    });

    it('should return final duration for completed workflow', () => {
      const now = Date.now();
      const spec = createTestSpec();
      const state = createTestState({
        createdAt: new Date(now - 30000),
        updatedAt: new Date(now - 10000),
        status: 'completed',
      });
      const ctx = createWorkflowContext(state, spec);

      const duration = getWorkflowDuration(ctx);
      expect(duration).toBe(20000);
    });
  });

  describe('getAverageStepDuration', () => {
    it('should calculate average step duration', () => {
      const now = Date.now();
      const spec = createTestSpec();
      const state = createTestState({
        history: [
          {
            stepId: 'step1',
            startedAt: new Date(now - 20000),
            completedAt: new Date(now - 10000),
            status: 'completed',
          },
          {
            stepId: 'step2',
            startedAt: new Date(now - 10000),
            completedAt: new Date(now - 4000),
            status: 'completed',
          },
        ],
      });
      const ctx = createWorkflowContext(state, spec);

      const avg = getAverageStepDuration(ctx);
      // (10000 + 6000) / 2 = 8000
      expect(avg).toBe(8000);
    });

    it('should return 0 for no completed steps', () => {
      const spec = createTestSpec();
      const state = createTestState();
      const ctx = createWorkflowContext(state, spec);

      expect(getAverageStepDuration(ctx)).toBe(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowContextError Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('WorkflowContextError', () => {
  it('should create error with correct properties', () => {
    const error = new WorkflowContextError(
      'invalid_transition',
      'wf-123',
      'Cannot transition from step1 to step3',
      { from: 'step1', to: 'step3' }
    );

    expect(error.name).toBe('WorkflowContextError');
    expect(error.errorType).toBe('invalid_transition');
    expect(error.workflowId).toBe('wf-123');
    expect(error.message).toBe('Cannot transition from step1 to step3');
    expect(error.details).toEqual({ from: 'step1', to: 'step3' });
  });
});
