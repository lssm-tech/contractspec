export type PolicyAudience = 'repo' | 'consumer';

export type PolicyEngine =
	| 'biome-native'
	| 'biome-grit'
	| 'contractspec-ci'
	| 'ai-doc';

export type PolicySeverity = 'off' | 'warn' | 'error';

export interface ContractSpecPolicyRule {
	id: string;
	audience: PolicyAudience;
	engine: PolicyEngine;
	severity: PolicySeverity;
	files: string[];
	message: string;
	options?: Record<string, unknown>;
	docsSource: string;
}

export interface GeneratedBiomeArtifacts {
	preset: string;
	plugins: Record<string, string>;
	aiRules: string;
}
