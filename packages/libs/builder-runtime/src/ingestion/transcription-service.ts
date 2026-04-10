import type {
	BuilderTranscriptSegment,
	RawAsset,
} from '@contractspec/lib.builder-spec';
import type { BuilderStore } from '../stores/store';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import { compileDirectiveCandidates } from './directives';
import { transcribeBuilderVoiceInput } from './extractor';
import {
	createTranscriptEvidence,
	DEFAULT_APPROVED_LOCALES,
	deriveTrustProfile,
} from './helpers';
import type { BuilderIngestionServiceOptions } from './service-types';
import type { BuilderVoiceTranscriptionInput } from './types';

export async function transcribeBuilderVoice(input: {
	store: BuilderStore;
	options: BuilderIngestionServiceOptions;
	transcription: BuilderVoiceTranscriptionInput;
}) {
	const source = await input.store.getSource(input.transcription.sourceId);
	if (
		source &&
		(input.transcription.retainAudio === true ||
			input.options.retainRawAudioPolicy === 'always')
	) {
		const retainedAsset: RawAsset = {
			id: createBuilderId('asset'),
			workspaceId: input.transcription.workspaceId,
			sourceId: input.transcription.sourceId,
			filename:
				input.transcription.filename ?? `${input.transcription.sourceId}.wav`,
			mimeType: input.transcription.mimeType ?? 'audio/wav',
			sizeBytes: Buffer.from(input.transcription.audioContentBase64, 'base64')
				.byteLength,
			contentBase64: input.transcription.audioContentBase64,
			policyClassification:
				input.transcription.policyClassification ?? 'internal',
			createdAt: isoNow(input.options.now),
		};
		await input.store.saveRawAsset(retainedAsset);
	}
	const segments = await transcribeBuilderVoiceInput({
		...input.transcription,
		approvedLocales: input.transcription.approvedLocales ?? [
			...(input.options.approvedVoiceLocales ?? DEFAULT_APPROVED_LOCALES),
		],
	});
	for (const segment of segments) {
		await input.store.saveTranscriptSegment(segment);
		await input.store.saveEvidenceReference(createTranscriptEvidence(segment));
	}
	const averageConfidence =
		segments.reduce((sum, segment) => sum + segment.confidence, 0) /
		Math.max(segments.length, 1);
	const directives = compileDirectiveCandidates({
		workspaceId: input.transcription.workspaceId,
		sourceIds: [input.transcription.sourceId],
		text: segments.map((segment) => segment.text).join('. '),
		confidence: averageConfidence,
		trustProfile: deriveTrustProfile({
			binding: input.transcription.participantBindingId
				? await input.store.getParticipantBinding(
						input.transcription.participantBindingId
					)
				: null,
			transcriptConfidence: averageConfidence,
		}),
	});
	for (const directive of directives) {
		await input.store.saveDirective(directive);
	}
	return {
		segments,
		directives,
	};
}

export async function updateBuilderTranscriptStatus(input: {
	store: BuilderStore;
	segmentId: string;
	status: BuilderTranscriptSegment['status'];
}) {
	const allWorkspaceSources = await Promise.all(
		(await input.store.listWorkspaces()).map((workspace) =>
			input.store.listSources(workspace.id)
		)
	);
	for (const sourcesForWorkspace of allWorkspaceSources) {
		for (const source of sourcesForWorkspace) {
			const segments = await input.store.listTranscriptSegments(source.id);
			const found = segments.find((segment) => segment.id === input.segmentId);
			if (!found) continue;
			const updated = {
				...found,
				status: input.status,
			};
			await input.store.saveTranscriptSegment(updated);
			return updated;
		}
	}
	return null;
}
