import type { CompletionStatusView } from '@contractspec/lib.execution-lanes';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function CompletionStatusPanel(props: {
	completion?: CompletionStatusView;
}) {
	if (!props.completion) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Completion Loop</CardTitle>
			</CardHeader>
			<CardContent>
				<VStack gap="sm" align="stretch">
					<HStack justify="between">
						<Small>Phase</Small>
						<Muted>{props.completion.phase}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Iteration</Small>
						<Muted>{props.completion.iteration}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Evidence bundles</Small>
						<Muted>{props.completion.evidenceBundles}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Retries</Small>
						<Muted>{props.completion.retryCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Snapshot</Small>
						<Muted>{props.completion.snapshotRef}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Pending approvals</Small>
						<Muted>
							{props.completion.pendingApprovals.join(', ') || 'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Missing evidence</Small>
						<Muted>
							{props.completion.missingEvidence.join(', ') || 'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Readiness</Small>
						<Muted>{props.completion.terminalReadiness}</Muted>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
