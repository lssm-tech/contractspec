import { createBuilderCommand } from './shared';

export const BuilderConversationStartCommand = createBuilderCommand(
	'builder.conversation.start',
	'Start Builder Conversation',
	'Start a new Builder conversation.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderConversationPauseCommand = createBuilderCommand(
	'builder.conversation.pause',
	'Pause Builder Conversation',
	'Pause a Builder conversation.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderConversationResumeCommand = createBuilderCommand(
	'builder.conversation.resume',
	'Resume Builder Conversation',
	'Resume a Builder conversation.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderConversationArchiveCommand = createBuilderCommand(
	'builder.conversation.archive',
	'Archive Builder Conversation',
	'Archive a Builder conversation.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderConversationBindChannelCommand = createBuilderCommand(
	'builder.conversation.bindChannel',
	'Bind Conversation Channel',
	'Bind a Builder conversation to a channel identity.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderConversationUnbindChannelCommand = createBuilderCommand(
	'builder.conversation.unbindChannel',
	'Unbind Conversation Channel',
	'Unbind a Builder conversation from a channel identity.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);

export const BUILDER_CONVERSATION_COMMANDS = [
	BuilderConversationStartCommand,
	BuilderConversationPauseCommand,
	BuilderConversationResumeCommand,
	BuilderConversationArchiveCommand,
	BuilderConversationBindChannelCommand,
	BuilderConversationUnbindChannelCommand,
] as const;
