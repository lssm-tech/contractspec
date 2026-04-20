import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesCalendarGoogleExample = defineExample({
	meta: {
		key: 'calendar-google',
		version: '1.0.0',
		title: 'Calendar Google',
		description: 'Google Calendar integration example: list and create events.',
		kind: 'template',
		visibility: 'public',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'calendar-google'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.calendar-google',
	},
});

export default ExamplesCalendarGoogleExample;
export { ExamplesCalendarGoogleExample };
