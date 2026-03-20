/**
 * Contracts-spec context for ai-chat.
 * Exposes agent, data-views, operations, forms, and presentations to the model.
 */
import type { AgentToolConfig } from '@contractspec/lib.ai-agent';

export interface ContractsContextConfig {
	/** Agent specs (for tool schemas, instructions) */
	agentSpecs?: { key: string; tools?: AgentToolConfig[] }[];
	/** Data view specs (for query suggestions, filters) */
	dataViewSpecs?: {
		key: string;
		meta: { title?: string };
		source?: unknown;
	}[];
	/** Form specs (for rendering or generating form configs) */
	formSpecs?: {
		key: string;
		meta: { title?: string };
		fields?: unknown[];
	}[];
	/** Presentation specs (for rendering tool outputs) */
	presentationSpecs?: {
		key: string;
		meta: { title?: string };
		targets?: string[];
	}[];
	/** Operation refs the chat can invoke via tools */
	operationRefs?: { key: string; version: string }[];
}

/**
 * Builds a prompt section describing available contracts-spec resources.
 * Append to system prompt when contractsContext is set.
 */
export function buildContractsContextPrompt(
	config: ContractsContextConfig
): string {
	const parts: string[] = [];

	if (
		!config.agentSpecs?.length &&
		!config.dataViewSpecs?.length &&
		!config.formSpecs?.length &&
		!config.presentationSpecs?.length &&
		!config.operationRefs?.length
	) {
		return '';
	}

	parts.push('\n\n## Available resources');

	if (config.agentSpecs?.length) {
		parts.push('\n### Agent tools');
		for (const agent of config.agentSpecs) {
			const toolNames = agent.tools?.map((t) => t.name).join(', ') ?? 'none';
			parts.push(`- **${agent.key}**: tools: ${toolNames}`);
		}
	}

	if (config.dataViewSpecs?.length) {
		parts.push('\n### Data views');
		for (const dv of config.dataViewSpecs) {
			parts.push(`- **${dv.key}**: ${dv.meta.title ?? dv.key}`);
		}
	}

	if (config.formSpecs?.length) {
		parts.push('\n### Forms');
		for (const form of config.formSpecs) {
			parts.push(`- **${form.key}**: ${form.meta.title ?? form.key}`);
		}
	}

	if (config.presentationSpecs?.length) {
		parts.push('\n### Presentations');
		for (const pres of config.presentationSpecs) {
			parts.push(
				`- **${pres.key}**: ${pres.meta.title ?? pres.key} (targets: ${pres.targets?.join(', ') ?? 'react'})`
			);
		}
	}

	if (config.operationRefs?.length) {
		parts.push('\n### Operations');
		for (const op of config.operationRefs) {
			parts.push(`- **${op.key}@${op.version}**`);
		}
	}

	parts.push(
		'\nUse the available tools to invoke operations, query data views, or propose surface changes when appropriate.'
	);

	return parts.join('\n');
}
