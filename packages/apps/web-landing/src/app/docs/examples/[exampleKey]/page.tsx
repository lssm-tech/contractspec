import { ExampleShowcasePage } from '@contractspec/bundle.library';
import {
	buildExampleDocsHref,
	getPublicExample,
	supportsInlineExamplePreview,
} from '@contractspec/module.examples';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExampleInlinePreviewSection } from '../ExampleInlinePreviewSection';
import {
	isPublicExampleKey,
	listPublicExampleRouteParams,
} from '../example-doc-routes';

interface PageProps {
	params: Promise<{ exampleKey: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
	return listPublicExampleRouteParams();
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { exampleKey } = await params;
	const decodedKey = decodeURIComponent(exampleKey);
	const example = getPublicExample(decodedKey);

	if (!example) {
		return {
			title: 'Example Not Found | ContractSpec Docs',
		};
	}

	const title = example.meta.title ?? example.meta.key;
	const description =
		example.meta.summary ??
		example.meta.description ??
		'Public ContractSpec example with docs, reference material, and preview paths.';
	const docsHref = buildExampleDocsHref(decodedKey);

	return {
		title: `${title} Example | ContractSpec Docs`,
		description,
		openGraph: {
			title: `${title} Example | ContractSpec Docs`,
			description,
			url: `https://www.contractspec.io${docsHref}`,
			type: 'article',
		},
		alternates: {
			canonical: `https://www.contractspec.io${docsHref}`,
		},
	};
}

export default async function ExampleDocsPage({ params }: PageProps) {
	const { exampleKey } = await params;
	const decodedKey = decodeURIComponent(exampleKey);

	if (!isPublicExampleKey(decodedKey)) {
		notFound();
	}

	return (
		<div className="space-y-10">
			<ExampleShowcasePage exampleKey={decodedKey} />
			{supportsInlineExamplePreview(decodedKey) ? (
				<ExampleInlinePreviewSection exampleKey={decodedKey} />
			) : null}
		</div>
	);
}
