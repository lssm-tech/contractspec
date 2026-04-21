import {
	getGeneratedDocById,
	listGeneratedDocs,
} from '@contractspec/bundle.library/components/docs/generated';
import { DocsReferencePage } from '@contractspec/bundle.library/components/docs/reference/DocsReferencePage';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

interface DocsReferenceSlugPageProps {
	params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
	const docs = await listGeneratedDocs();
	return docs.map((doc) => ({ slug: doc.id.split('/') }));
}

export async function generateMetadata({
	params,
}: DocsReferenceSlugPageProps): Promise<Metadata> {
	const slug = (await params).slug?.join('/') ?? '';
	const doc = await getGeneratedDocById(slug);

	if (!doc) {
		return {
			title: 'Reference | ContractSpec Docs',
			description:
				'Generated reference material for ContractSpec public surfaces.',
		};
	}

	const title = `${doc.entry.title ?? doc.entry.id} | ContractSpec Reference`;
	const description =
		doc.entry.summary ??
		'Generated reference material for ContractSpec public surfaces.';
	const url = `https://www.contractspec.io/docs/reference/${slug}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url,
			type: 'article',
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function DocsReferenceSlugPage({
	params,
}: DocsReferenceSlugPageProps) {
	const slug = (await params).slug?.join('/') ?? '';
	const doc = await getGeneratedDocById(slug);

	if (!doc) {
		notFound();
	}

	return <DocsReferencePage entry={doc.entry} content={doc.content} />;
}
