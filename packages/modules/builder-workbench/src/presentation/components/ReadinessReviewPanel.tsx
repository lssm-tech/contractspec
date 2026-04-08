'use client';

import type { BuilderReadinessReport } from '@contractspec/lib.builder-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function ReadinessReviewPanel(props: {
	report?: BuilderReadinessReport | null;
}) {
	if (!props.report) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Readiness Review</CardTitle>
					<CardDescription>
						No readiness report has been generated yet.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Readiness / Export Review</CardTitle>
				<CardDescription>
					Blockers, warnings, policy summary, and next actions remain explicit.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="between">
						<Badge variant="secondary">{props.report.overallStatus}</Badge>
						<Badge>{props.report.score}/100</Badge>
					</HStack>
					<HStack justify="between">
						<Small>Blocking Issues</Small>
						<Muted>
							{props.report.blockingIssues
								.map((issue) => issue.code)
								.join(', ') || 'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Warnings</Small>
						<Muted>
							{props.report.warnings
								.map((warning) => warning.code)
								.join(', ') || 'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Runtime Readiness</Small>
						<Muted>
							managed {String(props.report.managedReady)} / local{' '}
							{String(props.report.localReady)} / hybrid{' '}
							{String(props.report.hybridReady)}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Mobile Parity</Small>
						<Muted>{props.report.mobileParityStatus}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Policy Summary</Small>
						<Muted>{props.report.policySummary.join(', ') || 'none'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Assumptions</Small>
						<Muted>{props.report.assumptionsSummary ?? 'none'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Channels</Small>
						<Muted>{props.report.channelSummary.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Provider Runs</Small>
						<Muted>{props.report.providerSummary.runs}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Required Approvals</Small>
						<Muted>{props.report.requiredApprovals.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Evidence Bundle</Small>
						<Muted>{props.report.evidenceBundleRef.id}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Next Action</Small>
						<Muted>{props.report.recommendedNextAction}</Muted>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
