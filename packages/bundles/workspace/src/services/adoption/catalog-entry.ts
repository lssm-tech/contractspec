import type {
	AdoptionCatalogEntry,
	AdoptionFamily,
	AdoptionPackageKind,
} from './types';

export function createCatalogEntry(
	id: string,
	packageRef: string,
	family: AdoptionFamily,
	packageKind: AdoptionPackageKind,
	resolutionPriority: number,
	capabilityTags: string[],
	preferredUseCases: string[],
	description: string,
	options: Partial<
		Pick<
			AdoptionCatalogEntry,
			| 'avoidWhen'
			| 'platforms'
			| 'replacementImportHints'
			| 'runtimes'
			| 'title'
		>
	> = {}
): AdoptionCatalogEntry {
	return {
		id,
		source: 'contractspec',
		packageRef,
		family,
		packageKind,
		title: options.title ?? packageRef,
		description,
		capabilityTags,
		preferredUseCases,
		avoidWhen: options.avoidWhen,
		platforms: options.platforms,
		replacementImportHints: options.replacementImportHints,
		resolutionPriority,
		runtimes: options.runtimes,
	};
}
