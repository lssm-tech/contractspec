export {
  GetContractVerificationStatusQuery,
  ContractVerificationStatusModel,
  GetContractVerificationStatusInput,
  GetContractVerificationStatusOutput,
} from './getContractVerificationStatus';
export { ContractVerificationTableDataView } from '../../data-views/report/contractVerificationTable';

import type { OperationSpecRegistry } from '../registry';
import { GetContractVerificationStatusQuery } from './getContractVerificationStatus';

/**
 * Register report-related operation contracts in the given registry.
 */
export function registerReportContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(GetContractVerificationStatusQuery);
}
