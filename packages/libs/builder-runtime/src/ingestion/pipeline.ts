import type { BuilderTranscriptSegment } from '@contractspec/lib.builder-spec';
import type { BuilderStore } from '../stores/store';
import { ingestBuilderAsset } from './asset-service';
import { ingestBuilderChannelMessage } from './channel-service';
import type {
	BuilderAssetIngestionResult,
	BuilderIngestionServiceOptions,
} from './service-types';
import {
	transcribeBuilderVoice,
	updateBuilderTranscriptStatus,
} from './transcription-service';
import type {
	BuilderAssetUploadInput,
	BuilderChannelInboundEnvelope,
	BuilderVoiceTranscriptionInput,
} from './types';

export type {
	BuilderAssetIngestionResult,
	BuilderIngestionServiceOptions,
} from './service-types';

export class BuilderIngestionService {
	constructor(
		private readonly store: BuilderStore,
		private readonly options: BuilderIngestionServiceOptions = {}
	) {}

	async ingestAsset(
		input: BuilderAssetUploadInput
	): Promise<BuilderAssetIngestionResult> {
		return ingestBuilderAsset({
			store: this.store,
			options: this.options,
			ingestAsset: (nextInput) => this.ingestAsset(nextInput),
			asset: input,
		});
	}

	async ingestChannelMessage(input: BuilderChannelInboundEnvelope) {
		return ingestBuilderChannelMessage({
			store: this.store,
			options: this.options,
			ingestAsset: (assetInput) => this.ingestAsset(assetInput),
			transcribeVoice: (transcriptionInput) =>
				this.transcribeVoice(transcriptionInput),
			envelope: input,
		});
	}

	async transcribeVoice(input: BuilderVoiceTranscriptionInput) {
		return transcribeBuilderVoice({
			store: this.store,
			options: this.options,
			transcription: input,
		});
	}

	async confirmTranscript(segmentId: string) {
		return this.updateTranscriptStatus(segmentId, 'confirmed');
	}

	async rejectTranscript(segmentId: string) {
		return this.updateTranscriptStatus(segmentId, 'rejected');
	}

	private async updateTranscriptStatus(
		segmentId: string,
		status: BuilderTranscriptSegment['status']
	) {
		return updateBuilderTranscriptStatus({
			store: this.store,
			segmentId,
			status,
		});
	}
}
