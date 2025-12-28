import type { WorkflowSpec } from '@contractspec/lib.contracts';
import type { WorkflowExtension } from './types';

export interface WorkflowExtensionValidationIssue {
  code: string;
  message: string;
}

export function validateExtension(
  extension: WorkflowExtension,
  base: WorkflowSpec
) {
  const issues: WorkflowExtensionValidationIssue[] = [];
  const stepIds = new Set(base.definition.steps.map((step) => step.id));

  extension.customSteps?.forEach((injection, idx) => {
    if (!injection.inject.id) {
      issues.push({
        code: 'workflow.extension.step.id',
        message: `customSteps[${idx}] is missing an id`,
      });
    }

    if (!injection.after && !injection.before) {
      issues.push({
        code: 'workflow.extension.step.anchor',
        message: `customSteps[${idx}] must set after or before`,
      });
    }

    if (injection.after && !stepIds.has(injection.after)) {
      issues.push({
        code: 'workflow.extension.step.after',
        message: `customSteps[${idx}] references unknown step "${injection.after}"`,
      });
    }

    if (injection.before && !stepIds.has(injection.before)) {
      issues.push({
        code: 'workflow.extension.step.before',
        message: `customSteps[${idx}] references unknown step "${injection.before}"`,
      });
    }
  });

  extension.hiddenSteps?.forEach((stepId) => {
    if (!stepIds.has(stepId)) {
      issues.push({
        code: 'workflow.extension.hidden-step',
        message: `hidden step "${stepId}" does not exist`,
      });
    }
  });

  if (issues.length) {
    const reason = issues
      .map((issue) => `${issue.code}: ${issue.message}`)
      .join('; ');
    throw new Error(
      `Invalid workflow extension for ${extension.workflow}: ${reason}`
    );
  }
}
