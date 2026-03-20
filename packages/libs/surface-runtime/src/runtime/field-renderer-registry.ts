/**
 * Field renderer registry for entity surfaces.
 * Registers core field kinds (text, number, date, select) and stubs for relation, rollup, formula, people.
 * Aligns with 08_entity_surface_and_custom_fields.md.
 */

import type { FieldRendererSpec } from '../spec/types';

/** Fallback field kind when unknown kind is requested. */
export const FALLBACK_FIELD_KIND = 'text';

/** Core field kinds with full renderer specs. */
const CORE_FIELD_KINDS: Record<string, FieldRendererSpec> = {
	text: {
		fieldKind: 'text',
		viewer: 'text-viewer',
		editor: 'text-editor',
		summaryViewer: 'text-summary',
		tableCell: 'text-cell',
		filters: ['contains', 'equals', 'startsWith', 'endsWith'],
		validators: ['required', 'maxLength', 'regex'],
	},
	number: {
		fieldKind: 'number',
		viewer: 'number-viewer',
		editor: 'number-editor',
		summaryViewer: 'number-summary',
		tableCell: 'number-cell',
		filters: ['equals', 'gt', 'gte', 'lt', 'lte', 'between'],
		validators: ['required', 'min', 'max', 'integer'],
	},
	date: {
		fieldKind: 'date',
		viewer: 'date-viewer',
		editor: 'date-editor',
		summaryViewer: 'date-summary',
		tableCell: 'date-cell',
		filters: ['equals', 'before', 'after', 'between'],
		validators: ['required', 'min', 'max'],
	},
	select: {
		fieldKind: 'select',
		viewer: 'select-viewer',
		editor: 'select-editor',
		summaryViewer: 'select-summary',
		tableCell: 'select-cell',
		filters: ['equals', 'in'],
		validators: ['required', 'oneOf'],
	},
	checkbox: {
		fieldKind: 'checkbox',
		viewer: 'checkbox-viewer',
		editor: 'checkbox-editor',
		summaryViewer: 'checkbox-summary',
		tableCell: 'checkbox-cell',
		filters: ['equals'],
		validators: ['required'],
	},
};

/** Stub field kinds (relation, rollup, formula, people, options, instance, url). Full renderers deferred. */
const STUB_FIELD_KINDS: Record<string, FieldRendererSpec> = {
	relation: {
		fieldKind: 'relation',
		viewer: 'relation-viewer-stub',
		summaryViewer: 'relation-chip-stub',
		tableCell: 'relation-chip-stub',
	},
	rollup: {
		fieldKind: 'rollup',
		viewer: 'rollup-viewer-stub',
		summaryViewer: 'rollup-chip-stub',
		tableCell: 'rollup-cell-stub',
	},
	formula: {
		fieldKind: 'formula',
		viewer: 'formula-viewer-stub',
		summaryViewer: 'formula-summary-stub',
		tableCell: 'formula-cell-stub',
	},
	people: {
		fieldKind: 'people',
		viewer: 'people-viewer-stub',
		editor: 'people-picker-stub',
		summaryViewer: 'people-chip-stub',
		tableCell: 'people-cell-stub',
	},
	options: {
		fieldKind: 'options',
		viewer: 'options-viewer-stub',
		editor: 'options-editor-stub',
		summaryViewer: 'options-chip-stub',
		tableCell: 'options-cell-stub',
	},
	instance: {
		fieldKind: 'instance',
		viewer: 'instance-viewer-stub',
		summaryViewer: 'instance-chip-stub',
		tableCell: 'instance-cell-stub',
	},
	url: {
		fieldKind: 'url',
		viewer: 'url-viewer',
		editor: 'url-editor',
		summaryViewer: 'url-summary',
		tableCell: 'url-cell',
		validators: ['required', 'regex'],
	},
};

/** Registry interface for field renderers. */
export interface FieldRendererRegistry {
	get(kind: string): FieldRendererSpec | undefined;
	has(kind: string): boolean;
	/** Returns spec or fallback for unknown kinds. */
	getOrFallback(kind: string): FieldRendererSpec;
}

/** Mutable registry that supports registerFieldRenderer. Aligns with 09_extension_and_override_model. */
export interface MutableFieldRendererRegistry extends FieldRendererRegistry {
	registerFieldRenderer(kind: string, entry: FieldRendererSpec): void;
}

/** Default field renderer registry with core kinds and stubs. */
export function createFieldRendererRegistry(): FieldRendererRegistry {
	const all = { ...CORE_FIELD_KINDS, ...STUB_FIELD_KINDS };
	const fallback = CORE_FIELD_KINDS[FALLBACK_FIELD_KIND];
	if (!fallback) {
		throw new Error(`Fallback field kind "${FALLBACK_FIELD_KIND}" not found`);
	}

	return {
		get(kind: string): FieldRendererSpec | undefined {
			return all[kind];
		},
		has(kind: string): boolean {
			return kind in all;
		},
		getOrFallback(kind: string): FieldRendererSpec {
			return all[kind] ?? fallback;
		},
	};
}

/** Creates a mutable field renderer registry. Extends base with registerFieldRenderer. */
export function createMutableFieldRendererRegistry(): MutableFieldRendererRegistry {
	const base = { ...CORE_FIELD_KINDS, ...STUB_FIELD_KINDS };
	const custom = new Map<string, FieldRendererSpec>();
	const fallback = CORE_FIELD_KINDS[FALLBACK_FIELD_KIND];
	if (!fallback) {
		throw new Error(`Fallback field kind "${FALLBACK_FIELD_KIND}" not found`);
	}

	return {
		get(kind: string): FieldRendererSpec | undefined {
			return custom.get(kind) ?? base[kind];
		},
		has(kind: string): boolean {
			return custom.has(kind) || kind in base;
		},
		getOrFallback(kind: string): FieldRendererSpec {
			return custom.get(kind) ?? base[kind] ?? fallback;
		},
		registerFieldRenderer(kind: string, entry: FieldRendererSpec): void {
			if (entry.fieldKind !== kind) {
				throw new Error(
					`Field renderer entry fieldKind "${entry.fieldKind}" must match kind "${kind}"`
				);
			}
			custom.set(kind, entry);
		},
	};
}
