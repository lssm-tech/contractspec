import type {
	DataExchangeTemplate,
	ExportTemplate,
	ImportTemplate,
} from '../types';

export function validateDataExchangeTemplate<
	Template extends DataExchangeTemplate,
>(template: Template): Template {
	const seenKeys = new Set<string>();
	const seenTargets = new Set<string>();
	for (const column of template.columns) {
		if (seenKeys.has(column.key)) {
			throw new Error(`Duplicate import template column key "${column.key}".`);
		}
		if (seenTargets.has(column.targetField)) {
			throw new Error(
				`Duplicate import template target field "${column.targetField}".`
			);
		}
		seenKeys.add(column.key);
		seenTargets.add(column.targetField);
	}
	return template;
}

export function defineDataExchangeTemplate<
	Template extends DataExchangeTemplate,
>(template: Template): Template {
	return validateDataExchangeTemplate(template);
}

export function defineImportTemplate(template: ImportTemplate): ImportTemplate {
	return defineDataExchangeTemplate(template);
}

export function defineExportTemplate(template: ExportTemplate): ExportTemplate {
	return defineDataExchangeTemplate(template);
}
