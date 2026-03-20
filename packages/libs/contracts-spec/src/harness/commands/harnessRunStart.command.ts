import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';
import { HarnessRunStartedEvent } from '../events/harnessRunStarted.event';
import { HarnessRunModel } from '../models';

const HarnessRunStartInput = new SchemaModel({
	name: 'HarnessRunStartInput',
	fields: {
		scenarioKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
		suiteKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
		mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		targetId: { type: ScalarTypeEnum.ID(), isOptional: true },
		actorId: { type: ScalarTypeEnum.ID(), isOptional: true },
		workspaceId: { type: ScalarTypeEnum.ID(), isOptional: true },
		controlPlaneExecutionId: {
			type: ScalarTypeEnum.ID(),
			isOptional: true,
		},
		metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const HarnessRunStartOutput = new SchemaModel({
	name: 'HarnessRunStartOutput',
	fields: {
		run: { type: HarnessRunModel, isOptional: false },
	},
});

export const HarnessRunStartCommand = defineCommand({
	meta: {
		key: 'harness.run.start',
		title: 'Start Harness Run',
		version: '1.0.0',
		description: 'Start a harness run for a scenario or suite.',
		goal: 'Launch a bounded, evidence-producing harness session.',
		context: 'Used by agents, QA flows, and evaluation runners.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'run', 'start'],
		stability: HARNESS_STABILITY,
	},
	capability: { key: 'harness.execution', version: '1.0.0' },
	io: {
		input: HarnessRunStartInput,
		output: HarnessRunStartOutput,
		errors: {
			SCENARIO_OR_SUITE_REQUIRED: {
				description: 'A scenario or suite key is required.',
				http: 400,
				when: 'Neither scenarioKey nor suiteKey is provided.',
			},
		},
	},
	policy: {
		auth: 'user',
		pii: [],
	},
	sideEffects: {
		emits: [
			{
				ref: HarnessRunStartedEvent.meta,
				when: 'A new harness run is created and execution begins.',
			},
		],
	},
});
