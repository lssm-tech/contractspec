import type { LaneRuntimeSnapshot } from '@contractspec/lib.execution-lanes';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function EvidenceDrawer(props: {
	snapshot: LaneRuntimeSnapshot;
	selectedEvidenceId?: string | null;
}) {
	const selected =
		props.snapshot.evidence.find(
			(bundle) => bundle.id === props.selectedEvidenceId
		) ?? props.snapshot.evidence[0];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Evidence</CardTitle>
			</CardHeader>
			<CardContent>
				<VStack gap="md" align="stretch">
					{selected ? (
						<>
							<HStack gap="sm">
								{selected.classes.map((item) => (
									<Badge key={item} variant="outline">
										{item}
									</Badge>
								))}
							</HStack>
							<Small>{selected.summary ?? 'No summary provided.'}</Small>
							<Muted>Artifacts: {selected.artifactIds.length}</Muted>
							<Muted>Fresh until: {selected.freshUntil ?? 'not set'}</Muted>
							<Muted>
								Replay: {selected.replayBundleUri ?? 'not available'}
							</Muted>
						</>
					) : (
						<Muted>No evidence attached.</Muted>
					)}
				</VStack>
			</CardContent>
		</Card>
	);
}
