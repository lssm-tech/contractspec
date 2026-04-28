import type { PageOutlineItem, PageOutlineLevel } from './types';

export type ResolvedPageOutlineItem = PageOutlineItem & {
	resolvedLevel: PageOutlineLevel;
};

export function resolvePageOutlineItems(
	items: PageOutlineItem[],
	maxLevel: PageOutlineLevel,
	parentLevel = 1
): ResolvedPageOutlineItem[] {
	return items.flatMap((item) => {
		const level = Math.min(
			item.level ?? parentLevel,
			maxLevel
		) as PageOutlineLevel;
		const current = { ...item, resolvedLevel: level };
		const children = item.children?.length
			? resolvePageOutlineItems(
					item.children,
					maxLevel,
					Math.min(level + 1, maxLevel) as PageOutlineLevel
				)
			: [];

		return [current, ...children];
	});
}
