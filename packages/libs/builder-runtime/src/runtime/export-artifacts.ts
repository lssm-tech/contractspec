import type {
	BuilderBlueprint,
	BuilderExportBundle,
	BuilderPreview,
} from '@contractspec/lib.builder-spec';
import type {
	ExternalExecutionReceipt,
	RuntimeMode,
} from '@contractspec/lib.provider-spec';
import { sha256 } from '../utils/hash';

type BuilderExportTargetType = BuilderExportBundle['targetType'];

function sortStrings(values: string[]) {
	return [...values].sort((left, right) => left.localeCompare(right));
}

function createReceiptSignature(receipt: ExternalExecutionReceipt) {
	return {
		contextHash: receipt.contextHash,
		outputArtifactHashes: sortStrings(receipt.outputArtifactHashes),
		providerId: receipt.providerId,
		runtimeMode: receipt.runtimeMode,
		runtimeTargetRef: receipt.runtimeTargetRef ?? null,
		status: receipt.status,
		taskType: receipt.taskType,
		verificationRefs: sortStrings(receipt.verificationRefs),
	};
}

function createBlueprintSignature(blueprint: BuilderBlueprint) {
	return {
		appBrief: blueprint.appBrief,
		assumptions: blueprint.assumptions.map((assumption) => ({
			severity: assumption.severity,
			sourceIds: sortStrings(assumption.sourceIds),
			statement: assumption.statement,
			status: assumption.status,
		})),
		channelSurfaces: blueprint.channelSurfaces,
		coverageReport: {
			conflictedCount: blueprint.coverageReport.conflictedCount,
			explicitCount: blueprint.coverageReport.explicitCount,
			fields: blueprint.coverageReport.fields.map((field) => ({
				confidence: field.confidence,
				conflicted: field.conflicted,
				decisionReceiptIds: sortStrings(field.decisionReceiptIds),
				explicit: field.explicit,
				fieldPath: field.fieldPath,
				locked: field.locked,
				sourceIds: sortStrings(field.sourceIds),
			})),
			inferredCount: blueprint.coverageReport.inferredCount,
			missingCount: blueprint.coverageReport.missingCount,
		},
		domainObjects: blueprint.domainObjects,
		featureParity: blueprint.featureParity,
		integrations: blueprint.integrations,
		lockedFieldPaths: sortStrings(blueprint.lockedFieldPaths),
		openQuestions: [...blueprint.openQuestions],
		personas: blueprint.personas,
		policies: sortStrings(blueprint.policies),
		runtimeProfiles: blueprint.runtimeProfiles,
		surfaces: blueprint.surfaces,
		version: blueprint.version,
		workflows: blueprint.workflows,
	};
}

function createExportSignature(input: {
	blueprint: BuilderBlueprint;
	executionReceipts: ExternalExecutionReceipt[];
	preview: BuilderPreview;
	runtimeMode: RuntimeMode;
	runtimeTargetRef?: string;
	targetType: BuilderExportTargetType;
	workspaceId: string;
}) {
	return sha256(
		JSON.stringify({
			blueprint: createBlueprintSignature(input.blueprint),
			preview: {
				buildStatus: input.preview.buildStatus,
				dataMode: input.preview.dataMode,
				generatedWorkspaceRef: input.preview.generatedWorkspaceRef,
				previewUrl: input.preview.previewUrl ?? null,
				runtimeMode: input.preview.runtimeMode,
				runtimeTargetId: input.preview.runtimeTargetId ?? null,
			},
			receipts: input.executionReceipts
				.map(createReceiptSignature)
				.sort((left, right) =>
					JSON.stringify(left).localeCompare(JSON.stringify(right))
				),
			runtimeMode: input.runtimeMode,
			runtimeTargetRef: input.runtimeTargetRef ?? null,
			targetType: input.targetType,
			workspaceId: input.workspaceId,
		})
	);
}

export function createBuilderExportArtifactRefs(input: {
	blueprint: BuilderBlueprint;
	executionReceipts: ExternalExecutionReceipt[];
	preview: BuilderPreview;
	runtimeMode: RuntimeMode;
	runtimeTargetRef?: string;
	targetType: BuilderExportTargetType;
	workspaceId: string;
}) {
	const signature = createExportSignature(input);
	return [
		`builder://artifact/export/${signature}`,
		input.preview.previewUrl ?? `builder://preview/${signature}`,
		input.preview.generatedWorkspaceRef,
	];
}

export function createBuilderExportVerificationRef(input: {
	blueprint: BuilderBlueprint;
	executionReceipts: ExternalExecutionReceipt[];
	preview: BuilderPreview;
	runtimeMode: RuntimeMode;
	runtimeTargetRef?: string;
	targetType: BuilderExportTargetType;
	workspaceId: string;
}) {
	return `builder://verification/export/${createExportSignature(input)}`;
}

export function matchesBuilderExportArtifactRefs(input: {
	artifactRefs: string[];
	blueprint: BuilderBlueprint;
	executionReceipts: ExternalExecutionReceipt[];
	preview: BuilderPreview;
	runtimeMode: RuntimeMode;
	runtimeTargetRef?: string;
	targetType: BuilderExportTargetType;
	workspaceId: string;
}) {
	const expected = createBuilderExportArtifactRefs(input);
	return (
		input.artifactRefs.length === expected.length &&
		input.artifactRefs.every(
			(artifactRef, index) => artifactRef === expected[index]
		)
	);
}
