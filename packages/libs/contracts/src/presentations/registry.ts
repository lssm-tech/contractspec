import type { PresentationSpec } from './presentations';
import { SpecContractRegistry } from '../registry';

/** In-memory registry for PresentationSpec. */
export class PresentationRegistry extends SpecContractRegistry<
  'presentation',
  PresentationSpec
> {
  public constructor(items?: PresentationSpec[]) {
    super('presentation', items);
  }
}
