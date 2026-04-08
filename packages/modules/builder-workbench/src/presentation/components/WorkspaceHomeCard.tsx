'use client';

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
import type { BuilderWorkbenchSummary } from '../../core';

export function WorkspaceHomeCard(props: { summary: BuilderWorkbenchSummary }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.summary.workspaceName}</CardTitle>
				<CardDescription>Builder workspace overview</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="between">
						<Badge variant="secondary">{props.summary.status}</Badge>
						<Badge>{props.summary.readinessLabel}</Badge>
					</HStack>
					<HStack justify="between">
						<Small>Sources</Small>
						<Muted>{props.summary.sourceCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Default Runtime</Small>
						<Muted>{props.summary.defaultRuntimeMode}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Messages</Small>
						<Muted>{props.summary.messageCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Blockers</Small>
						<Muted>{props.summary.blockerCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Warnings</Small>
						<Muted>{props.summary.warningCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Verified Bindings</Small>
						<Muted>{props.summary.verifiedBindingCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Pending Approvals</Small>
						<Muted>{props.summary.pendingApprovalCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Open Conflicts</Small>
						<Muted>{props.summary.openConflictCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Runtime Targets</Small>
						<Muted>{props.summary.runtimeTargetCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Provider Runs</Small>
						<Muted>{props.summary.providerRunCount}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Mobile Reviews</Small>
						<Muted>{props.summary.mobileReviewCount}</Muted>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
