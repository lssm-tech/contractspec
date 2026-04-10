'use client';
import type {
	BuilderProviderActivity,
	BuilderProviderProposalRegisterEntry,
} from '@contractspec/lib.builder-spec';
import type {
	ExecutionComparisonRun,
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
	ExternalPatchProposal,
	ProviderRoutingPolicy,
} from '@contractspec/lib.provider-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import { ProviderOverviewSection } from './ProviderOverviewSection';
import { ProviderPatchProposalsSection } from './ProviderPatchProposalsSection';
export function ProviderActivityPanel(props: {
	activity: BuilderProviderActivity[];
	providers: ExternalExecutionProvider[];
	receipts: ExternalExecutionReceipt[];
	patchProposals: ExternalPatchProposal[];
	comparisonRuns: ExecutionComparisonRun[];
	routingPolicy?: ProviderRoutingPolicy | null;
	proposalRegister: BuilderProviderProposalRegisterEntry[];
	onRegisterRecommendedProviders?: () => void | Promise<void>;
	onAcceptPatchProposal?: (proposalId: string) => void | Promise<void>;
	onRejectPatchProposal?: (proposalId: string) => void | Promise<void>;
	onOpenPatchProposalReview?: (proposalId: string) => void | Promise<void>;
	isRegisteringProviders?: boolean;
	busyProposalId?: string | null;
}) {
	const receiptsById = new Map(
		props.receipts.map((receipt) => [receipt.id, receipt] as const)
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Provider Activity</CardTitle>
				<CardDescription>
					Provider routing, receipts, comparisons, and proposal status stay
					explicit.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="end">
						<Button
							variant="outline"
							onClick={() => void props.onRegisterRecommendedProviders?.()}
							disabled={props.isRegisteringProviders === true}
						>
							{props.isRegisteringProviders
								? 'Registering...'
								: 'Register Recommended Providers'}
						</Button>
					</HStack>
					<ProviderOverviewSection
						providers={props.providers}
						receipts={props.receipts}
						comparisonRuns={props.comparisonRuns}
						routingPolicy={props.routingPolicy}
						patchProposalCount={props.patchProposals.length}
					/>
					<ProviderPatchProposalsSection
						patchProposals={props.patchProposals}
						receiptsById={receiptsById}
						onAcceptPatchProposal={props.onAcceptPatchProposal}
						onRejectPatchProposal={props.onRejectPatchProposal}
						onOpenPatchProposalReview={props.onOpenPatchProposalReview}
						busyProposalId={props.busyProposalId}
					/>
					<VStack gap="md" align="stretch">
						<Small>Comparison Runs</Small>
						{props.comparisonRuns.slice(0, 4).map((comparison) => (
							<VStack
								key={comparison.id}
								gap="sm"
								align="stretch"
								className="rounded-md border p-3"
							>
								<HStack justify="between">
									<Small>{comparison.taskType}</Small>
									<Badge variant="secondary">{comparison.status}</Badge>
								</HStack>
								<Muted>
									{comparison.mode} · {comparison.providerIds.join(', ')}
								</Muted>
								<Muted>
									{comparison.verdict?.summary ?? 'No verdict recorded yet.'}
								</Muted>
							</VStack>
						))}
						{props.comparisonRuns.length === 0 ? (
							<Muted>No comparison runs recorded yet.</Muted>
						) : null}
					</VStack>
					<VStack gap="md" align="stretch">
						<Small>Proposal Register</Small>
						{props.proposalRegister.slice(0, 4).map((entry) => (
							<HStack key={entry.id} justify="between">
								<VStack gap="sm" align="start">
									<Small>{entry.providerId}</Small>
									<Muted>
										{entry.changedAreas.join(', ') || 'no changed areas'}
									</Muted>
								</VStack>
								<Badge variant="secondary">{entry.status}</Badge>
							</HStack>
						))}
					</VStack>
					<VStack gap="sm" align="stretch">
						{props.activity.slice(0, 4).map((entry) => (
							<VStack
								key={entry.id}
								gap="sm"
								align="stretch"
								className="rounded-md border p-3"
							>
								<HStack justify="between">
									<VStack gap="sm" align="start">
										<Small>{entry.taskType}</Small>
										<Muted>
											{entry.providerId ?? entry.comparisonMode ?? 'pending'} ·{' '}
											{entry.receiptId ?? 'no receipt'}
										</Muted>
									</VStack>
									<Badge>{entry.status}</Badge>
								</HStack>
								{entry.reason ? <Muted>{entry.reason}</Muted> : null}
								{entry.recommendedAction ? (
									<Muted>
										Next: {entry.recommendedAction}
										{entry.fallbackProviderIds &&
										entry.fallbackProviderIds.length > 0
											? ` · ${entry.fallbackProviderIds.join(', ')}`
											: ''}
									</Muted>
								) : null}
							</VStack>
						))}
					</VStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
