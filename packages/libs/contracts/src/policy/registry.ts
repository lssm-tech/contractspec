import { SpecContractRegistry } from '../registry';
import type { PolicySpec } from './spec';

export class PolicyRegistry extends SpecContractRegistry<'policy', PolicySpec> {
  public constructor(items?: PolicySpec[]) {
    super('policy', items);
  }
}
