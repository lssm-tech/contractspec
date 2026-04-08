'use client';

import type {
	BuilderApprovalTicket,
	BuilderPlan,
} from '@contractspec/lib.builder-spec';
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

export function PlanLaneConsolePanel(props: {
	plan?: BuilderPlan | null;
	approvalTickets: BuilderApprovalTicket[];
	onCompilePlan?: () => void | Promise<void>;
	isCompilingPlan?: boolean;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Plan / Lane Console</CardTitle>
				<CardDescription>
					Compiled lane choice, steps, and pending approvals remain explicit.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="end">
						<Button
							onClick={() => void props.onCompilePlan?.()}
							disabled={props.isCompilingPlan === true}
						>
							{props.isCompilingPlan ? 'Compiling...' : 'Compile Plan'}
						</Button>
					</HStack>
					<HStack justify="between">
						<Small>Lane</Small>
						<Badge variant="secondary">
							{props.plan?.laneType ?? 'not_compiled'}
						</Badge>
					</HStack>
					<HStack justify="between">
						<Small>Runtime Mode</Small>
						<Badge>{props.plan?.runtimeMode ?? 'managed'}</Badge>
					</HStack>
					<HStack justify="between">
						<Small>Status</Small>
						<Badge>{props.plan?.status ?? 'draft'}</Badge>
					</HStack>
					<VStack gap="sm" align="stretch">
						{props.plan?.steps.map((step) => (
							<HStack key={step} justify="between">
								<Small>{step}</Small>
								<Muted>step</Muted>
							</HStack>
						)) ?? <Muted>No compiled plan yet.</Muted>}
					</VStack>
					<HStack justify="between">
						<Small>Pending Approvals</Small>
						<Muted>
							{
								props.approvalTickets.filter(
									(ticket) => ticket.status === 'open'
								).length
							}
						</Muted>
					</HStack>
					<VStack gap="sm" align="stretch">
						{props.plan?.providerSelections.map((selection) => (
							<HStack
								key={`${selection.taskType}-${selection.selectedProviderId}`}
								justify="between"
							>
								<VStack gap="sm" align="start">
									<Small>{selection.taskType}</Small>
									<Muted>{selection.selectedProviderId}</Muted>
								</VStack>
								<Badge variant="secondary">{selection.riskLevel}</Badge>
							</HStack>
						)) ?? null}
					</VStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
