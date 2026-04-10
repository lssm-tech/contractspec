import type {
	BuilderChannelMessage,
	BuilderPolicyClassification,
	BuilderSourceRecord,
	BuilderTranscriptSegment,
	EvidenceReference,
	ExtractedAssetPart,
	RawAsset,
} from '@contractspec/lib.builder-spec';
import { type STTProvider } from '@contractspec/lib.voice';
import { Transcriber } from '@contractspec/lib.voice/stt';
import { sha256 } from '../utils/hash';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import { compileDirectiveCandidates } from './directives';
import type {
	BuilderAssetUploadInput,
	BuilderExtractionResult,
	BuilderImageOcrExtractor,
	BuilderPdfExtractor,
	BuilderVoiceTranscriptionInput,
} from './types';

const textDecoder = new TextDecoder();

export class DefaultBuilderPdfExtractor implements BuilderPdfExtractor {
	async extract(buffer: Uint8Array) {
		return [
			{
				content: textDecoder.decode(buffer),
				confidence: 0.25,
			},
		];
	}
}

export class DefaultBuilderImageOcrExtractor
	implements BuilderImageOcrExtractor
{
	async extract(buffer: Uint8Array, _language = 'eng') {
		return {
			content: `OCR extraction unavailable in this runtime (${buffer.byteLength} bytes captured for manual review).`,
			confidence: 0.15,
		};
	}
}

function createRawAsset(
	source: BuilderSourceRecord,
	input: BuilderAssetUploadInput
): RawAsset {
	return {
		id: createBuilderId('asset'),
		workspaceId: source.workspaceId,
		sourceId: source.id,
		filename: input.filename,
		mimeType: input.mimeType,
		sizeBytes: Buffer.from(input.content, 'base64').byteLength,
		contentBase64: input.content,
		policyClassification:
			(input.policyClassification as BuilderPolicyClassification | undefined) ??
			'internal',
		createdAt: isoNow(),
	};
}

function createTextPart(input: {
	workspaceId: string;
	sourceId: string;
	rawAssetId?: string;
	content: string;
	partType: ExtractedAssetPart['partType'];
	confidence: number;
	page?: number;
	zipPath?: string;
	extractorType: string;
}): ExtractedAssetPart {
	return {
		id: createBuilderId('part'),
		workspaceId: input.workspaceId,
		sourceId: input.sourceId,
		rawAssetId: input.rawAssetId,
		partType: input.partType,
		content: input.content,
		confidence: input.confidence,
		location: {
			page: input.page,
			zipPath: input.zipPath,
		},
		extractorType: input.extractorType,
		createdAt: isoNow(),
	};
}

export async function extractBuilderSourceParts(input: {
	source: BuilderSourceRecord;
	asset: BuilderAssetUploadInput;
	pdfExtractor?: BuilderPdfExtractor;
	imageExtractor?: BuilderImageOcrExtractor;
}): Promise<BuilderExtractionResult> {
	const rawAsset = createRawAsset(input.source, input.asset);
	const buffer = Buffer.from(input.asset.content, 'base64');
	const parts: ExtractedAssetPart[] = [];
	const evidenceReferences: EvidenceReference[] = [
		{
			id: createBuilderId('evidence'),
			workspaceId: input.source.workspaceId,
			sourceId: input.source.id,
			kind: 'source',
			label: input.source.title,
			uri: `builder://source/${input.source.id}`,
			confidence: input.source.provenance.confidence,
		},
	];
	let confidence = 0.7;
	if (
		input.asset.mimeType.startsWith('text/') ||
		input.asset.mimeType.includes('json') ||
		input.asset.mimeType.includes('yaml') ||
		input.asset.mimeType.includes('csv')
	) {
		const text = textDecoder.decode(buffer);
		parts.push(
			createTextPart({
				workspaceId: input.source.workspaceId,
				sourceId: input.source.id,
				rawAssetId: rawAsset.id,
				content: text,
				partType: 'text',
				confidence: 0.95,
				extractorType: 'text-decoder',
			})
		);
		evidenceReferences.push({
			id: createBuilderId('evidence'),
			workspaceId: input.source.workspaceId,
			sourceId: input.source.id,
			partId: parts[parts.length - 1]?.id,
			kind: 'part',
			label: `${input.source.title} text`,
			uri: `builder://source/${input.source.id}/part/${parts[parts.length - 1]?.id}`,
			confidence: 0.95,
		});
		confidence = 0.95;
	} else if (input.asset.mimeType === 'application/pdf') {
		const extractor = input.pdfExtractor ?? new DefaultBuilderPdfExtractor();
		const extracted = await extractor.extract(buffer);
		for (const [index, part] of extracted.entries()) {
			parts.push(
				createTextPart({
					workspaceId: input.source.workspaceId,
					sourceId: input.source.id,
					rawAssetId: rawAsset.id,
					content: part.content,
					partType: 'text',
					confidence: part.confidence,
					page: index + 1,
					extractorType: 'pdf-parse',
				})
			);
			evidenceReferences.push({
				id: createBuilderId('evidence'),
				workspaceId: input.source.workspaceId,
				sourceId: input.source.id,
				partId: parts[parts.length - 1]?.id,
				kind: 'part',
				label: `${input.source.title} page ${index + 1}`,
				uri: `builder://source/${input.source.id}/page/${index + 1}`,
				confidence: part.confidence,
			});
		}
		confidence =
			extracted.reduce((sum, part) => sum + part.confidence, 0) /
			Math.max(extracted.length, 1);
	} else if (input.asset.mimeType.startsWith('image/')) {
		const extractor =
			input.imageExtractor ?? new DefaultBuilderImageOcrExtractor();
		const extracted = await extractor.extract(buffer);
		parts.push(
			createTextPart({
				workspaceId: input.source.workspaceId,
				sourceId: input.source.id,
				rawAssetId: rawAsset.id,
				content: extracted.content,
				partType: 'ocr',
				confidence: extracted.confidence,
				extractorType: 'tesseract',
			})
		);
		evidenceReferences.push({
			id: createBuilderId('evidence'),
			workspaceId: input.source.workspaceId,
			sourceId: input.source.id,
			partId: parts[parts.length - 1]?.id,
			kind: 'part',
			label: `${input.source.title} OCR`,
			uri: `builder://source/${input.source.id}/ocr`,
			confidence: extracted.confidence,
		});
		confidence = extracted.confidence;
	}

	const text = parts
		.map((part) => part.content)
		.join('\n')
		.trim();
	return {
		rawAsset,
		parts,
		evidenceReferences,
		transcripts: [],
		directives: text
			? compileDirectiveCandidates({
					workspaceId: input.source.workspaceId,
					sourceIds: [input.source.id],
					text,
					confidence,
				})
			: [],
	};
}

