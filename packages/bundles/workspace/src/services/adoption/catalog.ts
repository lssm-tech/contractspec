import { CORE_CATALOG_ENTRIES } from './catalog-core';
import { RUNTIME_CATALOG_ENTRIES } from './catalog-runtime';
import { SHARED_CATALOG_ENTRIES } from './catalog-shared';
import { SOLUTION_CATALOG_ENTRIES } from './catalog-solutions';
import { UI_CATALOG_ENTRIES } from './catalog-ui';
import type { AdoptionCatalogDocument, AdoptionCatalogEntry } from './types';

const CATALOG_ENTRIES: AdoptionCatalogEntry[] = [
	...UI_CATALOG_ENTRIES,
	...CORE_CATALOG_ENTRIES,
	...RUNTIME_CATALOG_ENTRIES,
	...SHARED_CATALOG_ENTRIES,
	...SOLUTION_CATALOG_ENTRIES,
];

export function getContractSpecAdoptionCatalog(): AdoptionCatalogEntry[] {
	return [...CATALOG_ENTRIES].sort(
		(left, right) => right.resolutionPriority - left.resolutionPriority
	);
}

export function createAdoptionCatalogDocument(
	now: Date = new Date()
): AdoptionCatalogDocument {
	return {
		version: 1,
		generatedAt: now.toISOString(),
		entries: getContractSpecAdoptionCatalog(),
	};
}
