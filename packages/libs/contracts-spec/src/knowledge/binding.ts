export interface AppKnowledgeBinding {
	/** Which KnowledgeSpace to use. */
	spaceKey: string;
	spaceVersion?: string;
	/** Optional source selector for tenant-safe provider-backed knowledge. */
	source?: {
		sourceIds?: string[];
		integrationConnectionId?: string;
		allowShared?: boolean;
	};
	/** Optional: scope to specific workflows/agents. */
	scope?: {
		workflows?: string[];
		agents?: string[];
		operations?: string[];
	};
	/** Usage constraints. */
	constraints?: {
		/** Max tokens per query. */
		maxTokensPerQuery?: number;
		/** Max queries per minute. */
		maxQueriesPerMinute?: number;
	};
	/** Priority when multiple spaces overlap. */
	priority?: number;
	/** Whether access to the space is required (blocking) or optional. */
	required?: boolean;
}
