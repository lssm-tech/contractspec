import {
	FormShowcaseAllFieldsForm,
	FormShowcaseProgressiveStepsForm,
} from '../forms';
import {
	allFieldsDefaultValues,
	progressiveDefaultValues,
} from './form-showcase-preview.data';

interface FieldNode {
	kind: string;
	fields?: readonly FieldNode[];
	of?: FieldNode;
}

export interface SectionPreview {
	key: string;
	titleI18n?: string;
	descriptionI18n?: string;
	fieldNames: readonly string[];
}

export interface ActionPreview {
	key: string;
	labelI18n: string;
}

function collectFieldKinds(fields: readonly FieldNode[]): string[] {
	return fields.flatMap((field) => [
		field.kind,
		...(field.fields ? collectFieldKinds(field.fields) : []),
		...(field.of ? collectFieldKinds([field.of]) : []),
	]);
}

const allFieldsFlow = FormShowcaseAllFieldsForm.layout?.flow;
const progressiveFlow = FormShowcaseProgressiveStepsForm.layout?.flow;

export const fieldKinds = Array.from(
	new Set(
		collectFieldKinds(FormShowcaseAllFieldsForm.fields as readonly FieldNode[])
	)
);

export const allFieldSections: readonly SectionPreview[] =
	allFieldsFlow?.kind === 'sections'
		? (allFieldsFlow.sections as readonly SectionPreview[])
		: [];

export const progressiveSteps: readonly SectionPreview[] =
	progressiveFlow?.kind === 'steps'
		? (progressiveFlow.sections as readonly SectionPreview[])
		: [];

export const progressiveActions: readonly ActionPreview[] =
	(FormShowcaseProgressiveStepsForm.actions as readonly ActionPreview[]) ?? [];

export const allFieldSampleValues = [
	['Email', allFieldsDefaultValues.email],
	['Role', allFieldsDefaultValues.role],
	['Reviewer', allFieldsDefaultValues.reviewer.name],
	['Contacts', `${allFieldsDefaultValues.contacts.length} rows`],
] as const;

export const progressiveSampleValues = [
	['Company', progressiveDefaultValues.companyName],
	['Slug', progressiveDefaultValues.workspaceSlug],
	['Plan', progressiveDefaultValues.plan],
	['Security', 'Conditional notes enabled'],
] as const;
