'use client';

import type {
	ExternalExecutionReceipt,
	ExternalPatchProposal,
} from '@contractspec/lib.provider-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function ProviderPatchProposalsSection(props: {
	patchProposals: ExternalPatchProposal[];
	receiptsById: Map<string, ExternalExecutionReceipt>;
	onAcceptPatchProposal?: (proposalId: string) => void | Promise<void>;
	onRejectPatchProposal?: (proposalId: string) => void | Promise<void>;
	onOpenPatchProposalReview?: (proposalId: string) => void | Promise<void>;
	busyProposalId?: string | null;
}) {
	return (
		<VStack gap="md" align="stretch">
			<Small>Patch Proposals</Small>
			{props.patchProposals.length === 0 ? (
				<Muted>No patch proposals have been normalized yet.</Muted>
			) : (
				props.patchProposals.map((proposal) => {
					const receipt = props.receiptsById.get(proposal.receiptId);
					return (
						<VStack
							key={proposal.id}
							gap="sm"
							align="stretch"
							className="rounded-md border p-3"
						>
							<HStack justify="between">
								<VStack gap="sm" align="start">
									<Small>{proposal.summary}</Small>
									<Muted>
										{proposal.changedAreas.join(', ') || 'no changed areas'}
									</Muted>
									<Muted>
										{proposal.allowedWriteScopes.join(', ') || 'no write scope'}
									</Muted>
									<Muted>
										Provider: {receipt?.providerId ?? 'pending'} ·{' '}
										{receipt?.runtimeMode ?? 'runtime pending'}
									</Muted>
								</VStack>
								<VStack gap="sm" align="end">
									<Badge>{proposal.riskLevel}</Badge>
									<Badge variant="secondary">{proposal.status}</Badge>
								</VStack>
							</HStack>
							<HStack justify="between">
								<Muted>Receipt {proposal.receiptId}</Muted>
								<Muted>Run {proposal.runId}</Muted>
							</HStack>
							<HStack justify="end">
								<Button
									variant="outline"
									onClick={() =>
										void props.onOpenPatchProposalReview?.(proposal.id)
									}
								>
									Open Review
								</Button>
								<Button
									variant="outline"
									onClick={() =>
										void props.onRejectPatchProposal?.(proposal.id)
									}
									disabled={props.busyProposalId === proposal.id}
								>
									Reject
								</Button>
								<Button
									onClick={() =>
										void props.onAcceptPatchProposal?.(proposal.id)
									}
									disabled={props.busyProposalId === proposal.id}
								>
									Accept
								</Button>
							</HStack>
						</VStack>
					);
				})
			)}
		</VStack>
	);
}
