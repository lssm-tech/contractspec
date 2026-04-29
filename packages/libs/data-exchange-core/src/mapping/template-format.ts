import type { FormatProfile, ImportTemplateColumn } from '../types';

export function resolveColumnFormat(
	templateColumn: ImportTemplateColumn,
	formatProfile?: FormatProfile
) {
	return (
		formatProfile?.columns?.[templateColumn.targetField] ??
		formatProfile?.columns?.[templateColumn.key] ??
		templateColumn.format ??
		formatProfile?.defaultFormat
	);
}
