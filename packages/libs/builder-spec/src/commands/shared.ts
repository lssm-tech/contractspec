import {
	type CapabilityRef,
	defineCommand,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
	BUILDER_DOMAIN,
	BUILDER_OWNERS,
	BUILDER_STABILITY,
	BUILDER_TAGS,
	BUILDER_VERSION,
} from '../constants';

const BuilderCommandInput = new SchemaModel({
	name: 'BuilderCommandInput',
	fields: {
		workspaceId: { type: ScalarTypeEnum.ID(), isOptional: false },
		entityId: { type: ScalarTypeEnum.ID(), isOptional: true },
		conversationId: { type: ScalarTypeEnum.ID(), isOptional: true },
		traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
		sourceIds: {
			type: ScalarTypeEnum.String_unsecure(),
			isArray: true,
			isOptional: true,
		},
	},
});

const BuilderCommandOutput = new SchemaModel({
	name: 'BuilderCommandOutput',
	fields: {
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		entityId: { type: ScalarTypeEnum.ID(), isOptional: true },
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		data: { type: ScalarTypeEnum.JSON(), isOptional: true },
	},
});

export function createBuilderCommand(
	key: string,
	title: string,
	description: string,
	capability: CapabilityRef
) {
	return defineCommand({
		meta: {
			key,
			title,
			version: BUILDER_VERSION,
			description,
			goal: description,
			context: 'Builder governed authoring control-plane command.',
			domain: BUILDER_DOMAIN,
			owners: BUILDER_OWNERS,
			tags: BUILDER_TAGS,
			stability: BUILDER_STABILITY,
		},
		capability,
		io: {
			input: BuilderCommandInput,
			output: BuilderCommandOutput,
		},
		policy: {
			auth: 'user',
			pii: [],
		},
	});
}
