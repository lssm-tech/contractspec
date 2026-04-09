'use client';

import type {
	ExecutionComparisonRun,
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
	ProviderRoutingPolicy,
} from '@contractspec/lib.provider-spec';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { ProviderPolicySummarySection } from './ProviderPolicySummarySection';
import { ProviderReceiptSection } from './ProviderReceiptSection';

export function ProviderOverviewSection(props: {
	providers: ExternalExecutionProvider[];
	receipts: ExternalExecutionReceipt[];
	comparisonRuns: ExecutionComparisonRun[];
	routingPolicy?: ProviderRoutingPolicy | null;
	patchProposalCount: number;
}) {
	return (
		<VStack gap="md" align="stretch">
			<ProviderPolicySummarySection
				providers={props.providers}
				comparisonRuns={props.comparisonRuns}
				routingPolicy={props.routingPolicy}
				patchProposalCount={props.patchProposalCount}
				receiptCount={props.receipts.length}
			/>
			<ProviderReceiptSection
				providers={props.providers}
				receipts={props.receipts}
			/>
		</VStack>
	);
}
