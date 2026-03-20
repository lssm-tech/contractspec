import {
	defineCommand,
	defineQuery,
} from '@contractspec/lib.contracts-spec/operations';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

/** Task entity schema - id, title, done */
export const TaskRecord = new SchemaModel({
	name: 'TaskRecord',
	description: 'A task with id, title, and done status.',
	fields: {
		id: { type: ScalarTypeEnum.ID(), isOptional: false },
		title: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		done: { type: ScalarTypeEnum.Boolean(), isOptional: false },
	},
});

const TaskListOutput = new SchemaModel({
	name: 'TaskListOutput',
	description: 'List of tasks.',
	fields: {
		tasks: {
			type: TaskRecord,
			isArray: true,
			isOptional: false,
		},
	},
});

const TaskCreateInput = new SchemaModel({
	name: 'TaskCreateInput',
	description: 'Input for creating a task.',
	fields: {
		title: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
	},
});

const TaskUpdateStatusInput = new SchemaModel({
	name: 'TaskUpdateStatusInput',
	description: 'Input for toggling task done status.',
	fields: {
		id: { type: ScalarTypeEnum.ID(), isOptional: false },
		done: { type: ScalarTypeEnum.Boolean(), isOptional: false },
	},
});

export const TaskListQuery = defineQuery({
	meta: {
		key: 'task.list',
		version: '1.0.0',
		description: 'List all tasks.',
		goal: 'Provide the task list for the mobile app.',
		context: 'Used by TaskListScreen.',
		owners: ['@platform.core'],
		tags: ['task', 'mobile'],
		stability: 'experimental',
	},
	io: {
		input: null,
		output: TaskListOutput,
	},
	policy: {
		auth: 'anonymous',
	},
});

export const TaskCreateCommand = defineCommand({
	meta: {
		key: 'task.create',
		version: '1.0.0',
		description: 'Create a new task.',
		goal: 'Add a task to the list.',
		context: 'Used by TaskFormScreen.',
		owners: ['@platform.core'],
		tags: ['task', 'mobile'],
		stability: 'experimental',
	},
	io: {
		input: TaskCreateInput,
		output: TaskRecord,
	},
	policy: {
		auth: 'anonymous',
	},
});

export const TaskUpdateStatusCommand = defineCommand({
	meta: {
		key: 'task.updateStatus',
		version: '1.0.0',
		description: 'Toggle task done status.',
		goal: 'Mark a task as done or not done.',
		context: 'Used by TaskListScreen checkbox.',
		owners: ['@platform.core'],
		tags: ['task', 'mobile'],
		stability: 'experimental',
	},
	io: {
		input: TaskUpdateStatusInput,
		output: TaskRecord,
	},
	policy: {
		auth: 'anonymous',
	},
});
