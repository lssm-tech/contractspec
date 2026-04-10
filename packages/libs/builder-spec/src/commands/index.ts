export * from './authoring';
export * from './bindings';
export * from './control-plane';
export * from './conversation';
export * from './ingestion';
export * from './lifecycle';
export * from './shared';
export * from './workspace';

import { BUILDER_AUTHORING_COMMANDS } from './authoring';
import { BUILDER_BINDING_COMMANDS } from './bindings';
import { BUILDER_CONTROL_PLANE_COMMANDS } from './control-plane';
import { BUILDER_CONVERSATION_COMMANDS } from './conversation';
import { BUILDER_INGESTION_COMMANDS } from './ingestion';
import { BUILDER_LIFECYCLE_COMMANDS } from './lifecycle';
import { BUILDER_WORKSPACE_COMMANDS } from './workspace';

export const BUILDER_COMMANDS = [
	...BUILDER_WORKSPACE_COMMANDS,
	...BUILDER_BINDING_COMMANDS,
	...BUILDER_CONVERSATION_COMMANDS,
	...BUILDER_INGESTION_COMMANDS,
	...BUILDER_AUTHORING_COMMANDS,
	...BUILDER_CONTROL_PLANE_COMMANDS,
	...BUILDER_LIFECYCLE_COMMANDS,
] as const;
