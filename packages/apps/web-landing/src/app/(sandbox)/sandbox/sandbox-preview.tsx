import { supportsInlineExamplePreview } from '@contractspec/module.examples/catalog';

const CORE_RICH_SANDBOX_TEMPLATE_IDS = new Set<string>([
	'todos-app',
	'messaging-app',
	'recipe-app-i18n',
]);

export function hasRichSandboxPreview(templateId: string): boolean {
	return (
		CORE_RICH_SANDBOX_TEMPLATE_IDS.has(templateId) ||
		supportsInlineExamplePreview(templateId)
	);
}
