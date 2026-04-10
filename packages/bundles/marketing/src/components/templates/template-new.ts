export const NEW_TEMPLATE_IDS = [
	'minimal',
	'messaging-agent-actions',
	'policy-safe-knowledge-assistant',
	'visualization-showcase',
] as const;

const NEW_TEMPLATE_ID_SET = new Set<string>(NEW_TEMPLATE_IDS);

export function isNewTemplateId(templateId: string): boolean {
	return NEW_TEMPLATE_ID_SET.has(templateId);
}
