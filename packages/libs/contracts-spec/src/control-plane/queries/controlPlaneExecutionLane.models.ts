import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

export const ControlPlaneExecutionLaneStateModel = new SchemaModel({
	name: 'ControlPlaneExecutionLaneState',
	fields: {
		laneKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		laneStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		lanePhase: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		ownerRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		evidenceBundleCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: true,
		},
		pendingApprovalCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: true,
		},
		recommendedNextLane: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
	},
});

export const ControlPlaneExecutionLaneSummaryModel = new SchemaModel({
	name: 'ControlPlaneExecutionLaneSummary',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		laneKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		laneStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		lanePhase: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		ownerRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		objective: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		evidenceCompleteness: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		terminalReadiness: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		pendingApprovalCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: false,
		},
		missingEvidenceCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: true,
		},
		missingApprovalCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: true,
		},
		recommendedNextLane: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneExecutionLaneDetailModel = new SchemaModel({
	name: 'ControlPlaneExecutionLaneDetail',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		laneKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		laneStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		lanePhase: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		ownerRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		objective: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		teamStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		completionPhase: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		terminalReadiness: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		missingEvidence: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		missingApprovals: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		blockingRisks: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		recommendedNextLane: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		evidenceBundleCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: false,
		},
		approvalCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		transitionCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		queueSkew: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		cleanupStatus: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		retryCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		snapshotRef: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});
