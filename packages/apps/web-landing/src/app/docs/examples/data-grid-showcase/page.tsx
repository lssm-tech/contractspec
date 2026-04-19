import { ExampleShowcasePage } from '@contractspec/bundle.library';
import type { Metadata } from 'next';
import { DataGridShowcaseDocsClient } from './DataGridShowcaseDocsClient';

export const metadata: Metadata = {
	title: 'Data Grid Showcase Example | ContractSpec Docs',
	description:
		'Canonical docs lane for the Data Grid Showcase: embedded live demo, sandbox preview, generated reference, LLMS package page, and local run commands.',
	openGraph: {
		title: 'Data Grid Showcase Example | ContractSpec Docs',
		description:
			'Canonical docs lane for the Data Grid Showcase: embedded live demo, sandbox preview, generated reference, LLMS package page, and local run commands.',
		url: 'https://www.contractspec.io/docs/examples/data-grid-showcase',
		type: 'article',
	},
	alternates: {
		canonical: 'https://www.contractspec.io/docs/examples/data-grid-showcase',
	},
};

export default function DataGridShowcaseExamplePage() {
	return (
		<div className="space-y-10">
			<ExampleShowcasePage exampleKey="data-grid-showcase" />
			<DataGridShowcaseDocsClient />
		</div>
	);
}
