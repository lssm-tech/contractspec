'use client';

import type {
	BuilderSourceRecord,
	EvidenceReference,
	ExtractedAssetPart,
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

export function SourceInboxPanel(props: {
	sources: BuilderSourceRecord[];
	extractedParts: ExtractedAssetPart[];
	evidenceReferences: EvidenceReference[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Source Inbox</CardTitle>
				<CardDescription>
					Files, snapshots, and channel-attached assets with provenance and
					approval state.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="md" align="stretch">
					{props.sources.map((source) => (
						<HStack key={source.id} justify="between">
							<VStack gap="sm" align="start">
								<Small>{source.title}</Small>
								<Muted>
									{source.sourceType} · {source.policyClassification} ·{' '}
									{
										props.extractedParts.filter(
											(part) => part.sourceId === source.id
										).length
									}{' '}
									parts
								</Muted>
								<Muted>
									{
										props.evidenceReferences.filter(
											(ref) => ref.sourceId === source.id
										).length
									}{' '}
									evidence refs
								</Muted>
							</VStack>
							<Badge
								variant={
									source.approvalState === 'approved' ? 'secondary' : 'outline'
								}
							>
								{source.approvalState}
							</Badge>
						</HStack>
					))}
				</VStack>
			</CardContent>
		</Card>
	);
}
