import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

const guides = [
  {
    title: 'Contract types overview',
    description:
      'Learn about the different contract types and when to use each one.',
    href: '/docs/guides/contract-types',
    time: '15 min',
  },
  {
    title: 'Next.js: one endpoint',
    description:
      'Add ContractSpec to an existing Next.js app by wiring one operation end-to-end.',
    href: '/docs/guides/nextjs-one-endpoint',
    time: '25 min',
  },
  {
    title: 'Import existing codebases',
    description:
      'Convert your existing API endpoints into ContractSpec contracts for fast onboarding.',
    href: '/docs/guides/import-existing-codebases',
    time: '20 min',
  },
  {
    title: 'Spec-driven validation + typing',
    description:
      'Define operations with SchemaModel, generate types, and enforce validation without rewrites.',
    href: '/docs/guides/spec-validation-and-typing',
    time: '20 min',
  },
  {
    title: 'Generate docs + client schemas',
    description:
      'Export docs and OpenAPI for client SDKs and tooling from your specs.',
    href: '/docs/guides/generate-docs-clients-schemas',
    time: '20 min',
  },
  {
    title: 'CI gating with deterministic diffs',
    description:
      'Add ContractSpec CI checks to gate breaking changes and drift.',
    href: '/docs/guides/ci-contract-diff-gating',
    time: '15 min',
  },
];

export function GuidesIndexPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Guides</h1>
        <p className="text-muted-foreground text-lg">
          Hands-on guides with commands, expected output, and CI-verified
          example packages.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="card-subtle group space-y-3 p-6 transition-colors hover:border-violet-500/50"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-violet-400">
                {guide.title}
              </h2>
              <ArrowRight className="text-violet-400" size={18} />
            </div>
            <p className="text-muted-foreground text-sm">{guide.description}</p>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <CheckCircle2 size={14} />
              <span>Target time: {guide.time}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="card-subtle space-y-4 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-violet-400 uppercase">
          <BookOpen size={16} />
          How to use the guides
        </div>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>Run each guide in a fresh branch or sandbox workspace.</li>
          <li>Use the linked example package to validate end-to-end.</li>
          <li>Keep the commands as written to match CI expectations.</li>
        </ul>
        <CodeBlock
          language="bash"
          filename="guides-quickstart"
          code={`# list all examples
contractspec examples list

# validate example packages in this repo
contractspec examples validate --repo-root .`}
        />
      </div>
    </div>
  );
}
