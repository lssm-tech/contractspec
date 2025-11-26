import type {
  Step,
  StepAction,
  StepType,
} from '@lssm/lib.contracts/workflow/spec';

export interface StepTemplateOptions {
  id: string;
  label: string;
  type?: StepType;
  description?: string;
  action?: StepAction;
  guardExpression?: string;
}

export function approvalStepTemplate(options: StepTemplateOptions): Step {
  return {
    id: options.id,
    label: options.label,
    type: options.type ?? 'human',
    description: options.description ?? 'Tenant-specific approval',
    action: options.action,
    guard: options.guardExpression
      ? {
          type: 'expression',
          value: options.guardExpression,
        }
      : undefined,
  };
}










