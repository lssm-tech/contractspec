export type RuntimeMode = 'managed' | 'local' | 'hybrid';
export type ProviderKind =
	| 'conversational'
	| 'coding'
	| 'stt'
	| 'vision'
	| 'evaluation';

export interface RuntimeTarget {
	id: string;
	workspaceId: string;
	runtimeMode: RuntimeMode;
	type:
		| 'managed_workspace'
		| 'local_daemon'
		| 'local_appliance'
		| 'hybrid_bridge';
	displayName: string;
	capabilityProfile: {
		supportsPreview: boolean;
		supportsExport: boolean;
		availableProviders: string[];
		dataLocality: 'managed' | 'local' | 'mixed';
	};
}

export interface ExternalExecutionProvider {
	id: string;
	displayName: string;
	providerKind: ProviderKind;
	supportedRuntimeModes: RuntimeMode[];
	supportedTaskTypes: string[];
	capabilityProfile: {
		supportsStructuredDiff: boolean;
		supportsLongContext: boolean;
		supportsSTT: boolean;
		supportsLocalExecution: boolean;
	};
}

export interface ExternalExecutionContextBundle {
	id: string;
	workspaceId: string;
	taskType: string;
	blueprintRef: string;
	sourceRefs: string[];
	policyRefs: string[];
	allowedWriteScopes: string[];
	runtimeTargetRef?: string;
	acceptanceCriteria: string[];
	hash: string;
}

export interface ExternalPatchProposal {
	id: string;
	runId: string;
	summary: string;
	changedAreas: string[];
	diffHash: string;
	riskLevel: 'low' | 'medium' | 'high' | 'critical';
	verificationRequirements: string[];
	status:
		| 'proposed'
		| 'accepted_for_preview'
		| 'rejected'
		| 'superseded'
		| 'merged_into_blueprint';
}
