import { notFound } from 'next/navigation';
import {
  DocsReferencePage,
  getGeneratedDocById,
  listGeneratedDocs,
} from '@contractspec/bundle.library';

export const dynamic = 'force-static';

interface DocsReferenceSlugPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const docs = await listGeneratedDocs();
  return docs.map((doc) => ({ slug: doc.id.split('/') }));
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
