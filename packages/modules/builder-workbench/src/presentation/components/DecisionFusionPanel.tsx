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

export function DecisionFusionPanel(props: {
	conflicts: BuilderConflict[];
	assumptions: BuilderAssumption[];
	decisionReceipts: BuilderDecisionReceipt[];
	fusionGraphEdges: BuilderFusionGraphEdge[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Fusion / Decisions</CardTitle>
				<CardDescription>
					Conflicts, assumptions, receipts, and graph edges stay inspectable.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="between">
						<Small>Open Conflicts</Small>
						<Badge
							variant={props.conflicts.length > 0 ? 'destructive' : 'secondary'}
						>
							{props.conflicts.length}
						</Badge>
					</HStack>
					<VStack gap="sm" align="stretch">
						{props.conflicts.slice(0, 3).map((conflict) => (
							<HStack key={conflict.id} justify="between">
								<Small>{conflict.summary}</Small>
								<Muted>{conflict.fieldPath}</Muted>
							</HStack>
						))}
						{props.conflicts.length === 0 ? (
							<Muted>No open conflicts.</Muted>
						) : null}
					</VStack>
					<HStack justify="between">
						<Small>Assumptions</Small>
						<Muted>{props.assumptions.length}</Muted>
					</HStack>
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
