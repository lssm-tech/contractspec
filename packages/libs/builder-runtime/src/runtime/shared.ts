import type {
	BuilderApprovalTicket,
	BuilderBlueprint,
} from '@contractspec/lib.builder-spec';
import type {
	RuntimeMode,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';
import type { BuilderChannelInboundEnvelope } from '../ingestion';

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function readStringArray(value: unknown): string[] {
	return Array.isArray(value)
		? value.filter((item): item is string => typeof item === 'string')
		: [];
}

export function readRuntimeMode(
	value: unknown,
	fallback: RuntimeMode = 'managed'
): RuntimeMode {
	return value === 'local' || value === 'hybrid' || value === 'managed'
		? value
		: fallback;
}

export function readProviderKinds(
	value: unknown
): RuntimeTarget['capabilityProfile']['availableProviders'] {
	return readStringArray(value);
}

export function requestedViaForChannel(
	channelType: BuilderChannelInboundEnvelope['channelType']
): BuilderApprovalTicket['requestedVia'] {
	if (channelType === 'telegram') return 'telegram';
	if (channelType === 'whatsapp') return 'whatsapp';
	return 'web_ui';
}

function normalizeFieldPath(
	fieldPath: string
): keyof BuilderBlueprint | 'brief' {
	return fieldPath === 'appBrief'
		? 'brief'
		: (fieldPath as keyof BuilderBlueprint);
}

export interface BuilderStructuredOperation {
	fieldPath: string;
	mode?: 'replace' | 'append' | 'remove';
	value: unknown;
}

export function applyStructuredPatch(
	blueprint: BuilderBlueprint,
	operation: BuilderStructuredOperation
): BuilderBlueprint {
	const fieldPath = normalizeFieldPath(operation.fieldPath);
	const mode = operation.mode ?? 'replace';
	if (fieldPath === 'brief') {
		return {
			...blueprint,
			appBrief:
				typeof operation.value === 'string'
					? operation.value
					: blueprint.appBrief,
		};
	}
	const currentValue = blueprint[fieldPath];
	if (Array.isArray(currentValue)) {
		let nextValue = [...currentValue] as unknown[];
		if (mode === 'append') {
			nextValue = [...currentValue, operation.value];
		} else if (mode === 'remove') {
			nextValue = currentValue.filter((item) => item !== operation.value);
		} else if (Array.isArray(operation.value)) {
			nextValue = operation.value;
		}
		return {
			...blueprint,
			[fieldPath]: nextValue,
		} as BuilderBlueprint;
	}
	return blueprint;
}
