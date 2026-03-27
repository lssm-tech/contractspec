import type {
	ExampleKind,
	ExampleSandboxMode,
	ExampleSpec,
} from '@contractspec/lib.contracts-spec/examples/types';
import type { Stability } from '@contractspec/lib.contracts-spec/ownership';
import type {
	TemplateDefinition,
	TemplateId,
} from '@contractspec/lib.example-shared-ui';
import { listExamples, listTemplates } from '@contractspec/module.examples';
import { isNewTemplateId, NEW_TEMPLATE_IDS } from './template-new';

export interface LocalTemplateCatalogItem {
	id: TemplateId;
	title: string;
	description: string;
	tags: string[];
	kind: ExampleKind;
	stability: Stability;
	previewUrl: string;
	featureList: string[];
	sandboxModes: readonly ExampleSandboxMode[];
	renderTargets: string[];
	isNew: boolean;
	packageName: string;
}

interface TemplateFilterCandidate {
	title: string;
	description: string;
	tags: readonly string[];
}

const NEW_TEMPLATE_INDEX = new Map<string, number>(
	NEW_TEMPLATE_IDS.map((templateId, index) => [templateId, index] as const)
);

export function buildLocalTemplateCatalog(
	examples: readonly ExampleSpec[] = listExamples(),
	templates: readonly TemplateDefinition[] = listTemplates()
): LocalTemplateCatalogItem[] {
	const templatesById = new Map(
		templates.map((template) => [template.id, template])
	);

	return examples
		.filter(
			(example) =>
				example.meta.visibility === 'public' && example.surfaces.templates
		)
		.map((example) => {
			const template = templatesById.get(example.meta.key);
			const tags = Array.from(
				new Set(example.meta.tags.map((tag) => tag.trim()).filter(Boolean))
			).sort((left, right) => left.localeCompare(right));

			return {
				id: example.meta.key,
				title: example.meta.title ?? template?.name ?? example.meta.key,
				description: example.meta.summary ?? example.meta.description,
				tags,
				kind: example.meta.kind,
				stability: example.meta.stability,
				previewUrl:
					template?.preview?.demoUrl ??
					`/sandbox?template=${encodeURIComponent(example.meta.key)}`,
				featureList: [...(template?.features ?? [])],
				sandboxModes: example.surfaces.sandbox.modes,
				renderTargets: [...(template?.renderTargets ?? [])],
				isNew: isNewTemplateId(example.meta.key),
				packageName: example.entrypoints.packageName,
			};
		})
		.sort(compareLocalTemplateCatalogItems);
}

export function matchesTemplateFilters(
	template: TemplateFilterCandidate,
	search: string,
	selectedTag: string | null
): boolean {
	const haystack = [
		template.title,
		template.description,
		template.tags.join(' '),
	]
		.join(' ')
		.toLowerCase();
	const searchTokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
	const matchesSearch =
		searchTokens.length === 0 ||
		searchTokens.every((token) => haystack.includes(token));
	const matchesTag =
		selectedTag === null || template.tags.includes(selectedTag);

	return matchesSearch && matchesTag;
}

export function formatExampleKindLabel(kind: ExampleKind): string {
	return kind
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function formatStabilityLabel(stability: Stability): string {
	return stability
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function compareLocalTemplateCatalogItems(
	left: LocalTemplateCatalogItem,
	right: LocalTemplateCatalogItem
): number {
	const leftNewIndex = NEW_TEMPLATE_INDEX.get(left.id);
	const rightNewIndex = NEW_TEMPLATE_INDEX.get(right.id);

	if (leftNewIndex !== undefined || rightNewIndex !== undefined) {
		if (leftNewIndex === undefined) {
			return 1;
		}
		if (rightNewIndex === undefined) {
			return -1;
		}
		return leftNewIndex - rightNewIndex;
	}

	return left.title.localeCompare(right.title);
}
