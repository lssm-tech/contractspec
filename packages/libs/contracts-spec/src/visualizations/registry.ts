import { SpecContractRegistry } from '../registry';
import type { VisualizationSpec } from './spec';

export function visualizationKey(spec: VisualizationSpec): string {
	return `${spec.meta.key}.v${spec.meta.version}`;
}

export class VisualizationRegistry extends SpecContractRegistry<
	'visualization',
	VisualizationSpec
> {
	public constructor(items?: VisualizationSpec[]) {
		super('visualization', items);
	}
}
