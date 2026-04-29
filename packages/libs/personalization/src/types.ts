import type { PolicyDecision } from '@contractspec/lib.contracts-spec';
import type {
	DataViewCollectionMode,
	DataViewDataDepth,
	DataViewDensity,
} from '@contractspec/lib.contracts-spec/data-views';

export type BehaviorEventType =
	| 'field_access'
	| 'feature_usage'
	| 'workflow_step'
	| 'data_view_interaction';

export interface AuthorizationDecisionSummary
	extends Pick<
		PolicyDecision,
		'effect' | 'reason' | 'missing' | 'matched' | 'source'
	> {
	fields?: string[];
	actions?: string[];
}

export interface BehaviorEventBase {
	id?: string;
	tenantId: string;
	userId?: string;
	role?: string;
	roles?: string[];
	permissions?: string[];
	policyDecisions?: Record<string, AuthorizationDecisionSummary>;
	device?: string;
	timestamp: number;
	metadata?: Record<string, unknown>;
}

export interface FieldAccessEvent extends BehaviorEventBase {
	type: 'field_access';
	operation: string;
	field: string;
}

export interface FeatureUsageEvent extends BehaviorEventBase {
	type: 'feature_usage';
	feature: string;
	action: 'opened' | 'completed' | 'dismissed';
}

export interface WorkflowStepEvent extends BehaviorEventBase {
	type: 'workflow_step';
	workflow: string;
	step: string;
	status: 'entered' | 'completed' | 'skipped' | 'errored';
}

export type DataViewInteractionAction =
	| 'opened'
	| 'view_mode_changed'
	| 'density_changed'
	| 'data_depth_changed'
	| 'search_changed'
	| 'filter_changed'
	| 'sort_changed'
	| 'page_changed';

export interface DataViewInteractionEvent extends BehaviorEventBase {
	type: 'data_view_interaction';
	dataViewKey: string;
	dataViewVersion?: string;
	action: DataViewInteractionAction;
	viewMode?: DataViewCollectionMode;
	density?: DataViewDensity;
	dataDepth?: DataViewDataDepth;
	filterKey?: string;
	sortField?: string;
	page?: number;
	pageSize?: number;
}

export type BehaviorEvent =
	| FieldAccessEvent
	| FeatureUsageEvent
	| WorkflowStepEvent
	| DataViewInteractionEvent;

export interface BehaviorQuery {
	tenantId?: string;
	userId?: string;
	role?: string;
	roles?: string[];
	permission?: string;
	permissions?: string[];
	feature?: string;
	operation?: string;
	workflow?: string;
	dataViewKey?: string;
	dataViewAction?: DataViewInteractionAction;
	since?: number;
	until?: number;
	limit?: number;
}

export interface BehaviorSummary {
	fieldCounts: Record<string, number>;
	featureCounts: Record<string, number>;
	workflowStepCounts: Record<string, Record<string, number>>;
	dataViewInteractionCounts?: Record<
		string,
		Partial<Record<DataViewInteractionAction, number>>
	>;
	dataViewViewModeCounts?: Record<
		string,
		Partial<Record<DataViewCollectionMode, number>>
	>;
	totalEvents: number;
	deniedFieldCounts?: Record<string, number>;
	deniedActionCounts?: Record<string, number>;
}

export interface DataViewPreferenceInsights {
	preferredViewMode?: DataViewCollectionMode;
}

export interface BehaviorInsights {
	unusedFields: string[];
	frequentlyUsedFields: string[];
	suggestedHiddenFields: string[];
	deniedFields?: string[];
	deniedActions?: string[];
	workflowBottlenecks: {
		workflow: string;
		step: string;
		dropRate: number;
	}[];
	layoutPreference?: 'form' | 'grid' | 'list' | 'table';
	dataViewPreferences?: Record<string, DataViewPreferenceInsights>;
}
