import type {
	FieldMapping,
	ReconciliationPolicy,
	ValidationIssue,
} from '../types';

export const defaultReconciliationPolicy: ReconciliationPolicy = {
	keyFields: ['id'],
	onMissing: 'create',
	onMatch: 'update',
	onExtra: 'ignore',
};

export function createPlanIssues(mappings: FieldMapping[]): ValidationIssue[] {
	const lowConfidenceMappings = mappings.filter(
		(mapping) => (mapping.confidence ?? 1) < 0.8
	);

	return lowConfidenceMappings.map((mapping) => ({
		severity: 'warning',
		code: 'mapping.low-confidence',
		message: `Low confidence mapping for ${mapping.sourceField} -> ${mapping.targetField}.`,
		fieldPath: mapping.targetField,
	}));
}
