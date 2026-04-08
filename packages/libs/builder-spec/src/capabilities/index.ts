import {
	type CapabilityKind,
	defineCapability,
} from '@contractspec/lib.contracts-spec';
import {
	BUILDER_OWNERS,
	BUILDER_STABILITY,
	BUILDER_TAGS,
	BUILDER_VERSION,
} from '../constants';

function createBuilderCapability(
	key: string,
	kind: CapabilityKind,
	description: string
) {
	return defineCapability({
		meta: {
			key,
			version: BUILDER_VERSION,
			kind,
			stability: BUILDER_STABILITY,
			description,
			owners: BUILDER_OWNERS,
			tags: BUILDER_TAGS,
		},
	});
}

export const BuilderChatWebCapability = createBuilderCapability(
	'builder.chat.web',
	'ui',
	'Guided web chat for Builder control-plane authoring.'
);
export const BuilderVoiceWebCapability = createBuilderCapability(
	'builder.voice.web',
	'ui',
	'Browser voice intake and transcript confirmation for Builder.'
);
export const BuilderSttCapability = createBuilderCapability(
	'builder.stt',
	'integration',
	'Provider-agnostic speech-to-text ingestion for Builder.'
);
export const BuilderIngestFilesCapability = createBuilderCapability(
	'builder.ingest.files',
	'integration',
	'Upload and parse Builder file inputs.'
);
export const BuilderIngestPdfCapability = createBuilderCapability(
	'builder.ingest.pdf',
	'integration',
	'Extract text and provenance from PDF Builder inputs.'
);
export const BuilderIngestImagesCapability = createBuilderCapability(
	'builder.ingest.images',
	'integration',
	'Extract OCR and structural evidence from image Builder inputs.'
);
export const BuilderIngestZipCapability = createBuilderCapability(
	'builder.ingest.zip',
	'integration',
	'Quarantine and expand zipped Builder source bundles.'
);
export const BuilderImportStudioCapability = createBuilderCapability(
	'builder.import.studio',
	'api',
	'Import approved Studio snapshots into Builder.'
);
export const BuilderChannelsTelegramCapability = createBuilderCapability(
	'builder.channels.telegram',
	'integration',
	'Telegram control-channel ingress and outbound change cards for Builder.'
);
export const BuilderChannelsWhatsappCapability = createBuilderCapability(
	'builder.channels.whatsapp',
	'integration',
	'WhatsApp control-channel ingress and outbound change cards for Builder.'
);
export const BuilderChannelsInteractiveCapability = createBuilderCapability(
	'builder.channels.interactive',
	'integration',
	'Interactive control-channel replies for Builder messaging surfaces.'
);
export const BuilderFusionResolveCapability = createBuilderCapability(
	'builder.fusion.resolve',
	'api',
	'Conflict detection and precedence-based source fusion for Builder.'
);
export const BuilderPlanCompileCapability = createBuilderCapability(
	'builder.plan.compile',
	'api',
	'Compile Builder blueprints into execution-lane plans.'
);
export const BuilderPlanExecuteCapability = createBuilderCapability(
	'builder.plan.execute',
	'api',
	'Execute Builder plans through governed execution lanes.'
);
export const BuilderPreviewGenerateCapability = createBuilderCapability(
	'builder.preview.generate',
	'api',
	'Assemble Builder previews and review artifacts.'
);
export const BuilderHarnessRunCapability = createBuilderCapability(
	'builder.harness.run',
	'api',
	'Run Builder readiness and replay verification suites.'
);
export const BuilderRuntimeTargetsCapability = createBuilderCapability(
	'builder.runtime.targets',
	'api',
	'Register, inspect, and quarantine Builder runtime targets.'
);
export const BuilderProviderRoutingCapability = createBuilderCapability(
	'builder.provider.routing',
	'api',
	'Maintain explicit provider routing policy and provider availability for Builder.'
);
export const BuilderProviderExecutionCapability = createBuilderCapability(
	'builder.provider.execution',
	'api',
	'Normalize provider execution context bundles, receipts, patch proposals, and comparison runs.'
);
export const BuilderMobileReviewCapability = createBuilderCapability(
	'builder.mobile.review',
	'ui',
	'Deliver mobile review cards and deep-link review surfaces for Builder.'
);
export const BuilderExportPrepareCapability = createBuilderCapability(
	'builder.export.prepare',
	'api',
	'Prepare governed Builder export bundles.'
);

export const BUILDER_CAPABILITIES = [
	BuilderChatWebCapability,
	BuilderVoiceWebCapability,
	BuilderSttCapability,
	BuilderIngestFilesCapability,
	BuilderIngestPdfCapability,
	BuilderIngestImagesCapability,
	BuilderIngestZipCapability,
	BuilderImportStudioCapability,
	BuilderChannelsTelegramCapability,
	BuilderChannelsWhatsappCapability,
	BuilderChannelsInteractiveCapability,
	BuilderFusionResolveCapability,
	BuilderPlanCompileCapability,
	BuilderPlanExecuteCapability,
	BuilderPreviewGenerateCapability,
	BuilderHarnessRunCapability,
	BuilderRuntimeTargetsCapability,
	BuilderProviderRoutingCapability,
	BuilderProviderExecutionCapability,
	BuilderMobileReviewCapability,
	BuilderExportPrepareCapability,
] as const;

export type BuilderCapabilityKey =
	(typeof BUILDER_CAPABILITIES)[number]['meta']['key'];
