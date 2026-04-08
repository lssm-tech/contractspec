import { createBuilderCommand } from './shared';

export const BuilderParticipantBindingBindCommand = createBuilderCommand(
	'builder.participantBinding.bind',
	'Bind Builder Participant',
	'Bind a workspace participant to a Builder control channel.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderParticipantBindingUpdateCommand = createBuilderCommand(
	'builder.participantBinding.update',
	'Update Builder Participant Binding',
	'Update Builder participant binding actions, trust, or approval strength.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderParticipantBindingRevokeCommand = createBuilderCommand(
	'builder.participantBinding.revoke',
	'Revoke Builder Participant Binding',
	'Revoke a Builder participant binding.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);

export const BUILDER_BINDING_COMMANDS = [
	BuilderParticipantBindingBindCommand,
	BuilderParticipantBindingUpdateCommand,
	BuilderParticipantBindingRevokeCommand,
] as const;
