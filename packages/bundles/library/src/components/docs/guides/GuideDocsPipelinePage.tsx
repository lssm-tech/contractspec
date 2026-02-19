import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

export function GuideDocsPipelinePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Build the docs pipeline</h1>
        <p className="text-muted-foreground text-lg">
          Generate reference docs, chunk the index, and wire the docs pages the
          same way this repo does.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">What you'll build</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>Generated Markdown and a chunked index manifest.</li>
          <li>Reference routes powered by the docs loader.</li>
          <li>Versioned outputs you can publish per release.</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">1) Generate contract docs</h2>
          <CodeBlock
            language="bash"
            filename="generate-contract-docs"
            code={`contractspec generate`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: Markdown in <code>generated/docs</code>.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2) Build the docs index</h2>
          <CodeBlock
            language="bash"
            filename="docs-generate"
            code={`bun docs:generate
# versioned output
bun docs:generate -- --version v1.0.0`}
          />
          <p className="text-muted-foreground text-sm">
            This writes <code>docs-index.manifest.json</code> and chunked
            <code>docs-index.*.json</code> files in the generated docs bundle.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3) Wire reference routes</h2>
          <CodeBlock
            language="tsx"
            filename="docs-reference-route"
            code={`import { notFound } from "next/navigation";
import {
  DocsReferenceIndexPage,
  DocsReferencePage,
  getGeneratedDocById,
  listGeneratedDocs,
} from "@contractspec/bundle.library";

export async function generateStaticParams() {
  const docs = await listGeneratedDocs();
  return docs.map((doc) => ({ slug: doc.id.split("/") }));
}

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug?.join("/") ?? "";
  const doc = await getGeneratedDocById(slug);
  if (!doc) notFound();
  return <DocsReferencePage entry={doc.entry} content={doc.content} />;
}`}
          />
          <p className="text-muted-foreground text-sm">
            Use the index page on <code>/docs/reference</code> to render the
            searchable list.
          </p>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h3 className="text-lg font-semibold">Repo reference</h3>
          <p className="text-muted-foreground text-sm">
            This repo wires docs under{' '}
            <code>packages/apps/web-landing/src/app/docs/reference</code>.
          </p>
        </div>

        <StudioPrompt
          title="Need decision-to-export automation?"
          body="Studio exports evidence-backed spec changes and task packs to Linear, Jira, Notion, and GitHub."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/ci-contract-diff-gating"
          className="btn-primary"
        >
          Next: CI gating <ChevronRight size={16} />
        </Link>
        <Link href="/docs/guides" className="btn-ghost">
          Back to guides
        </Link>
      </div>
    </div>
  );
}
