import type {
	ExamplePreviewFilter,
	ExamplePreviewStats,
} from '@/components/examples/ExamplePreviewControls';
import {
	getNativeExamplePreview,
	type NativeExamplePreviewDefinition,
} from '@/examples/native-preview-registry';
import type { MobileExamplePreviewItem } from '@/handlers';

export interface MobileExamplePreviewRow {
	example: MobileExamplePreviewItem;
	preview: NativeExamplePreviewDefinition | undefined;
}

export function buildMobileExampleRows({
	examples,
	filter,
	search,
}: {
	examples: MobileExamplePreviewItem[];
	filter: ExamplePreviewFilter;
	search: string;
}): MobileExamplePreviewRow[] {
	const query = search.trim().toLowerCase();

	return examples
		.map((example) => ({
			example,
			preview: getNativeExamplePreview(example.key),
		}))
		.filter(({ example, preview }) => {
			if (filter === 'rich' && !preview?.rich) return false;
			if (filter === 'web-ui' && !example.supportsInlinePreview) return false;
			if (filter === 'generic' && preview?.rich) return false;
			if (!query) return true;
			return getExampleSearchText(example).includes(query);
		})
		.sort((a, b) => a.example.title.localeCompare(b.example.title));
}

export function buildMobileExampleStats(
	examples: MobileExamplePreviewItem[]
): ExamplePreviewStats {
	const rich = examples.filter(
		(example) => getNativeExamplePreview(example.key)?.rich
	).length;

	return {
		generic: examples.length - rich,
		rich,
		total: examples.length,
		webUi: examples.filter((example) => example.supportsInlinePreview).length,
	};
}

function getExampleSearchText(example: MobileExamplePreviewItem): string {
	return [
		example.title,
		example.summary,
		example.packageName,
		example.visibility,
		example.stability,
		...example.tags,
	]
		.join(' ')
		.toLowerCase();
}
