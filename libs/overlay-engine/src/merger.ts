import type { SignedOverlaySpec } from './spec';
import type { OverlayRenderable, OverlayRenderableField } from './types';

export interface ApplyOverlayOptions {
  strict?: boolean;
}

interface FieldState<TField extends OverlayRenderableField> {
  key: string;
  field: TField;
  hidden: boolean;
}

export function applyOverlayModifications<T extends OverlayRenderable>(
  target: T,
  overlays: SignedOverlaySpec[],
  options: ApplyOverlayOptions = {}
): T {
  if (!overlays.length) {
    return target;
  }

  const states = target.fields.map<FieldState<OverlayRenderableField>>(
    (field) => ({
      key: field.key,
      field: { ...field },
      hidden: field.visible === false,
    })
  );

  const fieldMap = new Map(states.map((state) => [state.key, state]));
  let orderSequence = target.fields.map((field) => field.key);

  const handleMissing = (field: string, overlayId: string) => {
    if (options.strict) {
      throw new Error(
        `Overlay "${overlayId}" referenced unknown field "${field}".`
      );
    }
  };

  overlays.forEach((overlay) => {
    overlay.modifications.forEach((modification) => {
      switch (modification.type) {
        case 'hideField': {
          const state = fieldMap.get(modification.field);
          if (!state)
            return handleMissing(modification.field, overlay.overlayId);
          state.hidden = true;
          state.field.visible = false;
          break;
        }
        case 'renameLabel': {
          const state = fieldMap.get(modification.field);
          if (!state)
            return handleMissing(modification.field, overlay.overlayId);
          state.field.label = modification.newLabel;
          break;
        }
        case 'setDefault': {
          const state = fieldMap.get(modification.field);
          if (!state)
            return handleMissing(modification.field, overlay.overlayId);
          state.field.defaultValue = modification.value;
          break;
        }
        case 'addHelpText': {
          const state = fieldMap.get(modification.field);
          if (!state)
            return handleMissing(modification.field, overlay.overlayId);
          state.field.helpText = modification.text;
          break;
        }
        case 'makeRequired': {
          const state = fieldMap.get(modification.field);
          if (!state)
            return handleMissing(modification.field, overlay.overlayId);
          state.field.required = modification.required ?? true;
          break;
        }
        case 'reorderFields': {
          const { filtered, missing } = normalizeOrderList(
            modification.fields,
            fieldMap
          );
          if (missing.length && options.strict) {
            missing.forEach((field) => handleMissing(field, overlay.overlayId));
          }
          orderSequence = applyReorder(orderSequence, filtered);
          break;
        }
        default:
          break;
      }
    });
  });

  const visibleFields: OverlayRenderableField[] = [];
  const seen = new Set<string>();
  orderSequence.forEach((key) => {
    const state = fieldMap.get(key);
    if (!state || state.hidden) {
      return;
    }
    seen.add(key);
    visibleFields.push(state.field);
  });

  // Handle any fields introduced dynamically that were not part of the original sequence.
  states.forEach((state) => {
    if (state.hidden || seen.has(state.key)) {
      return;
    }
    visibleFields.push(state.field);
  });

  visibleFields.forEach((field, index) => {
    field.order = index;
    field.visible = true;
  });

  return {
    ...(target as T),
    fields: visibleFields as T['fields'],
  };
}

function normalizeOrderList(
  fields: string[],
  fieldMap: Map<string, FieldState<OverlayRenderableField>>
): { filtered: string[]; missing: string[] } {
  const filtered: string[] = [];
  const missing: string[] = [];
  const seen = new Set<string>();

  fields.forEach((field) => {
    if (!field?.trim()) {
      return;
    }
    if (!fieldMap.has(field)) {
      missing.push(field);
      return;
    }
    if (seen.has(field)) {
      return;
    }
    seen.add(field);
    filtered.push(field);
  });

  return { filtered, missing };
}

function applyReorder(sequence: string[], orderedFields: string[]): string[] {
  if (!orderedFields.length) {
    return sequence;
  }
  const orderedSet = new Set(orderedFields);
  const remainder = sequence.filter((key) => !orderedSet.has(key));
  return [...orderedFields, ...remainder];
}
