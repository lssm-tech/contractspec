import type {
	RegistryTemplate,
	TemplateId,
} from '@contractspec/lib.example-shared-ui';
import { supportsInlineExamplePreview } from '@contractspec/module.examples';
import type { LocalTemplateCatalogItem } from './template-catalog';

export type TemplatePreviewAction =
	| { kind: 'modal'; templateId: TemplateId }
	| { kind: 'sandbox'; href: string }
	| { kind: 'disabled' };

export type LocalTemplatePreviewAction = Exclude<
	TemplatePreviewAction,
	{ kind: 'disabled' }
>;

export function supportsInlineTemplatePreview(templateId: TemplateId): boolean {
	return supportsInlineExamplePreview(templateId);
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
