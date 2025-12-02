/**
 * Workflow State Machine Engine
 *
 * Provides state machine logic for workflow transitions.
 * This is a spec-level abstraction that defines the interface
 * for workflow state transitions.
 */

// ============ Types ============

/**
 * Represents a transition definition in a workflow step.
 */
export interface TransitionDefinition {
  /** The action that triggers this transition (e.g., "approve", "reject") */
  action: string;
  /** The target step key to transition to */
  targetStepKey: string;
  /** Optional condition expression for conditional transitions */
  condition?: string;
  /** Optional guard roles - only users with these roles can take this action */
  allowedRoles?: string[];
}

/**
 * Step definition for state machine.
 */
export interface StateMachineStep {
  key: string;
  name: string;
  type:
    | 'START'
    | 'APPROVAL'
    | 'TASK'
    | 'CONDITION'
    | 'PARALLEL'
    | 'WAIT'
    | 'ACTION'
    | 'END';
  /** Map of action -> transition definition */
  transitions: Record<string, string | TransitionDefinition>;
  /** For approval steps: how approvals are handled */
  approvalMode?: 'ANY' | 'ALL' | 'MAJORITY' | 'SEQUENTIAL';
  /** Roles that can approve/act on this step */
  allowedRoles?: string[];
  /** Timeout in seconds */
  timeoutSeconds?: number;
  /** Condition expression for CONDITION type */
  conditionExpression?: string;
}

/**
 * Workflow state machine definition.
 */
export interface StateMachineDefinition {
  key: string;
  name: string;
  version: number;
  initialStepKey: string;
  steps: Record<string, StateMachineStep>;
}

/**
 * Current state of an instance.
 */
export interface StateMachineState {
  currentStepKey: string;
  status:
    | 'PENDING'
    | 'RUNNING'
    | 'WAITING'
    | 'PAUSED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'FAILED'
    | 'TIMEOUT';
  contextData: Record<string, unknown>;
  history: {
    stepKey: string;
    action: string;
    timestamp: Date;
    executedBy: string;
  }[];
}

/**
 * Result of a transition attempt.
 */
export interface TransitionResult {
  success: boolean;
  previousStepKey: string;
  currentStepKey: string | null;
  status: StateMachineState['status'];
  error?: string;
}

/**
 * Context for transition validation.
 */
export interface TransitionContext {
  userId: string;
  userRoles: string[];
  data?: Record<string, unknown>;
}

// ============ State Machine Engine ============

/**
 * State machine engine interface.
 * Implementation should be provided at runtime.
 */
export interface IStateMachineEngine {
  /**
   * Validate that a transition is allowed.
   */
  canTransition(
    definition: StateMachineDefinition,
    state: StateMachineState,
    action: string,
    context: TransitionContext
  ): { allowed: boolean; reason?: string };

  /**
   * Get available actions for the current step.
   */
  getAvailableActions(
    definition: StateMachineDefinition,
    state: StateMachineState,
    context: TransitionContext
  ): string[];

  /**
   * Execute a transition.
   */
  transition(
    definition: StateMachineDefinition,
    state: StateMachineState,
    action: string,
    context: TransitionContext
  ): TransitionResult;

  /**
   * Evaluate a condition expression.
   */
  evaluateCondition(
    expression: string,
    contextData: Record<string, unknown>
  ): boolean;
}

/**
 * Basic state machine engine implementation.
 * This is a reference implementation for spec validation.
 */
export class BasicStateMachineEngine implements IStateMachineEngine {
  canTransition(
    definition: StateMachineDefinition,
    state: StateMachineState,
    action: string,
    context: TransitionContext
  ): { allowed: boolean; reason?: string } {
    // Check if state allows transitions
    if (state.status !== 'RUNNING' && state.status !== 'WAITING') {
      return {
        allowed: false,
        reason: `Workflow is ${state.status}, cannot transition`,
      };
    }

    const currentStep = definition.steps[state.currentStepKey];
    if (!currentStep) {
      return {
        allowed: false,
        reason: `Step ${state.currentStepKey} not found`,
      };
    }

    // Check if action exists for this step
    const transition = currentStep.transitions[action];
    if (!transition) {
      return {
        allowed: false,
        reason: `Action ${action} not available in step ${state.currentStepKey}`,
      };
    }

    // Check role-based access
    if (currentStep.allowedRoles && currentStep.allowedRoles.length > 0) {
      const hasRole = currentStep.allowedRoles.some((role) =>
        context.userRoles.includes(role)
      );
      if (!hasRole) {
        return {
          allowed: false,
          reason: `User lacks required role for this action`,
        };
      }
    }

    // Check transition-specific roles if defined
    if (
      typeof transition === 'object' &&
      transition.allowedRoles &&
      transition.allowedRoles.length > 0
    ) {
      const hasRole = transition.allowedRoles.some((role) =>
        context.userRoles.includes(role)
      );
      if (!hasRole) {
        return {
          allowed: false,
          reason: `User lacks required role for action ${action}`,
        };
      }
    }

    return { allowed: true };
  }

