export function formatPresentationName(name: string): string {
	const parts = name.split('.');
	const lastPart = parts[parts.length - 1] ?? name;

	return lastPart
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
