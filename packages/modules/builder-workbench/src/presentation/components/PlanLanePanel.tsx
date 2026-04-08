'use client';

import type {
	BuilderApprovalTicket,
	BuilderParticipantBinding,
	BuilderPlan,
} from '@contractspec/lib.builder-spec';
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

export function PlanLanePanel(props: {
	plan?: BuilderPlan | null;
	participantBindings: BuilderParticipantBinding[];
	approvalTickets: BuilderApprovalTicket[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Plan / Lane Console</CardTitle>
				<CardDescription>
					Lane type, execution status, bindings, and pending approvals remain
					explicit.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="between">
						<Small>Lane</Small>
						<Badge variant="secondary">
							{props.plan?.laneType ?? 'not_compiled'}
						</Badge>
					</HStack>
					<HStack justify="between">
						<Small>Status</Small>
						<Muted>{props.plan?.status ?? 'draft'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Steps</Small>
						<Muted>{props.plan?.steps.length ?? 0}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Active Bindings</Small>
						<Muted>
							{
								props.participantBindings.filter(
									(binding) => !binding.revokedAt
								).length
							}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Pending Approvals</Small>
						<Badge
							variant={
								props.approvalTickets.some((ticket) => ticket.status === 'open')
									? 'destructive'
									: 'secondary'
							}
						>
							{
								props.approvalTickets.filter(
									(ticket) => ticket.status === 'open'
								).length
							}
						</Badge>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
