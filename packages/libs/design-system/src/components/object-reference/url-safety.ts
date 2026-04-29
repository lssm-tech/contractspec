export const SAFE_OBJECT_REFERENCE_PROTOCOLS = new Set([
	'http:',
	'https:',
	'mailto:',
	'tel:',
	'geo:',
]);

export function normalizeSafeObjectReferenceHref(
	href: string | undefined
): string | null {
	const trimmed = href?.trim();
	if (!trimmed) return null;

	if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
		return trimmed;
	}
	if (trimmed.startsWith('#')) {
		return trimmed;
	}

	try {
		const url = new URL(trimmed);
		return SAFE_OBJECT_REFERENCE_PROTOCOLS.has(url.protocol)
			? url.toString()
			: null;
	} catch {
		return null;
	}
}
