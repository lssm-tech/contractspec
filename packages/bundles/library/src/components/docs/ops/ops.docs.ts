import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { opsLifecycleDocs } from './ops-lifecycle.docblocks';
import { opsRunbookDocsA } from './ops-runbooks-a.docblocks';
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
