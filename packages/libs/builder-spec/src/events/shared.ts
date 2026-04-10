import {
	type CapabilityRef,
	defineEvent,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
	BUILDER_DOMAIN,
	BUILDER_OWNERS,
	BUILDER_STABILITY,
	BUILDER_TAGS,
	BUILDER_VERSION,
} from '../constants';

const BuilderEventPayload = new SchemaModel({
	name: 'BuilderEventPayload',
	fields: {
		workspaceId: { type: ScalarTypeEnum.ID(), isOptional: false },
		entityId: { type: ScalarTypeEnum.ID(), isOptional: true },
		traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		data: { type: ScalarTypeEnum.JSON(), isOptional: true },
		sourceIds: {
			type: ScalarTypeEnum.String_unsecure(),
			isArray: true,
			isOptional: true,
		},
		occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export function createBuilderEvent(
	key: string,
	description: string,
	capability: CapabilityRef
) {
	return defineEvent({
		meta: {
			key,
			version: BUILDER_VERSION,
			description,
			domain: BUILDER_DOMAIN,
			owners: BUILDER_OWNERS,
			tags: BUILDER_TAGS,
			stability: BUILDER_STABILITY,
		},
		capability,
		pii: [],
		payload: BuilderEventPayload,
	});
}
