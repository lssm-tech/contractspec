import { StabilityEnum } from '../../ownership';
import { defineDataView } from '../spec';
import { GetContractVerificationStatusQuery } from '../../operations/report/getContractVerificationStatus';

/**
 * Data view for the contract verification status table rendered in reports.
 */
export const ContractVerificationTableDataView = defineDataView({
  meta: {
    key: 'report.contractVerificationTable',
    title: 'Contract Verification Table',
    version: '1.0.0',
    description:
      'Table view of per-contract verification status for the impact report.',
    domain: 'report',
    owners: ['platform.core'],
    tags: ['report', 'data-view', 'verification'],
    stability: StabilityEnum.Experimental,
    entity: 'contract-verification',
  },
  source: {
    primary: {
      key: GetContractVerificationStatusQuery.meta.key,
      version: GetContractVerificationStatusQuery.meta.version,
    },
  },
  view: {
    kind: 'table',
    fields: [
      {
        key: 'name',
        label: 'Contract / Endpoint / Event',
        dataPath: 'name',
      },
      {
        key: 'timeSinceVerified',
        label: 'Time since verified',
        dataPath: 'lastVerifiedDate',
      },
      {
        key: 'driftMismatches',
        label: 'Drift debt',
        dataPath: 'driftMismatches',
        format: 'number',
        sortable: true,
      },
      {
        key: 'surfaces',
        label: 'Surfaces covered',
        dataPath: 'surfaces',
        format: 'badge',
      },
      {
        key: 'lastVerifiedSha',
        label: 'Last verified commit',
        dataPath: 'lastVerifiedSha',
        width: 'sm',
      },
    ],
    primaryField: 'name',
    secondaryFields: ['driftMismatches', 'timeSinceVerified'],
    columns: [
      { field: 'name', width: 'lg' },
      { field: 'lastVerifiedSha', width: 'sm' },
      { field: 'timeSinceVerified', width: 'sm' },
      { field: 'surfaces', width: 'md' },
      { field: 'driftMismatches', width: 'xs', align: 'right' },
    ],
  },
  policy: {
    flags: [],
    pii: [],
  },
});
