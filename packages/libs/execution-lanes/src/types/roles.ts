import type { LaneKey } from './core';
import type { ExecutionLaneEvidenceIdentifier } from './identifiers';

export type RoleRoutingRole = 'leader' | 'specialist' | 'executor' | 'reviewer';

export type RolePosture =
	| 'orchestrator'
	| 'critic'
	| 'builder'
	| 'verifier'
	| 'researcher';

export type RoleToolPermission =
	| 'read'
	| 'analyze'
	| 'execute'
	| 'network'
	| 'review';

export type RoleWriteScope =
	| 'none'
	| 'artifacts-only'
	| 'workspace'
	| 'scoped-worktree';

export interface RoleProfile {
	key: string;
	description: string;
	routingRole: RoleRoutingRole;
	posture: RolePosture;
	allowedTools: RoleToolPermission[];
	writeScope: RoleWriteScope;
	laneCompatibility: LaneKey[];
	evidenceObligations: ExecutionLaneEvidenceIdentifier[];
	escalationTriggers: string[];
	modelProfileHint?: string;
}

export interface StaffingRecommendation {
	lane: LaneKey;
	roleKeys: string[];
	launchHints: string[];
	why: string;
}
