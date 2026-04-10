import type { RiskLevel } from '@contractspec/lib.provider-spec';
import type {
	BuilderAssumptionSeverity,
	BuilderAssumptionStatus,
	BuilderConflictStatus,
} from '../enums';

export interface BuilderAssumption {
	id: string;
	workspaceId: string;
	statement: string;
	severity: BuilderAssumptionSeverity;
	sourceIds: string[];
	status: BuilderAssumptionStatus;
	createdAt: string;
	updatedAt: string;
}

export interface BuilderConflict {
	id: string;
	workspaceId: string;
	fieldPath: string;
	summary: string;
	sourceIds: string[];
	severity: RiskLevel;
	status: BuilderConflictStatus;
	resolvedByDecisionReceiptId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface BuilderDecisionReceipt {
	id: string;
	workspaceId: string;
	resolvedAt: string;
	actorRef: string;
	decisionType:
		| 'merge'
		| 'override'
		| 'approval'
		| 'confirmation'
		| 'retract'
		| 'provider_proposal';
	affectedFields: string[];
	supportingSourceIds: string[];
	supersededSourceIds: string[];
	policyVerdicts: string[];
	requiresHumanReview: boolean;
	traceId: string;
}

export interface BuilderCoverageField {
	fieldPath: string;
	sourceIds: string[];
	decisionReceiptIds: string[];
	explicit: boolean;
	conflicted: boolean;
	locked: boolean;
	confidence: number;
}

export interface BuilderCoverageReport {
	explicitCount: number;
	inferredCount: number;
	conflictedCount: number;
	missingCount: number;
	fields: BuilderCoverageField[];
}

export interface BuilderFusionGraphEdge {
	id: string;
	workspaceId: string;
	fromNodeId: string;
	toNodeId: string;
	relationship:
		| 'supports'
		| 'conflicts'
		| 'supersedes'
		| 'locks'
		| 'derived_from'
		| 'resolved_by';
	createdAt: string;
}