export async function transcribeBuilderVoiceInput(
	input: BuilderVoiceTranscriptionInput
): Promise<BuilderTranscriptSegment[]> {
	const normalizedLanguage = input.language?.split(/[-_]/)[0];
	if (
		normalizedLanguage &&
		input.approvedLocales &&
		!input.approvedLocales.includes(normalizedLanguage)
	) {
		return [
			{
				id: createBuilderId('segment'),
				workspaceId: input.workspaceId,
				sourceId: input.sourceId,
				startMs: 0,
				endMs: 0,
				language: normalizedLanguage,
				text: `Voice locale ${normalizedLanguage} requires manual transcript review.`,
				confidence: 0,
				transcriptionModel: 'builder.voice.locale-fallback',
				requiresConfirmation: true,
				status: 'draft',
			},
		];
	}
	if (!input.sttProvider) {
		throw new Error(
			'STT provider is required for Builder voice transcription.'
		);
	}
	const transcriber = new Transcriber({
		stt: input.sttProvider as STTProvider,
	});
	const transcription = await transcriber.transcribe({
		audio: {
			data: Uint8Array.from(Buffer.from(input.audioContentBase64, 'base64')),
			format: 'wav',
			sampleRateHz: 16_000,
		},
		language: normalizedLanguage,
		diarize: true,
		subtitleFormat: 'none',
	});

	return transcription.transcript.segments.map((segment) => ({
		id: createBuilderId('segment'),
		workspaceId: input.workspaceId,
		sourceId: input.sourceId,
		startMs: segment.startMs,
		endMs: segment.endMs,
		language: transcription.transcript.language,
		text: segment.text,
		confidence: segment.confidence ?? 0.5,
		transcriptionModel: input.model ?? 'builder.voice.default',
		requiresConfirmation:
			(segment.confidence ?? 0.5) < 0.8 ||
			/remove auth|connect prod|export/i.test(segment.text),
		status: 'draft',
		speakerRef: segment.speakerLabel,
	}));
}

export function createSourceRecord(input: {
	workspaceId: string;
	conversationId?: string;
	title: string;
	sourceType: BuilderSourceRecord['sourceType'];
	channelType?: BuilderChannelMessage['channelType'];
	policyClassification?: BuilderPolicyClassification;
	approvalState?: BuilderSourceRecord['approvalState'];
	originStudioArtifactId?: string;
	parentSourceId?: string;
	derivedFromSourceId?: string;
	channelEventType?: string;
	externalEventId?: string;
	externalConversationId?: string;
	externalChannelId?: string;
	externalUserId?: string;
	externalMessageId?: string;
	replyToExternalMessageId?: string;
	editVersion?: number;
	filename?: string;
	zipPath?: string;
	language?: string;
	supersedesSourceId?: string;
}): BuilderSourceRecord {
	const capturedAt = isoNow();
	return {
		id: createBuilderId('source'),
		workspaceId: input.workspaceId,
		conversationId: input.conversationId,
		sourceType: input.sourceType,
		channelType: input.channelType,
		title: input.title,
		provenance: {
			sourceId: '',
			sourceType: input.sourceType,
			channelType: input.channelType,
			channelEventType: input.channelEventType,
			externalEventId: input.externalEventId,
			externalConversationId: input.externalConversationId,
			externalChannelId: input.externalChannelId,
			externalUserId: input.externalUserId,
			externalMessageId: input.externalMessageId,
			replyToExternalMessageId: input.replyToExternalMessageId,
			editVersion: input.editVersion,
			originStudioArtifactId: input.originStudioArtifactId,
			parentSourceId: input.parentSourceId,
			derivedFromSourceId: input.derivedFromSourceId,
			filename: input.filename,
			zipPath: input.zipPath,
			language: input.language,
			capturedAt,
			extractorType: 'builder-runtime',
			confidence: 1,
			hash: sha256(`${input.workspaceId}:${input.title}:${capturedAt}`),
			policyClassification: input.policyClassification ?? 'internal',
		},
		policyClassification: input.policyClassification ?? 'internal',
		approvalState: input.approvalState ?? 'draft',
		hash: sha256(`${input.workspaceId}:${input.title}:${capturedAt}`),
		parentSourceId: input.parentSourceId,
		derivedFromSourceId: input.derivedFromSourceId,
		supersedesSourceId: input.supersedesSourceId,
		createdAt: capturedAt,
		updatedAt: capturedAt,
	};
}
