import type { TranslationSpec } from '@contractspec/lib.contracts-spec/translations';

export type OverrideScope =
	| 'base'
	| 'package'
	| 'project'
	| 'tenant'
	| 'user'
	| 'request';

export interface OverrideLayer {
	scope: OverrideScope;
	source: string;
	specs: readonly TranslationSpec[];
	priority?: number;
}

export function sortOverrideLayers(
	layers: readonly OverrideLayer[]
): OverrideLayer[] {
	return [...layers].sort(
		(left, right) =>
			(left.priority ?? defaultOverridePriority(left.scope)) -
			(right.priority ?? defaultOverridePriority(right.scope))
	);
}

export function defaultOverridePriority(scope: OverrideScope): number {
	switch (scope) {
		case 'base':
			return 0;
		case 'package':
			return 10;
		case 'project':
			return 20;
		case 'tenant':
			return 30;
		case 'user':
			return 40;
		case 'request':
			return 50;
	}
}
