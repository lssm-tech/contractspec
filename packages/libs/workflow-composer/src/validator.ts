import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
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
  const baseStepIds = new Set(base.definition.steps.map((step) => step.id));

  if (!extension.workflow.trim()) {
    issues.push({
      code: 'workflow.extension.workflow',
      message: 'workflow is required',
    });
  }

  if (extension.workflow !== base.meta.key) {
    issues.push({
      code: 'workflow.extension.workflow.mismatch',
      message: `extension targets "${extension.workflow}" but base workflow is "${base.meta.key}"`,
    });
  }

  const hiddenSteps = new Set(extension.hiddenSteps ?? []);
  hiddenSteps.forEach((stepId) => {
    if (!baseStepIds.has(stepId)) {
      issues.push({
        code: 'workflow.extension.hidden-step',
        message: `hidden step "${stepId}" does not exist`,
      });
    }
  });

  const availableAnchorSteps = new Set(
    [...baseStepIds].filter((stepId) => !hiddenSteps.has(stepId))
  );

  extension.customSteps?.forEach((injection, idx) => {
    const injectionId = injection.inject.id?.trim();
    if (!injectionId) {
      issues.push({
        code: 'workflow.extension.step.id',
        message: `customSteps[${idx}] is missing an id`,
      });
      return;
    }

    if (injection.id && injection.id !== injectionId) {
      issues.push({
        code: 'workflow.extension.step.id-mismatch',
        message: `customSteps[${idx}] has mismatched id (id="${injection.id}", inject.id="${injectionId}")`,
      });
    }

    if (availableAnchorSteps.has(injectionId)) {
      issues.push({
        code: 'workflow.extension.step.id.duplicate',
        message: `customSteps[${idx}] injects duplicate step id "${injectionId}"`,
      });
    }

    if (injection.after && injection.before) {
      issues.push({
        code: 'workflow.extension.step.anchor.multiple',
        message: `customSteps[${idx}] cannot set both after and before`,
      });
    }

    if (!injection.after && !injection.before) {
      issues.push({
        code: 'workflow.extension.step.anchor',
        message: `customSteps[${idx}] must set after or before`,
      });
    }

    if (injection.after && !availableAnchorSteps.has(injection.after)) {
      issues.push({
        code: 'workflow.extension.step.after',
        message: `customSteps[${idx}] references unknown step "${injection.after}"`,
      });
    }

    if (injection.before && !availableAnchorSteps.has(injection.before)) {
      issues.push({
        code: 'workflow.extension.step.before',
        message: `customSteps[${idx}] references unknown step "${injection.before}"`,
      });
    }

    if (
      injection.transitionFrom &&
      !availableAnchorSteps.has(injection.transitionFrom)
    ) {
      issues.push({
        code: 'workflow.extension.step.transition-from',
        message: `customSteps[${idx}] references unknown transitionFrom step "${injection.transitionFrom}"`,
      });
    }

    if (
      injection.transitionTo &&
      !availableAnchorSteps.has(injection.transitionTo)
    ) {
      issues.push({
        code: 'workflow.extension.step.transition-to',
        message: `customSteps[${idx}] references unknown transitionTo step "${injection.transitionTo}"`,
      });
    }

    availableAnchorSteps.add(injectionId);
  });

  const entryStepId =
    base.definition.entryStepId ?? base.definition.steps[0]?.id;
  if (entryStepId && hiddenSteps.has(entryStepId)) {
    issues.push({
      code: 'workflow.extension.hidden-step.entry',
      message: `hiddenSteps removes the entry step "${entryStepId}"`,
    });
  }

  if (issues.length) {
    const reason = issues
      .map((issue) => `${issue.code}: ${issue.message}`)
      .join('; ');
    throw new Error(
      `Invalid workflow extension for ${extension.workflow}: ${reason}`
    );
  }
}
