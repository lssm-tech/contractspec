import type {
	RegistryTemplate,
	TemplateId,
} from '@contractspec/lib.example-shared-ui';
import type { LocalTemplateCatalogItem } from './template-catalog';

export type TemplatePreviewAction =
	| { kind: 'modal'; templateId: TemplateId }
	| { kind: 'sandbox'; href: string }
	| { kind: 'disabled' };

export type LocalTemplatePreviewAction = Exclude<
	TemplatePreviewAction,
	{ kind: 'disabled' }
>;

export const INLINE_TEMPLATE_PREVIEW_IDS = [
	'agent-console',
	'ai-chat-assistant',
	'analytics-dashboard',
	'crm-pipeline',
	'data-grid-showcase',
	'integration-hub',
	'marketplace',
	'saas-boilerplate',
	'visualization-showcase',
	'workflow-system',
] as const;

const INLINE_TEMPLATE_PREVIEW_SET = new Set<string>(
	INLINE_TEMPLATE_PREVIEW_IDS
);

export function supportsInlineTemplatePreview(templateId: TemplateId): boolean {
	return INLINE_TEMPLATE_PREVIEW_SET.has(templateId);
}

export function getLocalTemplatePreviewAction(
	template: LocalTemplateCatalogItem
): LocalTemplatePreviewAction {
	if (supportsInlineTemplatePreview(template.id)) {
		return { kind: 'modal', templateId: template.id };
	}

	return { kind: 'sandbox', href: template.previewUrl };
}

export function getRegistryTemplatePreviewAction(
	template: RegistryTemplate,
	localTemplate?: LocalTemplateCatalogItem
): TemplatePreviewAction {
	if (!localTemplate) {
		return { kind: 'disabled' };
	}

	return getLocalTemplatePreviewAction(localTemplate);
}
