import { journeyTrackCatalog } from '@contractspec/example.learning-journey-registry/tracks';
import { meetingRecorderSampleConnections } from '@contractspec/example.meeting-recorder-providers/connection.sample';
import { voiceSampleConnections } from '@contractspec/example.voice-providers/connection.sample';
import { Panel, PanelHeader, PreviewList } from './native-preview-primitives';

export function LearningJourneyNativePreview({
	exampleKey,
}: {
	exampleKey: string;
}) {
	const tracks = selectLearningTracks(exampleKey);

	return (
		<Panel>
			<PanelHeader
				title="Learning journey tracks"
				eyebrow="Guided adoption"
				description="Track definitions are rendered from exported learning journey specs."
			/>
			<PreviewList
				items={tracks.map((track) => ({
					title: track.name,
					subtitle: `${track.steps.length} steps - ${track.totalXp ?? 0} XP`,
					body: track.description ?? 'Learning track',
				}))}
			/>
			{tracks[0] ? (
				<PreviewList
					eyebrow="First track steps"
					items={tracks[0].steps.slice(0, 5).map((step) => ({
						title: step.title,
						subtitle: `${step.xpReward ?? 0} XP`,
						body: step.description ?? step.completionEvent,
					}))}
				/>
			) : null}
		</Panel>
	);
}

export function ConnectionsNativePreview({
	exampleKey,
}: {
	exampleKey: string;
}) {
	const connections =
		exampleKey === 'voice-providers'
			? voiceSampleConnections
			: meetingRecorderSampleConnections;

	return (
		<Panel>
			<PanelHeader
				title={
					exampleKey === 'voice-providers'
						? 'Voice provider connections'
						: 'Meeting recorder connections'
				}
				eyebrow="Integration bindings"
				description="Connection cards are rendered from exported sample integration configs."
			/>
			<PreviewList
				items={connections.map((connection) => ({
					title: connection.meta.label,
					subtitle: `${connection.status} - ${connection.ownershipMode}`,
					body: `${connection.meta.integrationKey}@${connection.meta.integrationVersion}`,
				}))}
			/>
		</Panel>
	);
}

function selectLearningTracks(exampleKey: string) {
	const token = exampleKey.replace('learning-journey-', '').replace(/-/g, ' ');
	const matches = journeyTrackCatalog.filter((track) => {
		const haystack = [
			track.id,
			track.name,
			track.description,
			track.productId,
			track.targetRole,
			track.targetUserSegment,
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		return token
			.split(' ')
			.filter((part) => part.length > 2)
			.some((part) => haystack.includes(part));
	});

	return matches.length > 0 ? matches : journeyTrackCatalog.slice(0, 3);
}
