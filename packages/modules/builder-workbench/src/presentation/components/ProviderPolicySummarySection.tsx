'use client';

import type {
	ExecutionComparisonRun,
	ExternalExecutionProvider,
	ProviderRoutingPolicy,
} from '@contractspec/lib.provider-spec';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function ProviderPolicySummarySection(props: {
	providers: ExternalExecutionProvider[];
	comparisonRuns: ExecutionComparisonRun[];
	routingPolicy?: ProviderRoutingPolicy | null;
	patchProposalCount: number;
	receiptCount: number;
}) {
	const providerCoverage = {
		conversational: props.providers.some(
			(provider) => provider.providerKind === 'conversational'
		),
		coding: props.providers.some(
			(provider) => provider.providerKind === 'coding'
		),
		stt: props.providers.some((provider) => provider.providerKind === 'stt'),
		localHelper: props.providers.some(
			(provider) => provider.providerKind === 'routing_helper'
		),
	};
	const highRiskComparison =
		props.routingPolicy?.comparisonRules.some(
			(rule) =>
				rule.riskLevelAtOrAbove === 'high' ||
				rule.riskLevelAtOrAbove === 'critical'
		) ?? false;

	return (
		<>
			<HStack justify="between">
				<Small>Registered Providers</Small>
				<Muted>{props.providers.length}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Receipts</Small>
				<Muted>{props.receiptCount}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Patch Proposals</Small>
				<Muted>{props.patchProposalCount}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Comparison Runs</Small>
				<Muted>{props.comparisonRuns.length}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Routing Rules</Small>
				<Muted>{props.routingPolicy?.taskRules.length ?? 0}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Comparison Rules</Small>
				<Muted>{props.routingPolicy?.comparisonRules.length ?? 0}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Fallback Rules</Small>
				<Muted>{props.routingPolicy?.fallbackRules.length ?? 0}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>High-Risk Comparison</Small>
				<Muted>{String(highRiskComparison)}</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Default Provider Profile</Small>
				<Muted>
					{props.routingPolicy?.defaultProviderProfileId ?? 'unset'}
				</Muted>
			</HStack>
			<HStack justify="between">
				<Small>Provider Role Coverage</Small>
				<Muted>
					conversational {String(providerCoverage.conversational)} / coding{' '}
					{String(providerCoverage.coding)} / stt {String(providerCoverage.stt)}{' '}
					/ local helper {String(providerCoverage.localHelper)}
				</Muted>
			</HStack>
		</>
	);
}
