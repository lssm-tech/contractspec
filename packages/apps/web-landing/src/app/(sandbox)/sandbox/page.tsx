import type { Metadata } from 'next';
import SandboxExperienceClient from './SandboxExperienceClient';

export const metadata: Metadata = {
	title: 'Sandbox – ContractSpec',
	description:
		'Explore the deterministic agent-console sandbox and other spec-first templates in your browser. Fully local runtime, no infrastructure required.',
	keywords: [
		'sandbox',
		'agent console',
		'autonomous agents',
		'playground',
		'interactive demo',
		'templates',
		'spec-first workflows',
		'browser development',
		'local runtime',
	],
	openGraph: {
		title: 'Sandbox – ContractSpec',
		description:
			'Explore the deterministic agent-console sandbox and other spec-first templates in your browser. Fully local runtime, no infrastructure required.',
		url: 'https://www.contractspec.io/sandbox',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Sandbox – ContractSpec',
		description:
			'Explore the deterministic agent-console sandbox and other spec-first templates in your browser. Fully local runtime, no infrastructure required.',
	},
	alternates: {
		canonical: 'https://www.contractspec.io/sandbox',
	},
};

export default function SandboxPage() {
	return <SandboxExperienceClient />;
}
