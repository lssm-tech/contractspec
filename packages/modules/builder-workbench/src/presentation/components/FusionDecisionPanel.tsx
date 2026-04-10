'use client';

import type {
	BuilderAssumption,
	BuilderConflict,
	BuilderDecisionReceipt,
	BuilderFusionGraphEdge,
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

export function FusionDecisionPanel(props: {
	conflicts: BuilderConflict[];
	assumptions: BuilderAssumption[];
	decisionReceipts: BuilderDecisionReceipt[];
	fusionGraphEdges: BuilderFusionGraphEdge[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Fusion / Decision View</CardTitle>
				<CardDescription>
					Conflicts, assumptions, receipts, and graph links stay inspectable.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="between">
						<Small>Open Conflicts</Small>
						<Badge>
							{
								props.conflicts.filter((conflict) => conflict.status === 'open')
									.length
							}
						</Badge>
					</HStack>
					<VStack gap="sm" align="stretch">
						{props.conflicts.slice(0, 5).map((conflict) => (
							<HStack key={conflict.id} justify="between">
								<VStack gap="sm" align="start">
									<Small>{conflict.summary}</Small>
									<Muted>{conflict.fieldPath}</Muted>
								</VStack>
								<Badge
									variant={
										conflict.status === 'open' ? 'destructive' : 'secondary'
									}
								>
									{conflict.status}
								</Badge>
							</HStack>
						))}
					</VStack>
					<HStack justify="between">
						<Small>Open Assumptions</Small>
						<Badge>
							{
								props.assumptions.filter(
									(assumption) => assumption.status === 'open'
								).length
							}
						</Badge>
					</HStack>
					<VStack gap="sm" align="stretch">
						{props.assumptions.slice(0, 5).map((assumption) => (
							<HStack key={assumption.id} justify="between">
								<Small>{assumption.statement}</Small>
								<Badge
									variant={
										assumption.severity === 'high' ? 'destructive' : 'outline'
									}
								>
									{assumption.severity}
								</Badge>
							</HStack>
						))}
					</VStack>
					<HStack justify="between">
						<Small>Decision Receipts</Small>
						<Muted>{props.decisionReceipts.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Graph Edges</Small>
						<Muted>{props.fusionGraphEdges.length}</Muted>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