  getAvailableActions(
    definition: StateMachineDefinition,
    state: StateMachineState,
    context: TransitionContext
  ): string[] {
    if (state.status !== 'RUNNING' && state.status !== 'WAITING') {
      return [];
    }

    const currentStep = definition.steps[state.currentStepKey];
    if (!currentStep) {
      return [];
    }

    return Object.keys(currentStep.transitions).filter((action) => {
      const result = this.canTransition(definition, state, action, context);
      return result.allowed;
    });
  }

  transition(
    definition: StateMachineDefinition,
    state: StateMachineState,
    action: string,
    context: TransitionContext
  ): TransitionResult {
    const validation = this.canTransition(definition, state, action, context);
    if (!validation.allowed) {
      return {
        success: false,
        previousStepKey: state.currentStepKey,
        currentStepKey: state.currentStepKey,
        status: state.status,
        error: validation.reason,
      };
    }

    const currentStep = definition.steps[state.currentStepKey];
    if (!currentStep) {
      return {
        success: false,
        previousStepKey: state.currentStepKey,
        currentStepKey: state.currentStepKey,
        status: state.status,
        error: `Current step ${state.currentStepKey} not found`,
      };
    }
    const transition = currentStep.transitions[action];
    if (!transition) {
      return {
        success: false,
        previousStepKey: state.currentStepKey,
        currentStepKey: state.currentStepKey,
        status: state.status,
        error: `Transition for action ${action} not found`,
      };
    }
    const targetStepKey =
      typeof transition === 'string' ? transition : transition.targetStepKey;
    const targetStep = definition.steps[targetStepKey];

    if (!targetStep) {
      return {
        success: false,
        previousStepKey: state.currentStepKey,
        currentStepKey: state.currentStepKey,
        status: state.status,
        error: `Target step ${targetStepKey} not found`,
      };
    }

    // Determine new status
    let newStatus: StateMachineState['status'] = 'RUNNING';
    if (targetStep.type === 'END') {
      newStatus = 'COMPLETED';
    } else if (targetStep.type === 'APPROVAL' || targetStep.type === 'WAIT') {
      newStatus = 'WAITING';
    }

    return {
      success: true,
      previousStepKey: state.currentStepKey,
      currentStepKey: targetStepKey,
      status: newStatus,
    };
  }

  evaluateCondition(
    expression: string,
    contextData: Record<string, unknown>
  ): boolean {
    // Basic condition evaluation
    // In production, this should use a proper expression language
    try {
      // Simple property checks like "amount > 1000"
      const match = expression.match(
        /^(\w+)\s*(>=|<=|>|<|===|!==|==|!=)\s*(.+)$/
      );
      if (match) {
        const [, prop, operator, value] = match;
        if (!prop || !operator || value === undefined) {
          return false;
        }
        const propValue = contextData[prop];
        const compareValue = JSON.parse(value);

        switch (operator) {
          case '>':
            return Number(propValue) > Number(compareValue);
          case '<':
            return Number(propValue) < Number(compareValue);
          case '>=':
            return Number(propValue) >= Number(compareValue);
          case '<=':
            return Number(propValue) <= Number(compareValue);
          case '===':
          case '==':
            return propValue === compareValue;
          case '!==':
          case '!=':
            return propValue !== compareValue;
        }
      }

      // Check for boolean property
      if (expression in contextData) {
        return Boolean(contextData[expression]);
      }

      return false;
    } catch {
      return false;
    }
  }
}

/**
 * Create a new state machine engine instance.
 */
export function createStateMachineEngine(): IStateMachineEngine {
  return new BasicStateMachineEngine();
}

// ============ Utility Functions ============

/**
 * Build a state machine definition from workflow entities.
 */
export function buildStateMachineDefinition(
  workflow: {
    key: string;
    name: string;
    version: number;
    initialStepId: string | null;
  },
  steps: {
    key: string;
    name: string;
    type: string;
    transitions: Record<string, string | TransitionDefinition>;
    approvalMode?: string;
    approverRoles?: string[];
    timeoutSeconds?: number;
    conditionExpression?: string;
  }[]
): StateMachineDefinition {
  const stepMap: Record<string, StateMachineStep> = {};

  for (const step of steps) {
    stepMap[step.key] = {
      key: step.key,
      name: step.name,
      type: step.type as StateMachineStep['type'],
      transitions: step.transitions,
      approvalMode: step.approvalMode as StateMachineStep['approvalMode'],
      allowedRoles: step.approverRoles,
      timeoutSeconds: step.timeoutSeconds,
      conditionExpression: step.conditionExpression,
    };
  }

  // Find initial step
  const startStep = steps.find((s) => s.type === 'START');
  const initialStepKey = startStep?.key ?? steps[0]?.key ?? '';

  return {
    key: workflow.key,
    name: workflow.name,
    version: workflow.version,
    initialStepKey,
    steps: stepMap,
  };
}

/**
 * Create initial state for a new workflow instance.
 */
export function createInitialState(
  definition: StateMachineDefinition,
  contextData: Record<string, unknown> = {}
): StateMachineState {
  return {
    currentStepKey: definition.initialStepKey,
    status: 'RUNNING',
    contextData,
    history: [],
  };
}
