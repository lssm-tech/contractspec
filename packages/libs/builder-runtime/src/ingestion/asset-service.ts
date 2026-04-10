import type { BuilderStore } from '../stores/store';
import { createSourceRecord, extractBuilderSourceParts } from './extractor';
import { guessMimeTypeFromPath } from './helpers';
import type {
	BuilderAssetIngestionResult,
	BuilderIngestionServiceOptions,
} from './service-types';
import type { BuilderAssetUploadInput } from './types';
import { expandSafeZipEntries } from './zip';

export async function ingestBuilderAsset(input: {
	store: BuilderStore;
	options: BuilderIngestionServiceOptions;
	ingestAsset: (
		assetInput: BuilderAssetUploadInput
	) => Promise<BuilderAssetIngestionResult>;
	asset: BuilderAssetUploadInput;
}): Promise<BuilderAssetIngestionResult> {
	const source = createSourceRecord({
		workspaceId: input.asset.workspaceId,
		conversationId: input.asset.conversationId,
		title: input.asset.title,
		sourceType: input.asset.sourceType,
		channelType: input.asset.channelType,
		policyClassification: input.asset.policyClassification,
		approvalState: input.asset.approvalState,
		originStudioArtifactId: input.asset.originStudioArtifactId,
		parentSourceId: input.asset.parentSourceId,
		derivedFromSourceId: input.asset.derivedFromSourceId,
		filename: input.asset.filename,
		language: input.asset.language,
	});
	source.provenance.sourceId = source.id;
	source.trustProfile = input.asset.trustProfile;
	await input.store.saveSource(source);

	if (
		input.asset.mimeType === 'application/zip' ||
		input.asset.filename?.endsWith('.zip')
	) {
		const extraction = await extractBuilderSourceParts({
			source,
			asset: input.asset,
		});
		if (input.asset.storeRawAsset !== false && extraction.rawAsset) {
			await input.store.saveRawAsset(extraction.rawAsset);
		}
		for (const reference of extraction.evidenceReferences) {
			await input.store.saveEvidenceReference(reference);
		}
		const entries = expandSafeZipEntries({
			content: Buffer.from(input.asset.content, 'base64'),
		});
		const childResults = [];
		for (const entry of entries) {
			childResults.push(
				await input.ingestAsset({
					workspaceId: input.asset.workspaceId,
					conversationId: input.asset.conversationId,
					sourceType: 'zip_entry',
					channelType: input.asset.channelType,
					title: entry.path,
					filename: entry.path,
					mimeType: guessMimeTypeFromPath(entry.path),
					content: Buffer.from(entry.content).toString('base64'),
					policyClassification: input.asset.policyClassification,
					approvalState: input.asset.approvalState,
					parentSourceId: source.id,
					derivedFromSourceId: input.asset.derivedFromSourceId,
					trustProfile: input.asset.trustProfile,
					sourceMetadata: {
						...(input.asset.sourceMetadata ?? {}),
						zipPath: entry.path,
					},
				})
			);
		}
		return {
			source,
			childSources: childResults.map((result) => result.source),
			directives: childResults.flatMap((result) => result.directives),
			parts: childResults.flatMap((result) => result.parts),
			evidenceReferences: [
				...extraction.evidenceReferences,
				...childResults.flatMap((result) => result.evidenceReferences ?? []),
			],
		};
	}

	const extraction = await extractBuilderSourceParts({
		source,
		asset: input.asset,
	});
	if (input.asset.storeRawAsset !== false && extraction.rawAsset) {
		await input.store.saveRawAsset(extraction.rawAsset);
	}
	for (const part of extraction.parts) {
		await input.store.saveExtractedPart(part);
	}
	for (const reference of extraction.evidenceReferences) {
		await input.store.saveEvidenceReference(reference);
	}
	const directives = extraction.directives.map((directive) => ({
		...directive,
		trustProfile: input.asset.trustProfile,
	}));
	for (const directive of directives) {
		await input.store.saveDirective(directive);
	}
	return {
		source,
		directives,
		parts: extraction.parts,
		evidenceReferences: extraction.evidenceReferences,
	};
}
