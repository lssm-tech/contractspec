import { SpecContractRegistry } from '../registry';
import type { KnowledgeCategory, KnowledgeSpaceSpec } from './spec';

export class KnowledgeSpaceRegistry extends SpecContractRegistry<
	'knowledge-space',
	KnowledgeSpaceSpec
> {
	constructor(items?: KnowledgeSpaceSpec[]) {
		super('knowledge-space', items);
	}

	getByCategory(category: KnowledgeCategory): KnowledgeSpaceSpec[] {
		return this.list().filter((spec) => spec.meta.category === category);
	}
}
