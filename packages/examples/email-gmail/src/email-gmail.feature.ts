import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const EmailGmailFeature = defineFeature({
	meta: {
		key: 'email-gmail',
		version: '1.0.0',
		title: 'Gmail Integration',
		description:
			'Gmail integration with OAuth, inbound thread reading, and outbound messaging',
		domain: 'integration',
		owners: ['@examples'],
		tags: ['email', 'gmail', 'integration', 'oauth'],
		stability: 'experimental',
	},

	integrations: [{ key: 'email-gmail.integration.gmail', version: '1.0.0' }],

	docs: ['docs.examples.email-gmail', 'docs.examples.email-gmail.usage'],
});
