import { defineFeature } from '@contractspec/lib.contracts-spec';

export const CalendarGoogleFeature = defineFeature({
	meta: {
		key: 'calendar-google',
		version: '1.0.0',
		title: 'Google Calendar Integration',
		description:
			'Google Calendar integration with OAuth, event listing, and sync',
		domain: 'integration',
		owners: ['@examples'],
		tags: ['calendar', 'google', 'integration', 'oauth'],
		stability: 'experimental',
	},

	integrations: [{ key: 'calendar-google.integration.gcal', version: '1.0.0' }],

	docs: [
		'docs.examples.calendar-google',
		'docs.examples.calendar-google.usage',
	],
});
