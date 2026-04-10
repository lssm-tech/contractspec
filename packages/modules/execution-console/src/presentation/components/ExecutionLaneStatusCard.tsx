import type {
	CompletionStatusView,
	LaneStatusView,
	TeamStatusView,
} from '@contractspec/lib.execution-lanes';
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

export function ExecutionLaneStatusCard(props: {
	lane: LaneStatusView;
	team?: TeamStatusView;
	completion?: CompletionStatusView;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.lane.objective}</CardTitle>
				<CardDescription>{props.lane.runId}</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="between">
						<Badge variant="secondary">{props.lane.lane}</Badge>
						<Badge>{props.lane.status}</Badge>
					</HStack>
					<HStack justify="between">
						<Small>Owner</Small>
						<Muted>{props.lane.ownerRole}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Phase</Small>
						<Muted>{props.lane.currentPhase}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Readiness</Small>
						<Muted>{props.lane.terminalReadiness}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Missing artifacts</Small>
						<Muted>{props.lane.missingArtifacts.join(', ') || 'none'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Pending approvals</Small>
						<Muted>{props.lane.pendingApprovals.join(', ') || 'none'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Missing evidence</Small>
						<Muted>{props.lane.missingEvidence.join(', ') || 'none'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Blocking risks</Small>
						<Muted>{props.lane.blockingRisks.join(', ') || 'none'}</Muted>
					</HStack>
					{props.team ? (
						<HStack justify="between">
							<Small>Team progress</Small>
							<Muted>
								{props.team.completedTasks}/{props.team.totalTasks} tasks
							</Muted>
						</HStack>
					) : null}
					{props.completion ? (
						<HStack justify="between">
							<Small>Completion phase</Small>
							<Muted>
								{props.completion.phase} · iter {props.completion.iteration} ·
								retries {props.completion.retryCount}
							</Muted>
						</HStack>
					) : null}
				</VStack>
			</CardContent>
		</Card>
	);
}
