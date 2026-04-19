import type {
	AgentSpec,
	AgentToolConfig,
} from '@contractspec/lib.contracts-spec/agent';
import { defineAgent } from '@contractspec/lib.contracts-spec/agent';
import { createSupportBotI18n } from './i18n';
import type { SupportBotSpec, SupportBotThresholds } from './types';

export interface SupportBotDefinition {
	base: AgentSpec;
	tools?: AgentToolConfig[];
	thresholds?: SupportBotThresholds;
	review?: SupportBotSpec['review'];
}

export function defineSupportBot(
	definition: SupportBotDefinition
): SupportBotSpec {
	const { t } = createSupportBotI18n(definition.base.locale);
	const thresholds = definition.thresholds;
	const base = defineAgent({
		...definition.base,
		policy: {
			...definition.base.policy,
			confidence: {
				...definition.base.policy?.confidence,
				min: definition.base.policy?.confidence?.min ?? 0.7,
				default: definition.base.policy?.confidence?.default ?? 0.6,
			},
			escalation: {
				...definition.base.policy?.escalation,
				confidenceThreshold:
					thresholds?.escalationConfidenceThreshold ??
					definition.base.policy?.escalation?.confidenceThreshold ??
					definition.base.policy?.confidence?.min ??
					0.7,
			},
		},
		memory: definition.base.memory ?? { maxEntries: 120, ttlMinutes: 120 },
		tools: definition.tools ?? definition.base.tools,
		instructions: `${definition.base.instructions}\n\n${t('spec.instructionsAppendix')}`,
	});

	return {
		...base,
		review: definition.review,
		thresholds: {
			autoResolveMinConfidence: thresholds?.autoResolveMinConfidence ?? 0.75,
			maxIterations: thresholds?.maxIterations ?? 6,
		},
	};
}
