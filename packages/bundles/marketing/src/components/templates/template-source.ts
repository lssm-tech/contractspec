export type TemplateSource = 'local' | 'registry';

export function isRegistryConfigured(
	registryUrl: string | null | undefined
): boolean {
	return Boolean(registryUrl?.trim());
}

export function getAvailableTemplateSources(
	registryUrl: string | null | undefined
): readonly TemplateSource[] {
	return isRegistryConfigured(registryUrl) ? ['local', 'registry'] : ['local'];
}
