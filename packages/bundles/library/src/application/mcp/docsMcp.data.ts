import type { DocPresentationRoute } from '@contractspec/lib.contracts-spec/docs';
import { defaultDocRegistry } from '@contractspec/lib.contracts-spec/docs';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

type DocsSearchArgs = {
	query?: string;
	tag?: string | string[];
	visibility?: string;
	kind?: string;
	limit?: number;
	offset?: number;
};

function normalizeText(value: string | undefined | null) {
	return value?.trim().toLowerCase() ?? '';
}

function normalizeRoute(route: string) {
	const decoded = decodeURIComponent(route).trim();
	if (!decoded) return '/';
	return decoded.startsWith('/') ? decoded : `/${decoded}`;
}

function normalizeTags(value: string | string[] | undefined) {
	const tags = Array.isArray(value) ? value : value ? [value] : [];
	return tags.map((tag) => normalizeText(tag)).filter(Boolean);
}

function clampLimit(limit: number | undefined) {
	if (!limit || Number.isNaN(limit)) return DEFAULT_LIMIT;
	return Math.min(Math.max(limit, 1), MAX_LIMIT);
}

function clampOffset(offset: number | undefined) {
	if (!offset || Number.isNaN(offset)) return 0;
	return Math.max(offset, 0);
}

export function toDocSummary({ block, route }: DocPresentationRoute) {
	return {
		id: block.id,
		title: block.title,
		summary: block.summary ?? '',
		route,
		visibility: block.visibility ?? 'public',
		kind: block.kind ?? 'reference',
		version: block.version ?? '1.0.0',
		tags: block.tags ?? [],
	};
}

function scoreDoc(route: DocPresentationRoute, query: string) {
	if (!query) return 1;

	const tokens = query.split(/\s+/).filter(Boolean);
	const title = normalizeText(route.block.title);
	const id = normalizeText(route.block.id);
	const summary = normalizeText(route.block.summary);
	const body = normalizeText(route.block.body);
	const path = normalizeText(route.route);
	const tags = (route.block.tags ?? []).map((tag) => normalizeText(tag));
	const haystack = [title, id, summary, body, path, ...tags].join(' ');

	if (tokens.some((token) => !haystack.includes(token))) return 0;

	let score = 0;
	for (const token of tokens) {
		if (id.includes(token)) score += 8;
		if (title.includes(token)) score += 7;
		if (tags.some((tag) => tag.includes(token))) score += 5;
		if (summary.includes(token)) score += 4;
		if (path.includes(token)) score += 3;
		if (body.includes(token)) score += 2;
	}

	return score;
}

export function searchDocs(
	routes: DocPresentationRoute[],
	args: DocsSearchArgs
) {
	const query = normalizeText(
		typeof args.query === 'string' ? args.query : undefined
	);
	const tags = normalizeTags(args.tag as string | string[] | undefined);
	const visibility = normalizeText(
		typeof args.visibility === 'string' ? args.visibility : undefined
	);
	const kind = normalizeText(
		typeof args.kind === 'string' ? args.kind : undefined
	);
	const limit = clampLimit(
		typeof args.limit === 'number' ? args.limit : undefined
	);
	const offset = clampOffset(
		typeof args.offset === 'number' ? args.offset : undefined
	);

	const ranked = routes
		.map((route) => ({
			doc: toDocSummary(route),
			score: scoreDoc(route, query),
		}))
		.filter(({ doc, score }) => {
			const matchesQuery = query ? score > 0 : true;
			const matchesTags = tags.length
				? tags.every((tag) =>
						doc.tags.some((docTag) => normalizeText(docTag).includes(tag))
					)
				: true;
			const matchesVisibility = visibility
				? normalizeText(doc.visibility) === visibility
				: true;
			const matchesKind = kind ? normalizeText(doc.kind) === kind : true;
			return matchesQuery && matchesTags && matchesVisibility && matchesKind;
		})
		.sort((left, right) => {
			if (right.score !== left.score) return right.score - left.score;
			return left.doc.title.localeCompare(right.doc.title);
		});

	const docs = ranked.slice(offset, offset + limit).map(({ doc }) => doc);
	const nextOffset =
		offset + docs.length < ranked.length ? offset + docs.length : undefined;

	return {
		docs,
		items: docs,
		total: ranked.length,
		...(nextOffset != null ? { nextOffset } : {}),
	};
}

export function getDocById(id: string) {
	const normalizedId = decodeURIComponent(id);
	const found = defaultDocRegistry.get(normalizedId);
	if (!found) return undefined;

	return {
		doc: toDocSummary(found),
		content: String(found.block.body ?? ''),
	};
}

export function getDocByRoute(
	routes: DocPresentationRoute[],
	routePath: string
) {
	const normalizedPath = normalizeRoute(routePath);
	const found = routes.find(
		(route) => normalizeRoute(route.route) === normalizedPath
	);
	if (!found) return undefined;

	return {
		doc: toDocSummary(found),
		content: String(found.block.body ?? ''),
	};
}

export function listDocFacets(routes: DocPresentationRoute[]) {
	const tags = new Map<string, number>();
	const kinds = new Map<string, number>();
	const visibilities = new Map<string, number>();

	for (const route of routes) {
		const kind = route.block.kind ?? 'reference';
		const visibility = route.block.visibility ?? 'public';
		kinds.set(kind, (kinds.get(kind) ?? 0) + 1);
		visibilities.set(visibility, (visibilities.get(visibility) ?? 0) + 1);

		for (const tag of route.block.tags ?? []) {
			tags.set(tag, (tags.get(tag) ?? 0) + 1);
		}
	}

	const toEntries = (
		values: Map<string, number>,
		key: 'tag' | 'kind' | 'visibility'
	) =>
		[...values.entries()]
			.sort(
				(left, right) => right[1] - left[1] || left[0].localeCompare(right[0])
			)
			.map(([value, count]) => ({ [key]: value, count }));

	return {
		totalDocs: routes.length,
		tags: toEntries(tags, 'tag'),
		kinds: toEntries(kinds, 'kind'),
		visibilities: toEntries(visibilities, 'visibility'),
	};
}
