import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
	meta: {
		key: 'surface-runtime.messages',
		version: '1.0.0',
		domain: 'surface-runtime',
		description: 'User-facing strings for surface-runtime UI components',
		owners: ['platform'],
		stability: 'experimental',
	},
	locale: 'en',
	fallback: 'en',
	messages: {
		'overlay.conflicts.title': {
			value: 'Overlay conflicts',
			description: 'Title for overlay conflict resolution banner',
		},
		'overlay.conflicts.keepScope': {
			value: 'Keep {scope}',
			description: 'Button to keep overlay from scope A or B',
		},
		'patch.accept': {
			value: 'Accept',
			description: 'Accept patch proposal button',
		},
		'patch.reject': {
			value: 'Reject',
			description: 'Reject patch proposal button',
		},
		'patch.addWidget': {
			value: 'Add {title} to {slot}',
			description: 'Insert node proposal summary',
		},
		'patch.removeItem': {
			value: 'Remove item',
			description: 'Remove node proposal summary',
		},
		'patch.switchLayout': {
			value: 'Switch to {layoutId} layout',
			description: 'Set layout proposal summary',
		},
		'patch.showField': {
			value: 'Show field {fieldId}',
			description: 'Reveal field proposal summary',
		},
		'patch.hideField': {
			value: 'Hide field {fieldId}',
			description: 'Hide field proposal summary',
		},
		'patch.moveTo': {
			value: 'Move to {slot}',
			description: 'Move node proposal summary',
		},
		'patch.replaceItem': {
			value: 'Replace item',
			description: 'Replace node proposal summary',
		},
		'patch.promote': {
			value: 'Promote {actionId}',
			description: 'Promote action proposal summary',
		},
		'patch.changes': {
			value: '{count} changes',
			description: 'Multiple patch ops summary',
		},
	},
});
