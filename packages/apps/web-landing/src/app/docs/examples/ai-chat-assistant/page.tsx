import { ExampleShowcasePage } from '@contractspec/bundle.library';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'AI Chat Assistant Example | ContractSpec Docs',
	description:
		'Meetup-ready docs lane for the AI Chat Assistant example: sandbox preview, generated reference, LLMS package page, and local commands.',
	openGraph: {
		title: 'AI Chat Assistant Example | ContractSpec Docs',
		description:
			'Meetup-ready docs lane for the AI Chat Assistant example: sandbox preview, generated reference, LLMS package page, and local commands.',
		url: 'https://www.contractspec.io/docs/examples/ai-chat-assistant',
		type: 'article',
	},
	alternates: {
		canonical:
			'https://www.contractspec.io/docs/examples/ai-chat-assistant',
	},
};

export default function AiChatAssistantExamplePage() {
	return <ExampleShowcasePage exampleKey="ai-chat-assistant" />;
}
