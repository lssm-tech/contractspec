import {
	type CapabilityRef,
	defineQuery,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
	BUILDER_DOMAIN,
	BUILDER_OWNERS,
	BUILDER_STABILITY,
	BUILDER_TAGS,
	BUILDER_VERSION,
} from '../constants';

const BuilderQueryInput = new SchemaModel({
	name: 'BuilderQueryInput',
	fields: {
		workspaceId: { type: ScalarTypeEnum.ID(), isOptional: true },
		entityId: { type: ScalarTypeEnum.ID(), isOptional: true },
		conversationId: { type: ScalarTypeEnum.ID(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		filter: { type: ScalarTypeEnum.JSON(), isOptional: true },
	},
});

const BuilderQueryOutput = new SchemaModel({
	name: 'BuilderQueryOutput',
	fields: {
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		data: { type: ScalarTypeEnum.JSON(), isOptional: true },
		count: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export function createBuilderQuery(
	key: string,
	title: string,
	description: string,
	capability: CapabilityRef
) {
	return defineQuery({
		meta: {
			key,
			title,
			version: BUILDER_VERSION,
			description,
			goal: description,
			context: 'Builder governed authoring read operation.',
			domain: BUILDER_DOMAIN,
			owners: BUILDER_OWNERS,
			tags: BUILDER_TAGS,
			stability: BUILDER_STABILITY,
		},
		capability,
		io: {
			input: BuilderQueryInput,
			output: BuilderQueryOutput,
		},
		policy: {
			auth: 'user',
			pii: [],
		},
	});
}
