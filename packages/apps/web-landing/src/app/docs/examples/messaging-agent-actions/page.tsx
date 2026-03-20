import { ExampleShowcasePage } from '@contractspec/bundle.library';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Messaging Agent Actions Example | ContractSpec Docs',
	description:
		'Meetup-ready docs lane for the Messaging Agent Actions example: sandbox preview, generated reference, LLMS package page, and local commands.',
	openGraph: {
		title: 'Messaging Agent Actions Example | ContractSpec Docs',
		description:
			'Meetup-ready docs lane for the Messaging Agent Actions example: sandbox preview, generated reference, LLMS package page, and local commands.',
		url: 'https://www.contractspec.io/docs/examples/messaging-agent-actions',
		type: 'article',
	},
	alternates: {
		canonical:
			'https://www.contractspec.io/docs/examples/messaging-agent-actions',
	},
};

export default function MessagingAgentActionsExamplePage() {
	return <ExampleShowcasePage exampleKey="messaging-agent-actions" />;
}
