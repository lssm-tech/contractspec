'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import type { TemplateId } from '../../../../../templates/registry';

/**
 * Workflow step types
 */
export type StepType = 'action' | 'decision' | 'wait' | 'parallel' | 'end';

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  description?: string;
  next?: string | string[];
  condition?: string;
  timeout?: number;
  retries?: number;
  onError?: string;
}

/**
 * Workflow spec definition
 */
export interface WorkflowSpec {
  meta: {
    name: string;
    version: number;
    description?: string;
  };
  steps: WorkflowStep[];
  start: string;
  context?: Record<string, unknown>;
}

/**
 * Workflow extension scope
 */
export interface WorkflowExtensionScope {
  tenantId?: string;
  role?: string;
  device?: string;
}

/**
 * Step injection definition
 */
export interface StepInjection {
  id?: string;
  after?: string;
  before?: string;
  inject: WorkflowStep;
  when?: string;
  transitionTo?: string;
  transitionFrom?: string;
}

/**
 * Workflow extension definition
 */
export interface WorkflowExtension extends WorkflowExtensionScope {
  workflow: string;
  baseVersion?: number;
  priority?: number;
  customSteps?: StepInjection[];
  hiddenSteps?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Hook return type
 */
export interface UseWorkflowComposerReturn {
  /** Current composed workflow */
  workflow: WorkflowSpec | null;
  /** Available base workflows */
  baseWorkflows: WorkflowSpec[];
  /** Current extensions */
  extensions: WorkflowExtension[];
  /** Select a base workflow */
  selectWorkflow: (workflowName: string) => void;
  /** Add an extension */
  addExtension: (extension: WorkflowExtension) => void;
  /** Remove an extension */
  removeExtension: (workflowName: string, index: number) => void;
  /** Compose workflow with current extensions */
  compose: (scope?: WorkflowExtensionScope) => WorkflowSpec | null;
  /** Generate TypeScript code for the spec editor */
  generateSpecCode: () => string;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
}

/**
 * Hook for composing workflows in the sandbox.
 * Provides workflow selection, extension management, and code generation.
 */
export function useWorkflowComposer(
  templateId: TemplateId
): UseWorkflowComposerReturn {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [extensions, setExtensions] = useState<WorkflowExtension[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get base workflows for the template
  const baseWorkflows = useMemo(
    () => getTemplateWorkflows(templateId),
    [templateId]
  );

  // Auto-select first workflow
  useEffect(() => {
    const firstWorkflow = baseWorkflows[0];
    if (baseWorkflows.length > 0 && !selectedWorkflow && firstWorkflow) {
      setSelectedWorkflow(firstWorkflow.meta.name);
    }
  }, [baseWorkflows, selectedWorkflow]);

  // Get current base workflow
  const currentBase = useMemo(() => {
    return baseWorkflows.find((w) => w.meta.name === selectedWorkflow) ?? null;
  }, [baseWorkflows, selectedWorkflow]);

  /**
   * Compose workflow with extensions
   */
  const compose = useCallback(
    (scope?: WorkflowExtensionScope): WorkflowSpec | null => {
      if (!currentBase) return null;

      const applicableExtensions = extensions
        .filter((ext) => ext.workflow === currentBase.meta.name)
        .filter((ext) => matchesScope(ext, scope))
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

      if (applicableExtensions.length === 0) {
        return currentBase;
      }

      let composedWorkflow = { ...currentBase, steps: [...currentBase.steps] };

      for (const extension of applicableExtensions) {
        composedWorkflow = applyExtension(composedWorkflow, extension);
      }

      return composedWorkflow;
    },
    [currentBase, extensions]
  );

  // Current composed workflow
  const workflow = useMemo(() => compose(), [compose]);

  /**
   * Select a base workflow
   */
  const selectWorkflow = useCallback((workflowName: string) => {
    setSelectedWorkflow(workflowName);
  }, []);

  /**
   * Add an extension
   */
  const addExtension = useCallback((extension: WorkflowExtension) => {
    setExtensions((prev) => [...prev, extension]);
  }, []);

  /**
   * Remove an extension
   */
  const removeExtension = useCallback(
    (workflowName: string, index: number) => {
      setExtensions((prev) => {
        const forWorkflow = prev.filter((e) => e.workflow === workflowName);
        const others = prev.filter((e) => e.workflow !== workflowName);
        forWorkflow.splice(index, 1);
        return [...others, ...forWorkflow];
      });
    },
    []
  );

  /**
   * Generate TypeScript code for the spec editor
   */
  const generateSpecCode = useCallback((): string => {
    const composed = workflow;
    if (!composed) {
      return '// No workflow selected';
    }

    const stepsCode = composed.steps
      .map(
        (step) => `    {
      id: '${step.id}',
      name: '${step.name}',
      type: '${step.type}',${step.description ? `\n      description: '${step.description}',` : ''}${step.next ? `\n      next: ${JSON.stringify(step.next)},` : ''}${step.condition ? `\n      condition: '${step.condition}',` : ''}${step.timeout ? `\n      timeout: ${step.timeout},` : ''}${step.retries ? `\n      retries: ${step.retries},` : ''}${step.onError ? `\n      onError: '${step.onError}',` : ''}
    }`
      )
      .join(',\n');

    const extensionsCode =
      extensions.length > 0
        ? `

// Extensions applied:
${extensions
  .map(
    (ext) =>
      `// - ${ext.workflow} (priority: ${ext.priority ?? 0})${ext.customSteps?.length ? ` +${ext.customSteps.length} steps` : ''}${ext.hiddenSteps?.length ? ` -${ext.hiddenSteps.length} hidden` : ''}`
  )
  .join('\n')}`
        : '';

    return `// Workflow Spec: ${composed.meta.name} v${composed.meta.version}
// Generated from ${templateId} template
${extensionsCode}

import { workflowSpec } from '@lssm/lib.contracts/workflow';

export const ${toCamelCase(composed.meta.name)}Workflow = workflowSpec({
  meta: {
    name: '${composed.meta.name}',
    version: ${composed.meta.version},${composed.meta.description ? `\n    description: '${composed.meta.description}',` : ''}
  },
  start: '${composed.start}',
  steps: [
${stepsCode}
  ],${composed.context ? `\n  context: ${JSON.stringify(composed.context, null, 2)},` : ''}
});
`;
  }, [workflow, extensions, templateId]);

  return {
    workflow,
    baseWorkflows,
    extensions,
    selectWorkflow,
    addExtension,
    removeExtension,
    compose,
    generateSpecCode,
    loading,
    error,
  };
}

/**
 * Check if extension matches the scope
 */
function matchesScope(
  extension: WorkflowExtension,
  scope?: WorkflowExtensionScope
): boolean {
  if (!scope) return true;

  if (extension.tenantId && extension.tenantId !== scope.tenantId) {
    return false;
  }
  if (extension.role && extension.role !== scope.role) {
    return false;
  }
  if (extension.device && extension.device !== scope.device) {
    return false;
  }
  return true;
}

/**
 * Apply extension to workflow
 */
function applyExtension(
  workflow: WorkflowSpec,
  extension: WorkflowExtension
): WorkflowSpec {
  let steps = [...workflow.steps];

  // Hide steps
  if (extension.hiddenSteps) {
    steps = steps.filter((s) => !extension.hiddenSteps?.includes(s.id));
  }

  // Inject custom steps
  if (extension.customSteps) {
    for (const injection of extension.customSteps) {
      const stepToInject = {
        ...injection.inject,
        id: injection.id ?? injection.inject.id,
      };

      if (injection.after) {
        const afterIndex = steps.findIndex((s) => s.id === injection.after);
        if (afterIndex !== -1) {
          steps.splice(afterIndex + 1, 0, stepToInject);
        }
      } else if (injection.before) {
        const beforeIndex = steps.findIndex((s) => s.id === injection.before);
        if (beforeIndex !== -1) {
          steps.splice(beforeIndex, 0, stepToInject);
        }
      } else {
        steps.push(stepToInject);
      }
    }
  }

  return { ...workflow, steps };
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toLowerCase());
}

/**
 * Get template-specific workflows
 */
function getTemplateWorkflows(templateId: TemplateId): WorkflowSpec[] {
  const templateWorkflows: Record<string, WorkflowSpec[]> = {
    'crm-pipeline': [
      {
        meta: {
          name: 'deal.qualification',
          version: 1,
          description: 'Deal qualification workflow',
        },
        start: 'lead-received',
        steps: [
          {
            id: 'lead-received',
            name: 'Lead Received',
            type: 'action',
            description: 'New lead enters the pipeline',
            next: 'qualify-lead',
          },
          {
            id: 'qualify-lead',
            name: 'Qualify Lead',
            type: 'decision',
            description: 'Determine if lead meets qualification criteria',
            next: ['qualified', 'disqualified'],
            condition: 'lead.score >= threshold',
          },
          {
            id: 'qualified',
            name: 'Lead Qualified',
            type: 'action',
            next: 'assign-rep',
          },
          {
            id: 'disqualified',
            name: 'Lead Disqualified',
            type: 'end',
          },
          {
            id: 'assign-rep',
            name: 'Assign Sales Rep',
            type: 'action',
            next: 'complete',
          },
          {
            id: 'complete',
            name: 'Workflow Complete',
            type: 'end',
          },
        ],
      },
      {
        meta: {
          name: 'deal.closing',
          version: 1,
          description: 'Deal closing workflow',
        },
        start: 'proposal-sent',
        steps: [
          {
            id: 'proposal-sent',
            name: 'Proposal Sent',
            type: 'action',
            next: 'wait-response',
          },
          {
            id: 'wait-response',
            name: 'Wait for Response',
            type: 'wait',
            timeout: 604800000, // 7 days
            next: 'negotiate',
            onError: 'follow-up',
          },
          {
            id: 'follow-up',
            name: 'Follow Up',
            type: 'action',
            next: 'wait-response',
            retries: 3,
          },
          {
            id: 'negotiate',
            name: 'Negotiation',
            type: 'action',
            next: 'finalize',
          },
          {
            id: 'finalize',
            name: 'Finalize Deal',
            type: 'decision',
            next: ['won', 'lost'],
            condition: 'deal.accepted',
          },
          {
            id: 'won',
            name: 'Deal Won',
            type: 'end',
          },
          {
            id: 'lost',
            name: 'Deal Lost',
            type: 'end',
          },
        ],
      },
    ],
    'saas-boilerplate': [
      {
        meta: {
          name: 'user.onboarding',
          version: 1,
          description: 'User onboarding workflow',
        },
        start: 'signup',
        steps: [
          {
            id: 'signup',
            name: 'User Signup',
            type: 'action',
            next: 'verify-email',
          },
          {
            id: 'verify-email',
            name: 'Verify Email',
            type: 'wait',
            timeout: 86400000, // 24 hours
            next: 'profile-setup',
            onError: 'resend-verification',
          },
          {
            id: 'resend-verification',
            name: 'Resend Verification',
            type: 'action',
            next: 'verify-email',
            retries: 2,
          },
          {
            id: 'profile-setup',
            name: 'Setup Profile',
            type: 'action',
            next: 'onboarding-tour',
          },
          {
            id: 'onboarding-tour',
            name: 'Onboarding Tour',
            type: 'action',
            next: 'complete',
          },
          {
            id: 'complete',
            name: 'Onboarding Complete',
            type: 'end',
          },
        ],
      },
    ],
    'agent-console': [
      {
        meta: {
          name: 'agent.execution',
          version: 1,
          description: 'Agent execution workflow',
        },
        start: 'receive-task',
        steps: [
          {
            id: 'receive-task',
            name: 'Receive Task',
            type: 'action',
            next: 'plan-execution',
          },
          {
            id: 'plan-execution',
            name: 'Plan Execution',
            type: 'action',
            next: 'execute-steps',
          },
          {
            id: 'execute-steps',
            name: 'Execute Steps',
            type: 'parallel',
            next: ['tool-call', 'observe', 'reason'],
          },
          {
            id: 'tool-call',
            name: 'Tool Call',
            type: 'action',
            next: 'evaluate',
          },
          {
            id: 'observe',
            name: 'Observe',
            type: 'action',
            next: 'evaluate',
          },
          {
            id: 'reason',
            name: 'Reason',
            type: 'action',
            next: 'evaluate',
          },
          {
            id: 'evaluate',
            name: 'Evaluate Result',
            type: 'decision',
            condition: 'task.isComplete',
            next: ['complete', 'execute-steps'],
          },
          {
            id: 'complete',
            name: 'Task Complete',
            type: 'end',
          },
        ],
      },
    ],
    'todos-app': [
      {
        meta: {
          name: 'task.lifecycle',
          version: 1,
          description: 'Task lifecycle workflow',
        },
        start: 'created',
        steps: [
          {
            id: 'created',
            name: 'Task Created',
            type: 'action',
            next: 'in-progress',
          },
          {
            id: 'in-progress',
            name: 'In Progress',
            type: 'action',
            next: 'review',
          },
          {
            id: 'review',
            name: 'Review',
            type: 'decision',
            condition: 'task.approved',
            next: ['done', 'in-progress'],
          },
          {
            id: 'done',
            name: 'Done',
            type: 'end',
          },
        ],
      },
    ],
    'messaging-app': [
      {
        meta: {
          name: 'message.delivery',
          version: 1,
          description: 'Message delivery workflow',
        },
        start: 'compose',
        steps: [
          {
            id: 'compose',
            name: 'Compose Message',
            type: 'action',
            next: 'send',
          },
          {
            id: 'send',
            name: 'Send Message',
            type: 'action',
            next: 'deliver',
          },
          {
            id: 'deliver',
            name: 'Deliver',
            type: 'decision',
            condition: 'recipient.online',
            next: ['delivered', 'queue'],
          },
          {
            id: 'queue',
            name: 'Queue for Delivery',
            type: 'wait',
            next: 'deliver',
          },
          {
            id: 'delivered',
            name: 'Message Delivered',
            type: 'action',
            next: 'read',
          },
          {
            id: 'read',
            name: 'Message Read',
            type: 'end',
          },
        ],
      },
    ],
    'recipe-app-i18n': [
      {
        meta: {
          name: 'recipe.creation',
          version: 1,
          description: 'Recipe creation workflow',
        },
        start: 'draft',
        steps: [
          {
            id: 'draft',
            name: 'Draft Recipe',
            type: 'action',
            next: 'add-ingredients',
          },
          {
            id: 'add-ingredients',
            name: 'Add Ingredients',
            type: 'action',
            next: 'add-steps',
          },
          {
            id: 'add-steps',
            name: 'Add Steps',
            type: 'action',
            next: 'review',
          },
          {
            id: 'review',
            name: 'Review Recipe',
            type: 'decision',
            condition: 'recipe.isComplete',
            next: ['publish', 'draft'],
          },
          {
            id: 'publish',
            name: 'Publish Recipe',
            type: 'end',
          },
        ],
      },
    ],
  };

  return templateWorkflows[templateId] ?? [];
}

