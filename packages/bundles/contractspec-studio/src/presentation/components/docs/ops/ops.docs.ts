import type { DocBlock } from '@lssm/lib.contracts/docs';
import { opsRunbookDocsA } from './ops-runbooks-a.docblocks';
import { opsLifecycleDocs } from './ops-lifecycle.docblocks';
import { opsRunbookDocsB } from './ops-runbooks-b.docblocks';
import { opsSloTenantDocs } from './ops-slo-tenant.docblocks';
import { opsTopDocs } from './ops-top.docs';

export const opsDocBlocks: DocBlock[] = [
  ...opsTopDocs,
  ...opsRunbookDocsA,
  ...opsLifecycleDocs,
  ...opsRunbookDocsB,
  ...opsSloTenantDocs,
];


