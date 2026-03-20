import { ExampleShowcasePage } from '@contractspec/bundle.library';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Agent Console Example | ContractSpec Docs',
	description:
		'Meetup-ready docs lane for the Agent Console example: sandbox preview, generated reference, LLMS package page, and local commands.',
	openGraph: {
		title: 'Agent Console Example | ContractSpec Docs',
		description:
			'Meetup-ready docs lane for the Agent Console example: sandbox preview, generated reference, LLMS package page, and local commands.',
		url: 'https://www.contractspec.io/docs/examples/agent-console',
		type: 'article',
	},
	alternates: {
		canonical: 'https://www.contractspec.io/docs/examples/agent-console',
	},
};

export default function AgentConsoleExamplePage() {
	return <ExampleShowcasePage exampleKey="agent-console" />;
}
