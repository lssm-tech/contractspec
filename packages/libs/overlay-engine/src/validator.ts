import type { OverlayModification, OverlaySpec } from './spec';

export interface OverlayValidationIssue {
  code: string;
  message: string;
  path?: string[];
}

export interface OverlayValidationResult {
  valid: boolean;
  issues: OverlayValidationIssue[];
}

export type OverlayValidator = (spec: OverlaySpec) => OverlayValidationResult;

const TARGET_KEYS = [
  'capability',
  'workflow',
  'dataView',
  'presentation',
  'operation',
] as const;

export const defaultOverlayValidator: OverlayValidator = (spec) =>
  validateOverlaySpec(spec);

export function validateOverlaySpec(
  spec: OverlaySpec
): OverlayValidationResult {
  const issues: OverlayValidationIssue[] = [];

  if (!spec.overlayId?.trim()) {
    issues.push({
      code: 'overlay.id',
      message: 'overlayId is required',
      path: ['overlayId'],
    });
  }

  if (!spec.version?.trim()) {
    issues.push({
      code: 'overlay.version',
      message: 'version is required',
      path: ['version'],
    });
  }

  const hasTarget = TARGET_KEYS.some((key) => {
    const value = spec.appliesTo?.[key as keyof typeof spec.appliesTo];
    return typeof value === 'string' && value.trim().length > 0;
  });

  if (!hasTarget) {
    issues.push({
      code: 'overlay.target',
      message:
        'Overlay must specify at least one target (capability, workflow, dataView, presentation, or operation).',
      path: ['appliesTo'],
    });
  }

  if (!spec.modifications?.length) {
    issues.push({
      code: 'overlay.modifications.empty',
      message: 'Overlay must include at least one modification.',
      path: ['modifications'],
    });
  } else {
    spec.modifications.forEach((mod, idx) => {
      const path = ['modifications', String(idx)];
      validateModification(mod, path, issues);
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function validateModification(
  modification: OverlayModification,
  path: string[],
  issues: OverlayValidationIssue[]
) {
  const push = (code: string, message: string, extraPath?: string[]) => {
    issues.push({
      code,
      message,
      path: extraPath ? [...path, ...extraPath] : path,
    });
  };

  if (isFieldModification(modification)) {
    if (!modification.field?.trim()) {
      push('overlay.mod.field', 'field is required for this modification', [
        'field',
      ]);
    }
  }

  switch (modification.type) {
    case 'renameLabel': {
      if (!modification.newLabel?.trim()) {
        push('overlay.mod.renameLabel.newLabel', 'newLabel is required', [
          'newLabel',
        ]);
      }
      break;
    }
    case 'reorderFields': {
      if (!modification.fields?.length) {
        push(
          'overlay.mod.reorderFields.fields',
          'fields list cannot be empty',
          ['fields']
        );
      }
      const seen = new Set<string>();
      for (const field of modification.fields ?? []) {
        if (!field?.trim()) {
          push(
            'overlay.mod.reorderFields.fields.blank',
            'fields entries must be non-empty'
          );
          break;
        }
        if (seen.has(field)) {
          push(
            'overlay.mod.reorderFields.fields.duplicate',
            `field "${field}" was listed multiple times`
          );
          break;
        }
        seen.add(field);
      }
      break;
    }
    case 'setDefault': {
      if (modification.value === undefined) {
        push('overlay.mod.setDefault.value', 'value is required', ['value']);
      }
      break;
    }
    case 'addHelpText': {
      if (!modification.text?.trim()) {
        push('overlay.mod.addHelpText.text', 'text is required', ['text']);
      }
      break;
    }
    case 'makeRequired':
    case 'hideField':
      // no extra validation
      break;
    default: {
      const exhaustive: never = modification;
      throw new Error(
        `Unsupported overlay modification ${(exhaustive as { type: string })?.type ?? 'unknown'}`
      );
    }
  }
}

function isFieldModification(
  mod: OverlayModification
): mod is Extract<OverlayModification, { field: string }> {
  return 'field' in mod;
}

export function assertOverlayValid(
  spec: OverlaySpec,
  validator: OverlayValidator = defaultOverlayValidator
) {
  const result = validator(spec);
  if (!result.valid) {
    const message = result.issues
      .map((issue) => `${issue.code}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid OverlaySpec "${spec.overlayId}": ${message}`);
  }
}
