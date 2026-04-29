import type {
	ImportTemplateColumn,
	InterchangeColumn,
	TemplateColumnMatch,
} from '../types';

function normalizeColumnKey(value: string): string {
	return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function sourceCandidates(column: InterchangeColumn): string[] {
	return [column.key, column.label, column.sourcePath].filter(Boolean);
}

function templateCandidates(column: ImportTemplateColumn): string[] {
	return [column.targetField, column.label, column.key].filter(Boolean);
}

function isNormalizedCandidateMatch(
	sourceValue: string,
	candidate: string
): boolean {
	if (sourceValue === candidate) return true;
	if (sourceValue.length < 4 || candidate.length < 4) return false;
	return sourceValue.includes(candidate) || candidate.includes(sourceValue);
}

export function findTemplateMatch(
	templateColumn: ImportTemplateColumn,
	sourceColumns: InterchangeColumn[],
	usedSourceFields: Set<string>
): TemplateColumnMatch | null {
	const candidates = templateCandidates(templateColumn);
	for (const sourceColumn of sourceColumns) {
		if (usedSourceFields.has(sourceColumn.key)) continue;
		const sourceValues = sourceCandidates(sourceColumn);
		if (sourceValues.some((sourceValue) => candidates.includes(sourceValue))) {
			return {
				templateColumnKey: templateColumn.key,
				targetField: templateColumn.targetField,
				sourceField: sourceColumn.key,
				confidence: 1,
				strategy: 'exact',
			};
		}
	}

	for (const sourceColumn of sourceColumns) {
		if (usedSourceFields.has(sourceColumn.key)) continue;
		const sourceValues = sourceCandidates(sourceColumn);
		const alias = templateColumn.sourceAliases?.find((candidate) =>
			sourceValues.includes(candidate)
		);
		if (alias) {
			return {
				templateColumnKey: templateColumn.key,
				targetField: templateColumn.targetField,
				sourceField: sourceColumn.key,
				confidence: 0.96,
				strategy: 'alias',
			};
		}
	}

	const normalizedCandidates = [
		...candidates,
		...(templateColumn.sourceAliases ?? []),
	].map(normalizeColumnKey);
	for (const sourceColumn of sourceColumns) {
		if (usedSourceFields.has(sourceColumn.key)) continue;
		const normalizedSources =
			sourceCandidates(sourceColumn).map(normalizeColumnKey);
		if (
			normalizedSources.some((sourceValue) =>
				normalizedCandidates.some((candidate) =>
					isNormalizedCandidateMatch(sourceValue, candidate)
				)
			)
		) {
			return {
				templateColumnKey: templateColumn.key,
				targetField: templateColumn.targetField,
				sourceField: sourceColumn.key,
				confidence: 0.9,
				strategy: 'normalized',
			};
		}
	}

	return null;
}
