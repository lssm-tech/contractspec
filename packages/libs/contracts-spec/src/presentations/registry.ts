import { SpecContractRegistry } from '../registry';
import type { PresentationSpec } from './presentations';

/** In-memory registry for PresentationSpec. */
export class PresentationRegistry extends SpecContractRegistry<
	'presentation',
	PresentationSpec
> {
	public constructor(items?: PresentationSpec[]) {
		super('presentation', items);
	}
}
