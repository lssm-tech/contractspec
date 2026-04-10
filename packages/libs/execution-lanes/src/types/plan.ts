import type {
	AuthorityContextRefs,
	ExecutionScopeClass,
	LaneKey,
} from './core';

export interface ExecutionPlanTradeoff {
	topic: string;
	tension: string;
	chosenDirection: string;
	rejectedAlternatives: string[];
}

export interface ExecutionPlanStep {
	id: string;
	title: string;
	description: string;
	acceptanceCriteria: string[];
	dependencies?: string[];
	roleHints?: string[];
}

export interface ExecutionPlanPack {
	meta: {
		id: string;
		createdAt: string;
		sourceRequest: string;
		scopeClass: ExecutionScopeClass;
	};
	objective: string;
	constraints: string[];
	assumptions: string[];
	nonGoals: string[];
	tradeoffs: ExecutionPlanTradeoff[];
	staffing: {
		availableRoleProfiles: string[];
		recommendedLanes: Array<{
			lane: LaneKey;
			why: string;
		}>;
		handoffRecommendation: {
			nextLane: LaneKey;
			launchHints: string[];
		};
	};
	planSteps: ExecutionPlanStep[];
	verification: {
		requiredEvidence: string[];
		requiredApprovals: string[];
		blockingRisks: string[];
	};
	authorityContext: AuthorityContextRefs;
}
