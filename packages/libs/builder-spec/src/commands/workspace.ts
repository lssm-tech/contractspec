import { createBuilderCommand } from './shared';

export const BuilderWorkspaceCreateCommand = createBuilderCommand(
	'builder.workspace.create',
	'Create Builder Workspace',
	'Create a new Builder workspace.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderWorkspaceRenameCommand = createBuilderCommand(
	'builder.workspace.rename',
	'Rename Builder Workspace',
	'Rename an existing Builder workspace.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderWorkspaceArchiveCommand = createBuilderCommand(
	'builder.workspace.archive',
	'Archive Builder Workspace',
	'Archive a Builder workspace.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);

export const BUILDER_WORKSPACE_COMMANDS = [
	BuilderWorkspaceCreateCommand,
	BuilderWorkspaceRenameCommand,
	BuilderWorkspaceArchiveCommand,
] as const;
