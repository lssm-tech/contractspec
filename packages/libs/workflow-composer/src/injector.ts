import type { WorkflowSpec } from '@contractspec/lib.contracts';
import type { WorkflowExtension, StepInjection } from './types';
import { validateExtension } from './validator';

export function applyWorkflowExtension(
  base: WorkflowSpec,
  extension: WorkflowExtension
): WorkflowSpec {
  validateExtension(extension, base);
  const spec = cloneWorkflowSpec(base);

  const steps = [...spec.definition.steps];
  let transitions = [...spec.definition.transitions];

  const hiddenSet = new Set(extension.hiddenSteps ?? []);

  hiddenSet.forEach((stepId) => {
    const idx = steps.findIndex((step) => step.id === stepId);
    if (idx !== -1) {
      steps.splice(idx, 1);
    }
  });

  if (hiddenSet.size) {
    transitions = transitions.filter(
      (transition) =>
        !hiddenSet.has(transition.from) && !hiddenSet.has(transition.to)
    );
  }

  extension.customSteps?.forEach((injection) => {
    insertStep(steps, injection);
    wireTransitions(transitions, injection);
  });

  spec.definition.steps = steps;
  spec.definition.transitions = dedupeTransitions(transitions);
  spec.meta = {
    ...spec.meta,
    version: spec.meta.version,
  };
  return spec;
}

function insertStep(
  steps: WorkflowSpec['definition']['steps'],
  injection: StepInjection
) {
  const anchorIndex = resolveAnchorIndex(steps, injection);
  if (anchorIndex === -1) {
    throw new Error(`Unable to place injected step "${injection.inject.id}"`);
  }
  steps.splice(anchorIndex, 0, { ...injection.inject });
}

function resolveAnchorIndex(
  steps: WorkflowSpec['definition']['steps'],
  injection: StepInjection
) {
  if (injection.after) {
    const idx = steps.findIndex((step) => step.id === injection.after);
    return idx === -1 ? -1 : idx + 1;
  }
  if (injection.before) {
    const idx = steps.findIndex((step) => step.id === injection.before);
    return idx === -1 ? -1 : idx;
  }
  return steps.length;
}

function wireTransitions(
  transitions: WorkflowSpec['definition']['transitions'],
  injection: StepInjection
) {
  if (!injection.inject.id) return;

  if (injection.transitionFrom) {
    transitions.push({
      from: injection.transitionFrom,
      to: injection.inject.id,
      condition: injection.when,
    });
  }

  if (injection.transitionTo) {
    transitions.push({
      from: injection.inject.id,
      to: injection.transitionTo,
      condition: injection.when,
    });
  }
}

function dedupeTransitions(
  transitions: WorkflowSpec['definition']['transitions']
): WorkflowSpec['definition']['transitions'] {
  const seen = new Set<string>();
  const result: typeof transitions = [];
  transitions.forEach((transition) => {
    const key = `${transition.from}->${transition.to}:${transition.condition ?? ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push(transition);
  });
  return result;
}

function cloneWorkflowSpec(spec: WorkflowSpec): WorkflowSpec {
  return JSON.parse(JSON.stringify(spec));
}
