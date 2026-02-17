import Link from '@contractspec/lib.ui-link';

interface StudioPromptProps {
  title?: string;
  body?: string;
  ctaLabel?: string;
  href?: string;
}

export function StudioPrompt({
  title = 'Want to turn product signals into spec-first deliverables?',
  body = 'ContractSpec Studio ingests evidence from meetings, support, analytics, docs, and code, then compiles decisions into spec diffs and task packs.',
  ctaLabel = 'Try Studio',
  href = 'https://app.contractspec.studio',
}: StudioPromptProps) {
  return (
    <div className="card-subtle space-y-3 p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{body}</p>
      <Link href={href} className="btn-primary">
        {ctaLabel}
      </Link>
    </div>
  );
}
