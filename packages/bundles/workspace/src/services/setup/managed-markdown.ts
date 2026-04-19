export interface ManagedMarkdownSectionConfig {
	startMarker: string;
	endMarker: string;
	note: string;
}

export function mergeManagedMarkdown(
	existingContent: string,
	managedContent: string,
	config: ManagedMarkdownSectionConfig,
	legacyContent?: string
): string {
	const managedBlock = renderManagedMarkdownBlock(managedContent, config);
	const managedBlockPattern = createManagedMarkdownPattern(config);

	if (managedBlockPattern.test(existingContent)) {
		return existingContent.replace(managedBlockPattern, managedBlock);
	}

	if (
		legacyContent &&
		normalizeMarkdownContent(existingContent) ===
			normalizeMarkdownContent(legacyContent)
	) {
		return managedBlock;
	}

	return `${managedBlock}${existingContent}`;
}

export function renderManagedMarkdownBlock(
	managedContent: string,
	config: ManagedMarkdownSectionConfig
): string {
	const normalizedContent = normalizeMarkdownContent(managedContent);
	return `${config.startMarker}
${config.note}
${normalizedContent}
${config.endMarker}
`;
}

export function normalizeMarkdownContent(content: string): string {
	return content.replace(/\r\n/g, '\n').trimEnd();
}

function createManagedMarkdownPattern(
	config: ManagedMarkdownSectionConfig
): RegExp {
	return new RegExp(
		`${escapeRegex(config.startMarker)}[\\s\\S]*?${escapeRegex(config.endMarker)}(?:\\r?\\n)?`
	);
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
