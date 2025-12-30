export interface AppKnowledgeBinding {
  /** Which KnowledgeSpace to use. */
  spaceKey: string;
  spaceVersion?: string;
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
